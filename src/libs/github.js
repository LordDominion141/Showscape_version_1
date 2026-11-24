import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
// 1. IMPORT DEPENDENCES
import { App } from "octokit";
import fs from 'fs';

// 2. GET THE PEM FILE
function getPrivateKey() {
    const keyPath = process.env.GITHUB_APP_PRIVATE_KEY_PATH;
    if (keyPath) {
        return fs.readFileSync(keyPath, 'utf-8');
    }
    return process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, '\n');
}

// 3. INITIALIZE OCTOKIT APPLICATION
export const app = new App({
    appId: process.env.GITHUB_APP_ID,
    privateKey: getPrivateKey(),
});

// 4. CREATE FETCH README FUNCTION
export const fetchReadme = async (installationId, owner, repo ) => {
    const octokit = await app.getInstallationOctokit(installationId);
    const { data } = await octokit.rest.repos.getReadme({owner, repo});
    return Buffer.from(data.content, 'base64').toString('utf-8');
};

// 5. CREATE EXTRACT SHOWSCAPE BLOCK FUNCTION
export const extractShowscapeBlock = (readmeText) => {

    console.log(readmeText);
    return readmeText;
}