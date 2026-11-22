import { auth } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from '@/libs/db.js';
import User from '@/models/User.js';
import Installation from '@/models/Installation.js';
import { app } from "@/libs/github.js";

export async function GET(req) {
    const { searchParams, origin } = new URL(req.url);
    
    const installationId = searchParams.get('installation_id');
    const setupAction = searchParams.get('setup_action');
    
    const session = await auth();
    if (!session) return Response.redirect(`${origin}/pages/login`);
    if (!installationId || setupAction === "request") {
        return Response.redirect(`${origin}/pages/dashboard?install=pending`)
    }
    
    // get installation info from github
    const { data: inst } = await app.octokit.rest.apps.getInstallation({
        installation_id: Number(installationId),
    });
    if (String(inst.account.id) !== session.user.githubId) {
        return new Response("This installation is not yours", { status: 403 });
    }
    
    const octokit = await app.getInstallationOctokit(Number(installationId));
    const { data: repos } = await octokit.rest.apps.listReposAccessibleToInstallation();
    const repoFullName = repos.repositories[0]?.full_name;
    if (!repoFullName) return Response.redirect(`${origin}/pages/dashboard?install=norepo`);
    
    await dbConnect();
    const user = await User.findOne({ githubId: String(session.user.githubId) });
    await Installation.findOneAndUpdate(
        { installationId: String(installationId) },
        {
            userId: user._id,
            installationId: String(installationId),
            repoFullName,
            permissions: "read",
        },
        { upsert: true, runValidators: true }
    );

    console.log(`${origin}/pages/${user.username}/${repos.repositories[0]?.name}?installation_id=${installationId}`);
    return Response.redirect(`${origin}/pages/dashboard`);
}