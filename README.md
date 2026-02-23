<p align="center">
  <img src="assets/logo.png" alt="Memberkit MCP Server" width="200" />
</p>

# Memberkit MCP Server

MCP server that wraps the [Memberkit API](https://ajuda.memberkit.com.br/referencia-api/introducao) as semantic tools for LLM agents.

## Prerequisites

- Node.js 18+
- Memberkit API key (found at `/academy/edit` in your Memberkit admin panel)

## Installation

### Claude Code

```bash
git clone https://github.com/paulofroes/mcp-memberkit.git ~/Desktop/mcp-memberkit
cd ~/Desktop/mcp-memberkit && npm install
claude mcp add mcp-memberkit -e MEMBERKIT_API_KEY=your_key -- node ~/Desktop/mcp-memberkit/build/index.js
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "memberkit": {
      "command": "node",
      "args": ["<path-to>/mcp-memberkit/build/index.js"],
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
