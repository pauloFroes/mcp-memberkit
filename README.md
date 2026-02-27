<p align="center">
  <img src="assets/logo.png" alt="Memberkit MCP Server" width="200" />
</p>

# mcp-memberkit

MCP server that wraps the [Memberkit API](https://ajuda.memberkit.com.br/referencia-api/introducao) as semantic tools for LLM agents.

Works with **Claude Code**, **Codex**, **Claude Desktop**, **Cursor**, **VS Code**, **Windsurf**, and any MCP-compatible client.

---

## Prerequisites

- Node.js 18+
- Memberkit API key (found at `/academy/edit` in your Memberkit admin panel)

| Variable           | Where to find                              |
| ------------------ | ------------------------------------------ |
| `MEMBERKIT_API_KEY` | API key field in `/academy/edit` (admin only) |

## Installation

### Claude Code

Three installation scopes are available:

| Scope | Flag | Config file | Use case |
|-------|------|-------------|----------|
| **local** | `-s local` | `.mcp.json` | This project only (default) |
| **project** | `-s project` | `.claude/mcp.json` | Shared with team via git |
| **user** | `-s user` | `~/.claude/mcp.json` | All your projects |

**Quick setup (inline env vars):**

```bash
claude mcp add memberkit -s user \
  -e MEMBERKIT_API_KEY=your_key \
  -- npx -y github:pauloFroes/mcp-memberkit
```

> Replace `-s user` with `-s local` or `-s project` as needed.

**Persistent setup (.env file):**

Add to your `.mcp.json`:

```json
{
  "memberkit": {
    "command": "npx",
    "args": ["-y", "github:pauloFroes/mcp-memberkit"],
    "env": {
      "MEMBERKIT_API_KEY": "${MEMBERKIT_API_KEY}"
    }
  }
}
```

Then define the values in your `.env` file:

```
MEMBERKIT_API_KEY=your-api-key
```

> See `.env.example` for all required variables.

### Codex

Add to your Codex configuration:

```toml
[mcp_servers.memberkit]
command = "npx"
args = ["-y", "github:pauloFroes/mcp-memberkit"]
env_vars = ["MEMBERKIT_API_KEY"]
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "memberkit": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-memberkit"],
      "env": {
        "MEMBERKIT_API_KEY": "your_key"
      }
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "memberkit": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-memberkit"],
      "env": {
        "MEMBERKIT_API_KEY": "your_key"
      }
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "memberkit": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-memberkit"],
      "env": {
        "MEMBERKIT_API_KEY": "your_key"
      }
    }
  }
}
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "memberkit": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-memberkit"],
      "env": {
        "MEMBERKIT_API_KEY": "your_key"
      }
    }
  }
}
```

## Available Tools

### Academy

| Tool | Description |
|------|-------------|
| `get_academy` | Get membership area (academy) details |

### Courses & Lessons

| Tool | Description |
|------|-------------|
| `list_courses` | List all courses with pagination |
| `get_course` | Get course details with sections and lessons |
| `get_lesson` | Get lesson content, video metadata, and files |

### Classrooms

| Tool | Description |
|------|-------------|
| `list_classrooms` | List all classrooms (turmas) |
| `get_classroom` | Get classroom details by ID |

### Users

| Tool | Description |
|------|-------------|
| `list_users` | List members with SQL-like query filtering |
| `get_user` | Get member details by ID or email |
| `create_user` | Create a new member |
| `update_user` | Update member details |
| `delete_user` | Permanently delete a member |
| `get_user_activities` | Get member activity log |
| `get_user_rankings` | Get member rankings across courses |
| `generate_magic_link` | Generate passwordless login link |

### Memberships

| Tool | Description |
|------|-------------|
| `list_memberships` | List subscriptions with status filter |
| `list_membership_levels` | List subscription plans |

### Comments

| Tool | Description |
|------|-------------|
| `list_comments` | List comments with filter and sort options |
| `get_comment` | Get comment details by ID |
| `create_comment` | Create a new comment on a lesson |
| `approve_comment` | Approve a pending comment |
| `reject_comment` | Reject a pending comment |
| `delete_comment` | Permanently delete a comment |

### Webhooks

| Tool | Description |
|------|-------------|
| `list_hooks` | List all configured webhooks |
| `create_hook` | Create a new webhook |
| `update_hook` | Update webhook settings |
| `delete_hook` | Permanently delete a webhook |

### Rankings & Scores

| Tool | Description |
|------|-------------|
| `list_rankings` | List member leaderboard |
| `create_score` | Award points to a member |
| `delete_score` | Remove a score entry |

### Quizzes

| Tool | Description |
|------|-------------|
| `list_quiz_attempts` | List all quiz attempts |
| `get_quiz_attempt` | Get quiz attempt details with responses |

## API Limits

- **Rate limit**: 120 requests/minute
- **Pagination**: Max 50 items per page
- **Auth**: API key via query parameter

## License

MIT
