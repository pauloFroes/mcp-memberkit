import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiRequest, apiRequestPaginated, toolResult, toolError } from "../client.js";

export function registerRankingTools(server: McpServer) {
  server.registerTool(
    "list_rankings",
    {
      title: "List Rankings",
      description:
        "List member rankings (leaderboard). Returns position, score, and user data for each entry. Optionally filter by classroom ID. Supports pagination.",
      inputSchema: {
        page: z
          .string()
          .optional()
          .describe("Page number for pagination (default: 1)"),
        classroom_id: z
          .string()
          .optional()
          .describe("Filter rankings by classroom ID"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ page, classroom_id }) => {
      try {
        const data = await apiRequestPaginated("/rankings", {
          page,
          classroom_id,
        });
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to list rankings: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "create_score",
    {
      title: "Create Score",
      description:
        "Award points to a member. Requires a reason, point value, member email, and course ID.",
      inputSchema: {
        reason: z.string().describe("Reason for the score award"),
        value: z.number().describe("Number of points to award"),
        user_email: z
          .string()
          .describe("Email of the member to award points to"),
        course_id: z.number().describe("Course ID for the score context"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ reason, value, user_email, course_id }) => {
      try {
        const data = await apiRequest("/scores", "POST", {
          reason,
          value,
          user_email,
          course_id,
        });
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to create score: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "delete_score",
    {
      title: "Delete Score",
      description:
        "Remove a score entry by matching user email, reason, and course ID. This action is irreversible.",
      inputSchema: {
        user_email: z
          .string()
          .describe("Email of the member whose score to delete"),
        reason: z.string().describe("Reason string that matches the score"),
        course_id: z.string().describe("Course ID (integer)"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async ({ user_email, reason, course_id }) => {
      try {
        await apiRequest("/scores", "DELETE", undefined, {
          user_email,
          reason,
          course_id,
        });
        return toolResult({
          success: true,
          message: "Score deleted",
        });
      } catch (error) {
        return toolError(
          `Failed to delete score: ${(error as Error).message}`,
        );
      }
    },
  );
}
