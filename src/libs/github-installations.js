import Installation from "@/models/Installation.js";

export async function saveInstallationRepositories(userId, installationId, repositories) {
    const installationIdString = String(installationId);

    return Promise.all(
        repositories.map((repo) => {
            const repoFullName = repo.full_name;
            return Installation.findOneAndUpdate(
                { installationId: installationIdString, repoFullName },
                {
                    $set: {
                        userId,
                        installationId: installationIdString,
                        repoFullName,
                        permissions: "read",
                    },
                },
                { upsert: true, runValidators: true, new: true }
            );
        })
    );
}