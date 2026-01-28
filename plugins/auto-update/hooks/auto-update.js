#!/usr/bin/env node

const { execSync, spawnSync } = require('child_process');
const os = require('os');

const platform = os.platform();

/**
 * Detect the package manager used to install Claude Code
 */
function detectPackageManager() {
  if (platform === 'darwin') {
    // macOS - check for Homebrew
    const brewCheck = spawnSync('brew', ['list', 'claude-code'], { encoding: 'utf8' });
    if (brewCheck.status === 0) return 'brew';
  }

  if (platform === 'win32') {
    // Windows - check for winget
    const wingetCheck = spawnSync('winget', ['list', 'Anthropic.ClaudeCode'], {
      encoding: 'utf8',
      shell: true
    });
    if (wingetCheck.status === 0 && wingetCheck.stdout?.includes('Claude')) return 'winget';
  }

  if (platform === 'linux') {
    // Linux - check for apk (Alpine)
    const apkCheck = spawnSync('apk', ['info', 'claude-code'], { encoding: 'utf8' });
    if (apkCheck.status === 0 && apkCheck.stdout?.includes('claude-code')) return 'apk';
  }

  // Fallback: npm (works on all platforms)
  const npmCheck = spawnSync('npm', ['list', '-g', '@anthropic-ai/claude-code'], {
    encoding: 'utf8',
    shell: platform === 'win32'
  });
  if (npmCheck.status === 0 && npmCheck.stdout?.includes('claude-code')) return 'npm';

  return null;
}

/**
 * Check if an update is available for the given package manager
 */
function checkForUpdate(pm) {
  switch (pm) {
    case 'brew': {
      const result = spawnSync('brew', ['outdated', 'claude-code'], { encoding: 'utf8', timeout: 30000 });
      return (result.stdout || '').includes('claude-code');
    }
    case 'winget': {
      const result = spawnSync('winget', ['upgrade', '--id', 'Anthropic.ClaudeCode'], {
        encoding: 'utf8',
        shell: true,
        timeout: 30000
      });
      // winget shows "No applicable upgrade found" if up to date
      return result.stdout && !result.stdout.includes('No applicable upgrade found');
    }
    case 'apk': {
      const result = spawnSync('apk', ['version', 'claude-code'], { encoding: 'utf8', timeout: 30000 });
      return (result.stdout || '').includes('<');
    }
    case 'npm': {
      const result = spawnSync('npm', ['outdated', '-g', '@anthropic-ai/claude-code'], {
        encoding: 'utf8',
        shell: platform === 'win32',
        timeout: 30000
      });
      return (result.stdout || '').includes('claude-code');
    }
    default:
      return false;
  }
}

/**
 * Run the update command for the given package manager
 */
function runUpdate(pm) {
  const options = {
    stdio: 'inherit',
    timeout: 120000,
    shell: platform === 'win32'
  };

  switch (pm) {
    case 'brew':
      execSync('brew upgrade claude-code', options);
      break;
    case 'winget':
      execSync('winget upgrade --id Anthropic.ClaudeCode --accept-source-agreements --accept-package-agreements', options);
      break;
    case 'apk':
      execSync('apk upgrade claude-code', options);
      break;
    case 'npm':
      execSync('npm update -g @anthropic-ai/claude-code', options);
      break;
  }
}

// Main
const pm = detectPackageManager();

if (!pm) {
  // Unknown installation method, skip
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

try {
  if (checkForUpdate(pm)) {
    runUpdate(pm);
    console.log(JSON.stringify({
      continue: true,
      systemMessage: `[auto-update] Claude Code updated via ${pm}! Restart to use the new version.`
    }));
  } else {
    console.log(JSON.stringify({ continue: true }));
  }
} catch (error) {
  // Update failed, continue anyway
  console.log(JSON.stringify({ continue: true }));
}
