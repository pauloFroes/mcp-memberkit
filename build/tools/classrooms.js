import { z } from "zod";
import { apiRequest, toolResult, toolError } from "../client.js";
export function registerClassroomTools(server) {
    server.registerTool("list_classrooms", {
        title: "List Classrooms",
        description: "List all classrooms (turmas). Returns classroom name, whether it's the master classroom, associated course name, user count, comment count, average progress, and timestamps.",
        inputSchema: {},
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async () => {
        try {
            const data = await apiRequest("/classrooms");
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to list classrooms: ${error.message}`);
        }
    });
    server.registerTool("get_classroom", {
        title: "Get Classroom",
        description: "Get details of a specific classroom by ID. Returns name, master flag, course name, user count, comment count, average progress, and timestamps.",
        inputSchema: {
            classroom_id: z
                .string()
                .describe("Classroom ID (integer)"),
        },
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: true,
        },
    }, async ({ classroom_id }) => {
        try {
            const data = await apiRequest(`/classrooms/${classroom_id}`);
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to get classroom: ${error.message}`);
        }
    });
}
