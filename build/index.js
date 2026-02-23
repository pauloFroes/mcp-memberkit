#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAcademyTools } from "./tools/academy.js";
import { registerCourseTools } from "./tools/courses.js";
import { registerClassroomTools } from "./tools/classrooms.js";
import { registerUserTools } from "./tools/users.js";
import { registerMembershipTools } from "./tools/memberships.js";
import { registerCommentTools } from "./tools/comments.js";
import { registerHookTools } from "./tools/hooks.js";
import { registerRankingTools } from "./tools/rankings.js";
import { registerQuizTools } from "./tools/quizzes.js";
const server = new McpServer({
    name: "mcp-memberkit",
    version: "1.0.0",
});
registerAcademyTools(server);
registerCourseTools(server);
registerClassroomTools(server);
registerUserTools(server);
registerMembershipTools(server);
registerCommentTools(server);
registerHookTools(server);
registerRankingTools(server);
registerQuizTools(server);
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("mcp-memberkit server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
