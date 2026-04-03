import sanitizeHtml from "sanitize-html";

export default function sanitizeInput(value: string) {
    return sanitizeHtml(value, {
        allowedAttributes: {},
        allowedTags: []
    })
}