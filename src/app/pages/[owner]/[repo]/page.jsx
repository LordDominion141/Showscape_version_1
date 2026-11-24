import { Suspense } from "react";
import MyRenderedPage from "@/libs/markdoc";
import { getTemplate } from "@/templates/index";
import { fetchReadme, extractShowscapeBlock } from "@/libs/github.js";
import { connection } from "next/server"
import Page from "@/models/Page";
import dbConnect from "@/libs/db";

// 1. Move runtime reads (params, searchParams) and DB/GitHub fetches into a child component
async function PreviewContent({ params, searchParams }) {
    await connection();
    const { owner, repo } = await params;
    const { installation_id: installationId } = await searchParams;

    let templateId = "template1";
    let markdownBlock = "";
    let errorMsg = null;

    try {
        await dbConnect();
        const page = await Page.findOne({ owner, repo }).lean();
        if (page?.templateId) templateId = page.templateId;
    } catch (dbErr) {
        console.error("Database lookup failed:", dbErr.message);
        // Falls back to "temp1" instead of crashing the whole route
    }

    if (installationId && owner && repo) {
        try {
            const readme = await fetchReadme(installationId, owner, repo);
            markdownBlock = await extractShowscapeBlock(readme);
        } catch (err) {
            errorMsg = err.message;
            console.log(errorMsg);
        }
    } else {
        markdownBlock = "### Missing URL parameters\nTo see your dynamic content, make sure your URL looks like: `/pages/my-user/my-repo?installation_id=123`";
    }

    const template = getTemplate(templateId);
    const Layout = template.layout;

    if (errorMsg) {
        return (
            <div style={{ color: "red", border: "1px solid red", padding: "1rem", borderRadius: "5px" }}>
                <strong>Error loading page:</strong> {errorMsg}
            </div>
        );
    }

    return (
        <Layout>
            <MyRenderedPage markdown={markdownBlock} />
        </Layout>
    );
}

// 2. Wrap the dynamic component in <Suspense> at the page level
export default function PreviewPage({ params, searchParams }) {
    return (
        <Suspense fallback={<div style={{ padding: "2rem" }}>Loading preview...</div>}>
            <PreviewContent params={params} searchParams={searchParams} />
        </Suspense>
    );
}
