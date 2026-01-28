# ysaber-claude-plugins

A collection of useful Claude Code plugins.

## Available Plugins

| Plugin | Description |
|--------|-------------|
| [auto-update](./plugins/auto-update) | Automatically updates Claude Code on session start |
| [desktop-notifications](./plugins/desktop-notifications) | Desktop notifications when Claude completes tasks |
| [islamic-reminders](./plugins/islamic-reminders) | Islamic reminders and dhikr during sessions |

## Installation

### 1. Clone this repo

```bash
git clone https://github.com/ysaber/ysaber-claude-plugins.git ~/.claude-plugins
```

### 2. Add hooks to your settings

Edit `~/.claude/settings.json` (macOS/Linux) or `%USERPROFILE%\.claude\settings.json` (Windows).

Add the plugins you want to the `hooks` section. See each plugin's README for the specific hook configuration.

**Example - Adding auto-update:**

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude-plugins/plugins/auto-update/hooks/auto-update.js"
          }
        ]
      }
    ]
  }
}
```

### 3. Restart Claude Code

## License

MIT
