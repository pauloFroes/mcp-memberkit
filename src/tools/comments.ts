import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiRequest, apiRequestPaginated, toolResult, toolError } from "../client.js";

export function registerCommentTools(server: McpServer) {
  server.registerTool(
    "list_comments",
    {
      title: "List Comments",
      description:
        "List all comments in the membership area. Filter by status (unread, pending, approved, rejected), sort by field and order. Returns comment content, status, lesson info, and user data.",
      inputSchema: {
        page: z
          .string()
          .optional()
          .describe("Page number for pagination (default: 1)"),
        filter: z
          .enum(["unread", "pending", "approved", "rejected"])
          .optional()
          .describe("Filter by comment status"),
        sort_by: z
          .enum(["id", "read_at", "created_at"])
          .optional()
          .describe("Sort field (default: created_at)"),
        sort_order: z
          .enum(["asc", "desc"])
          .optional()
          .describe("Sort order (default: desc)"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ page, filter, sort_by, sort_order }) => {
      try {
        const data = await apiRequestPaginated("/comments", {
          page,
          filter,
          sort_by,
          sort_order,
        });
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to list comments: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "get_comment",
    {
      title: "Get Comment",
      description:
        "Get details of a specific comment by ID. Returns comment content, status, parent comment ID, classroom ID, lesson info (with course), and user data.",
      inputSchema: {
        comment_id: z.string().describe("Comment ID (integer)"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ comment_id }) => {
      try {
        const data = await apiRequest(`/comments/${comment_id}`);
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to get comment: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "create_comment",
    {
      title: "Create Comment",
      description:
        "Create a new comment on a lesson. Requires content text, user ID, lesson ID, classroom ID, and status. Optionally reply to another comment via parent_id.",
      inputSchema: {
        content: z.string().describe("Comment text content"),
        user_id: z.number().describe("ID of the member posting the comment"),
        lesson_id: z.number().describe("ID of the lesson to comment on"),
        classroom_id: z
          .number()
          .describe("ID of the classroom context"),
        status: z
          .enum(["pending", "approved", "rejected"])
          .describe("Comment status: pending, approved, or rejected"),
        parent_id: z
          .number()
          .optional()
          .describe("ID of the parent comment (for replies)"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ content, user_id, lesson_id, classroom_id, status, parent_id }) => {
      try {
        const body: Record<string, unknown> = {
          content,
          user_id,
          lesson_id,
          classroom_id,
          status,
        };
        if (parent_id !== undefined) body.parent_id = parent_id;

        const data = await apiRequest("/comments", "POST", body);
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to create comment: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "approve_comment",
    {
      title: "Approve Comment",
      description: "Approve a pending comment by ID.",
      inputSchema: {
        comment_id: z.string().describe("Comment ID (integer) to approve"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ comment_id }) => {
      try {
        await apiRequest(`/comments/${comment_id}/approve`, "PUT");
        return toolResult({
          success: true,
          message: `Comment ${comment_id} approved`,
        });
      } catch (error) {
        return toolError(
          `Failed to approve comment: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "reject_comment",
    {
      title: "Reject Comment",
      description: "Reject a pending comment by ID.",
      inputSchema: {
        comment_id: z.string().describe("Comment ID (integer) to reject"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ comment_id }) => {
      try {
        await apiRequest(`/comments/${comment_id}/reject`, "PUT");
        return toolResult({
          success: true,
          message: `Comment ${comment_id} rejected`,
        });
      } catch (error) {
        return toolError(
          `Failed to reject comment: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "delete_comment",
    {
      title: "Delete Comment",
      description:
        "Permanently delete a comment by ID. This action is irreversible.",
      inputSchema: {
        comment_id: z.string().describe("Comment ID (integer) to delete"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async ({ comment_id }) => {
      try {
        await apiRequest(`/comments/${comment_id}`, "DELETE");
        return toolResult({
          success: true,
          message: `Comment ${comment_id} deleted`,
        });
      } catch (error) {
        return toolError(
          `Failed to delete comment: ${(error as Error).message}`,
        );
      }
    },
  );
}
