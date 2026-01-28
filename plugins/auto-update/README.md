# Auto-Update Plugin for Claude Code

Automatically updates Claude Code when a new version is available via your package manager.

## Installation

### 1. Clone this repo

```bash
git clone https://github.com/ysaber/ysaber-claude-plugins.git ~/.claude-plugins
```

### 2. Add the hook to your Claude Code settings

Edit your settings file:
- **macOS/Linux:** `~/.claude/settings.json`
- **Windows:** `%USERPROFILE%\.claude\settings.json`

Add this to your `hooks.SessionStart` array:

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

### 3. Restart your terminal

On first run, the plugin will configure your shell to hide the built-in "Update available!" message. Restart your terminal again to apply that change.

## Supported Package Managers

| Platform | Package Manager |
|----------|-----------------|
| macOS    | Homebrew        |
| Windows  | winget          |
| Linux    | apk (Alpine)    |
| All      | npm (fallback)  |

## How It Works

1. On session start, checks if your package manager has a newer version
2. If available, automatically runs the upgrade
3. Restart Claude Code to use the new version

## FAQ

**Will this slow down startup?**
No, the check is fast (< 1 second).

**Why am I one version behind?**
Package managers may take up to 24 hours to publish new releases. This is normal.

## License

MIT
