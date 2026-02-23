import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiRequest, apiRequestPaginated, toolResult, toolError } from "../client.js";

export function registerCourseTools(server: McpServer) {
  server.registerTool(
    "list_courses",
    {
      title: "List Courses",
      description:
        "List all courses in the membership area. Returns course name, description, position, image URL, checkout URL, category, and timestamps. Supports pagination.",
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
        const data = await apiRequestPaginated("/courses", { page });
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to list courses: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "get_course",
    {
      title: "Get Course",
      description:
        "Get full details of a specific course by ID. Returns course info including sections and their lessons (id, position, slug, title).",
      inputSchema: {
        course_id: z
          .string()
          .describe("Course ID (integer)"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ course_id }) => {
      try {
        const data = await apiRequest(`/courses/${course_id}`);
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to get course: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "get_lesson",
    {
      title: "Get Lesson",
      description:
        "Get full details of a specific lesson by ID. Returns content, video metadata (id, uid, source, duration, image), and attached files (url, filename, byte_size, content_type).",
      inputSchema: {
        lesson_id: z
          .string()
          .describe("Lesson ID (integer)"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ lesson_id }) => {
      try {
        const data = await apiRequest(`/lessons/${lesson_id}`);
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to get lesson: ${(error as Error).message}`,
        );
      }
    },
  );
}
