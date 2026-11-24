import { auth } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from '@/libs/db.js';
import User from '@/models/User.js';
import { app } from "@/libs/github.js";
import { saveInstallationRepositories } from "@/libs/github-installations.js";

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
    const repositories = await octokit.paginate(
        octokit.rest.apps.listReposAccessibleToInstallation,
        { per_page: 100 }
    );
    if (repositories.length === 0) {
        return Response.redirect(`${origin}/pages/dashboard?install=norepo`);
    }
    
    await dbConnect();
    const user = await User.findOne({ githubId: String(session.user.githubId) });
    if (!user) return new Response("Authenticated user was not found", { status: 404 });

    await saveInstallationRepositories(user._id, installationId, repositories);
    for (const repo of repositories) {
        console.log(`${origin}/pages/${repo.owner.login}/${repo.name}?installation_id=${installationId}`);
    }
    return Response.redirect(`${origin}/pages/dashboard`);
}