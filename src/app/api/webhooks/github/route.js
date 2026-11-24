import { createHmac, timingSafeEqual } from "node:crypto";
import dbConnect from "@/libs/db.js";
import { saveInstallationRepositories } from "@/libs/github-installations.js";
import Installation from "@/models/Installation.js";
import User from "@/models/User.js";

function isValidSignature(rawBody, signature, secret) {
    if (!signature || !/^sha256=[a-f0-9]{64}$/i.test(signature)) return false;

    const expected = createHmac("sha256", secret).update(rawBody).digest();
    const actual = Buffer.from(signature.slice("sha256=".length), "hex");
    return timingSafeEqual(expected, actual);
}

export async function POST(req) {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
        console.error("GITHUB_WEBHOOK_SECRET is not configured");
        return new Response("Webhook is not configured", { status: 500 });
    }

    const rawBody = await req.text();
    if (!isValidSignature(rawBody, req.headers.get("x-hub-signature-256"), secret)) {
        return new Response("Invalid webhook signature", { status: 401 });
    }

    if (req.headers.get("x-github-event") !== "installation_repositories") {
        return Response.json({ received: true });
    }

    let payload;
    try {
        payload = JSON.parse(rawBody);
    } catch {
        return new Response("Invalid JSON payload", { status: 400 });
    }

    const installationId = payload.installation?.id;
    if (!installationId) {
        return new Response("Missing installation ID", { status: 400 });
    }

    await dbConnect();

    const existingInstallation = await Installation.findOne({
        installationId: String(installationId),
    }).select("userId").lean();
    let userId = existingInstallation?.userId;

    if (!userId && payload.installation?.account?.id) {
        const accountOwner = await User.findOne({
            githubId: String(payload.installation.account.id),
        }).select("_id").lean();
        userId = accountOwner?._id;
    }

    if (!userId) {
        console.error(`No user found for GitHub installation ${installationId}`);
        return new Response("Installation owner was not found", { status: 404 });
    }

    const origin = new URL(req.url).origin;
    if (payload.action === "added") {
        const repositories = payload.repositories_added;
        if (!Array.isArray(repositories)) {
            return new Response("Missing added repositories", { status: 400 });
        }

        await saveInstallationRepositories(userId, installationId, repositories);
        for (const repo of repositories) {
            console.log(`${origin}/pages/${repo.owner.login}/${repo.name}?installation_id=${installationId}`);
        }
    } else if (payload.action === "removed") {
        const repositories = payload.repositories_removed;
        if (!Array.isArray(repositories)) {
            return new Response("Missing removed repositories", { status: 400 });
        }

        await Installation.deleteMany({
            installationId: String(installationId),
            repoFullName: { $in: repositories.map((repo) => repo.full_name) },
        });
    }

    return Response.json({ received: true });
}