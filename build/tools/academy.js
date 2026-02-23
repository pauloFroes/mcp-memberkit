import { apiRequest, toolResult, toolError } from "../client.js";
export function registerAcademyTools(server) {
    server.registerTool("get_academy", {
        title: "Get Academy",
        description: "Get the authenticated membership area (academy) details. Returns name, subdomain, custom domain, email, URL, and timestamps.",
        inputSchema: {},
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async () => {
        try {
            const data = await apiRequest("/academy");
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to get academy: ${error.message}`);
        }
    });
}
