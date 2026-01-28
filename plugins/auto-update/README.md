# Auto-Update Plugin for Claude Code

Automatically updates Claude Code when a new version is available via your package manager.

## Installation

1. Open the plugins UI:
   ```
   /plugin
   ```

2. Go to **Marketplaces** tab → Add `ysaber/ysaber-claude-plugins`

3. Go to **Discover** tab → Search for `auto-update` → Install it

4. **Restart your terminal** (not just Claude - close and reopen your terminal app)

That's it! The plugin automatically:
- Checks for updates on every session start
- Hides the built-in "Update available!" notification

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

**Why do I need to restart my terminal?**
The plugin adds an environment variable to your shell profile. This only takes effect when you open a new terminal.

## License

MIT
