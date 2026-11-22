import * as Template1 from "./temp1"; // make sure folder name matches your path

export const templates = {
    template1: {
        id: "template1",
        name: "Template1",
        layout: Template1.layout,
    },
};

export function getTemplate(templateId) {
    return templates[templateId] ?? templates.template1;
}
