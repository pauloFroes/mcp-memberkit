import { z } from "zod";
import { apiRequest, apiRequestPaginated, toolResult, toolError } from "../client.js";
export function registerMembershipTools(server) {
    server.registerTool("list_memberships", {
        title: "List Memberships",
        description: "List all subscriptions (memberships). Returns membership status, level ID, expiration date, and associated user data. Filter by status and paginate.",
        inputSchema: {
            page: z
                .string()
                .optional()
                .describe("Page number for pagination (default: 1)"),
            status: z
                .enum(["inactive", "pending", "active", "expired"])
                .optional()
                .describe("Filter by membership status: inactive, pending, active, or expired"),
        },
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ page, status }) => {
        try {
            const data = await apiRequestPaginated("/memberships", {
                page,
                status,
            });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to list memberships: ${error.message}`);
        }
    });
    server.registerTool("list_membership_levels", {
        title: "List Membership Levels",
        description: "List all membership levels (subscription plans). Returns level name, trial period, associated classroom IDs, and timestamps.",
        inputSchema: {},
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async () => {
        try {
            const data = await apiRequest("/membership_levels");
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to list membership levels: ${error.message}`);
        }
    });
}
