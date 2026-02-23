import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiRequest, apiRequestPaginated, toolResult, toolError } from "../client.js";

export function registerUserTools(server: McpServer) {
  server.registerTool(
    "list_users",
    {
      title: "List Users",
      description:
        "List all members (users) in the membership area. Supports pagination and SQL-like query filtering on attributes like enrollments, subscriptions, certificates, and lessons.",
      inputSchema: {
        page: z
          .string()
          .optional()
          .describe("Page number for pagination (default: 1)"),
        query: z
          .string()
          .optional()
          .describe(
            "SQL-like filter query for members (e.g. filter by enrollment status, subscription, etc.)",
          ),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ page, query }) => {
      try {
        const data = await apiRequestPaginated("/users", { page, query });
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to list users: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "get_user",
    {
      title: "Get User",
      description:
        "Get full details of a specific member by ID or email. Returns profile info, blocked/unlimited status, metadata (cpf_cnpj, phone), enrollments, and memberships.",
      inputSchema: {
        user_id: z
          .string()
          .describe("User ID (integer) or email address"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ user_id }) => {
      try {
        const data = await apiRequest(`/users/${user_id}`);
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to get user: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "create_user",
    {
      title: "Create User",
      description:
        "Create a new member in the membership area. Required: full_name, email, status. Optionally assign to classrooms, membership level, set expiration, block, or set unlimited access.",
      inputSchema: {
        full_name: z.string().describe("Full name of the member"),
        email: z.string().describe("Email address of the member"),
        status: z
          .enum(["inactive", "pending", "active", "expired"])
          .describe("Member status: inactive, pending, active, or expired"),
        blocked: z
          .boolean()
          .optional()
          .describe("Whether the member is blocked (banned)"),
        unlimited: z
          .boolean()
          .optional()
          .describe("Whether the member has unlimited access"),
        classroom_ids: z
          .array(z.number())
          .optional()
          .describe("Array of classroom IDs to enroll the member in"),
        membership_level_id: z
          .number()
          .optional()
          .describe("Membership level ID to assign"),
        expires_at: z
          .string()
          .optional()
          .describe("Expiration date in ISO 8601 format"),
        cpf_cnpj: z
          .string()
          .optional()
          .describe("Brazilian CPF or CNPJ document number"),
        phone_local_code: z
          .string()
          .optional()
          .describe("Phone area code (DDD)"),
        phone_number: z
          .string()
          .optional()
          .describe("Phone number"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({
      full_name,
      email,
      status,
      blocked,
      unlimited,
      classroom_ids,
      membership_level_id,
      expires_at,
      cpf_cnpj,
      phone_local_code,
      phone_number,
    }) => {
      try {
        const body: Record<string, unknown> = {
          full_name,
          email,
          status,
        };
        if (blocked !== undefined) body.blocked = blocked;
        if (unlimited !== undefined) body.unlimited = unlimited;
        if (classroom_ids) body.classroom_ids = classroom_ids;
        if (membership_level_id !== undefined)
          body.membership_level_id = membership_level_id;
        if (expires_at) body.expires_at = expires_at;
        if (cpf_cnpj) body.cpf_cnpj = cpf_cnpj;
        if (phone_local_code) body.phone_local_code = phone_local_code;
        if (phone_number) body.phone_number = phone_number;

        const data = await apiRequest("/users", "POST", body);
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to create user: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "update_user",
    {
      title: "Update User",
      description:
        "Update an existing member's details. Can change name, email, password, bio, blocked/unlimited status, timezone, and metadata (cpf_cnpj, phone).",
      inputSchema: {
        user_id: z.string().describe("User ID (integer)"),
        full_name: z.string().optional().describe("New full name"),
        email: z.string().optional().describe("New email address"),
        password: z
          .string()
          .optional()
          .describe("New password (minimum 6 characters)"),
        bio: z.string().optional().describe("New bio text"),
        unlimited: z
          .boolean()
          .optional()
          .describe("Whether the member has unlimited access"),
        blocked: z
          .boolean()
          .optional()
          .describe("Whether the member is blocked (banned)"),
        time_zone: z.string().optional().describe("Timezone string"),
        cpf_cnpj: z.string().optional().describe("Brazilian CPF or CNPJ"),
        phone_local_code: z
          .string()
          .optional()
          .describe("Phone area code (DDD)"),
        phone_number: z.string().optional().describe("Phone number"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({
      user_id,
      full_name,
      email,
      password,
      bio,
      unlimited,
      blocked,
      time_zone,
      cpf_cnpj,
      phone_local_code,
      phone_number,
    }) => {
      try {
        const body: Record<string, unknown> = {};
        if (full_name) body.full_name = full_name;
        if (email) body.email = email;
        if (password) body.password = password;
        if (bio !== undefined) body.bio = bio;
        if (unlimited !== undefined) body.unlimited = unlimited;
        if (blocked !== undefined) body.blocked = blocked;
        if (time_zone) body.time_zone = time_zone;

        const metadata: Record<string, string> = {};
        if (cpf_cnpj) metadata.cpf_cnpj = cpf_cnpj;
        if (phone_local_code) metadata.phone_local_code = phone_local_code;
        if (phone_number) metadata.phone_number = phone_number;
        if (Object.keys(metadata).length > 0) body.metadata = metadata;

        const data = await apiRequest(`/users/${user_id}`, "PUT", body);
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to update user: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "delete_user",
    {
      title: "Delete User",
      description:
        "Permanently delete a member from the membership area. This action is irreversible.",
      inputSchema: {
        user_id: z.string().describe("User ID (integer) to delete"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async ({ user_id }) => {
      try {
        await apiRequest(`/users/${user_id}`, "DELETE");
        return toolResult({ success: true, message: `User ${user_id} deleted` });
      } catch (error) {
        return toolError(
          `Failed to delete user: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "get_user_activities",
    {
      title: "Get User Activities",
      description:
        "Get activity log for a specific member. Returns activities with course/lesson IDs, trackable type, and timestamps. Supports pagination.",
      inputSchema: {
        user_id: z.string().describe("User ID (integer)"),
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
    async ({ user_id, page }) => {
      try {
        const data = await apiRequestPaginated(
          `/users/${user_id}/activities`,
          { page },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to get user activities: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "get_user_rankings",
    {
      title: "Get User Rankings",
      description:
        "Get ranking data for a specific member across courses. Returns score, progress, course/classroom IDs, and expiration date for each enrollment.",
      inputSchema: {
        user_id: z.string().describe("User ID (integer)"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ user_id }) => {
      try {
        const data = await apiRequest(`/users/${user_id}/rankings`);
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to get user rankings: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "generate_magic_link",
    {
      title: "Generate Magic Link",
      description:
        "Generate a magic login link (token) for a member by email. Returns a token and an authenticated URL that allows passwordless login.",
      inputSchema: {
        email: z
          .string()
          .describe("Email address of the member to generate the magic link for"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ email }) => {
      try {
        const data = await apiRequest("/tokens", "POST", { email });
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to generate magic link: ${(error as Error).message}`,
        );
      }
    },
  );
}
