import { z } from "zod";
import { apiRequest, apiRequestPaginated, toolResult, toolError } from "../client.js";
export function registerQuizTools(server) {
    server.registerTool("list_quiz_attempts", {
        title: "List Quiz Attempts",
        description: "List all quiz attempts. Returns answered/correct question counts, quiz info (id, title, description), user data, and timestamps. Supports pagination.",
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
    }, async ({ page }) => {
        try {
            const data = await apiRequestPaginated("/quiz_attempts", { page });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to list quiz attempts: ${error.message}`);
        }
    });
    server.registerTool("get_quiz_attempt", {
        title: "Get Quiz Attempt",
        description: "Get full details of a specific quiz attempt by ID. Returns question counts, quiz info, user data, timestamps, and individual question responses with answers and correctness.",
        inputSchema: {
            attempt_id: z.string().describe("Quiz attempt ID (integer)"),
        },
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ attempt_id }) => {
        try {
            const data = await apiRequest(`/quiz_attempts/${attempt_id}`);
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to get quiz attempt: ${error.message}`);
        }
    });
}
