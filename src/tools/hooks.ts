import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiRequest, apiRequestPaginated, toolResult, toolError } from "../client.js";

export function registerHookTools(server: McpServer) {
  server.registerTool(
    "list_hooks",
    {
      title: "List Webhooks",
      description:
        "List all configured webhooks. Returns webhook URL, status, monitored events, and timestamps. Supports pagination.",
      inputSchema: {
        page: z
          .string()
          .optional()
          .describe("Page number for pagination (default: 1)"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ page }) => {
      try {
        const data = await apiRequestPaginated("/hooks", { page });
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to list hooks: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "create_hook",
    {
      title: "Create Webhook",
      description:
        "Create a new webhook to receive event notifications. Requires a URL and an array of event names to monitor.",
      inputSchema: {
        url: z.string().describe("Notification URL for the webhook"),
        events: z
          .array(z.string())
          .describe("Array of event names to monitor"),
        status: z
          .enum(["inactive", "active"])
          .optional()
          .describe("Webhook status (default: active)"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ url, events, status }) => {
      try {
        const body: Record<string, unknown> = { url, events };
        if (status) body.status = status;

        const data = await apiRequest("/hooks", "POST", body);
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to create hook: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "update_hook",
    {
      title: "Update Webhook",
      description:
        "Update an existing webhook. Can change URL, status, and monitored events.",
      inputSchema: {
        hook_id: z.string().describe("Webhook ID (integer)"),
        url: z.string().optional().describe("New notification URL"),
        status: z
          .enum(["inactive", "active"])
          .optional()
          .describe("New webhook status"),
        events: z
          .array(z.string())
          .optional()
          .describe("New array of event names to monitor"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ hook_id, url, status, events }) => {
      try {
        const body: Record<string, unknown> = {};
        if (url) body.url = url;
        if (status) body.status = status;
        if (events) body.events = events;

        const data = await apiRequest(`/hooks/${hook_id}`, "PUT", body);
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to update hook: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "delete_hook",
    {
      title: "Delete Webhook",
      description:
        "Permanently delete a webhook by ID. This action is irreversible.",
      inputSchema: {
        hook_id: z.string().describe("Webhook ID (integer) to delete"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async ({ hook_id }) => {
      try {
        await apiRequest(`/hooks/${hook_id}`, "DELETE");
        return toolResult({
          success: true,
          message: `Webhook ${hook_id} deleted`,
        });
      } catch (error) {
        return toolError(
          `Failed to delete hook: ${(error as Error).message}`,
        );
      }
    },
  );
}
