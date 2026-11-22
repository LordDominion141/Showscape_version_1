import React from "react";
import Markdoc from "@markdoc/markdoc";
import {
    config as markdocConfig,
    components as markdocComponents,
} from "@/markdoc/config";

const MyRenderedPage = ({ markdown }) => {
    // 1. Guard against null/undefined/empty markdown
    if (!markdown || typeof markdown !== "string") {
        return (
            <main style={{ padding: "2rem" }}>
                <p>No Showscape block found in this repository&apos;s README.md.</p>
            </main>
        );
    }

    const ast = Markdoc.parse(markdown);
    const content = Markdoc.transform(ast, markdocConfig);

    return (
        <main>
            {Markdoc.renderers.react(content, React, {
                components: markdocComponents,
            })}
        </main>
    );
};

export default MyRenderedPage;
