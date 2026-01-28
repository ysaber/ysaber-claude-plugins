#!/usr/bin/env node

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const platform = os.platform();
const HOME = os.homedir();

/**
 * Ensure DISABLE_AUTOUPDATER is set in user's shell profile
 * This hides the built-in "Update available!" message since this plugin handles updates
 */
function ensureAutoupdaterDisabled() {
  // Already set in current session
  if (process.env.DISABLE_AUTOUPDATER) return null;

  const exportLine = 'export DISABLE_AUTOUPDATER=1';
  const comment = '# Added by auto-update plugin for Claude Code';
  const addition = `\n${comment}\n${exportLine}\n`;

  let profilePath;
  let profileName;

  if (platform === 'win32') {
    // Windows - PowerShell profile
    const psProfile = path.join(HOME, 'Documents', 'WindowsPowerShell', 'Microsoft.PowerShell_profile.ps1');
    const psProfileDir = path.dirname(psProfile);

    if (!fs.existsSync(psProfileDir)) {
      fs.mkdirSync(psProfileDir, { recursive: true });
    }

    const psContent = fs.existsSync(psProfile) ? fs.readFileSync(psProfile, 'utf8') : '';
    if (psContent.includes('DISABLE_AUTOUPDATER')) return null;

    fs.appendFileSync(psProfile, `\n# Added by auto-update plugin for Claude Code\n$env:DISABLE_AUTOUPDATER = "1"\n`);
    return 'PowerShell profile';
  }

  // macOS / Linux - detect shell
  const shell = process.env.SHELL || '/bin/bash';

  if (shell.includes('zsh')) {
    profilePath = path.join(HOME, '.zshrc');
    profileName = '.zshrc';
  } else if (shell.includes('bash')) {
    // Check for .bash_profile first (macOS preference), then .bashrc
    const bashProfile = path.join(HOME, '.bash_profile');
    const bashrc = path.join(HOME, '.bashrc');
    if (fs.existsSync(bashProfile)) {
      profilePath = bashProfile;
      profileName = '.bash_profile';
    } else {
      profilePath = bashrc;
      profileName = '.bashrc';
    }
  } else if (shell.includes('fish')) {
    const fishConfig = path.join(HOME, '.config', 'fish', 'config.fish');
    const fishDir = path.dirname(fishConfig);
    if (!fs.existsSync(fishDir)) {
      fs.mkdirSync(fishDir, { recursive: true });
    }
    const fishContent = fs.existsSync(fishConfig) ? fs.readFileSync(fishConfig, 'utf8') : '';
    if (fishContent.includes('DISABLE_AUTOUPDATER')) return null;
    fs.appendFileSync(fishConfig, `\n# Added by auto-update plugin for Claude Code\nset -x DISABLE_AUTOUPDATER 1\n`);
    return 'config.fish';
  } else {
    // Fallback to .profile
    profilePath = path.join(HOME, '.profile');
    profileName = '.profile';
  }

  // Read existing content
  const content = fs.existsSync(profilePath) ? fs.readFileSync(profilePath, 'utf8') : '';

  // Already configured
  if (content.includes('DISABLE_AUTOUPDATER')) return null;

  // Append the export
  fs.appendFileSync(profilePath, addition);
  return profileName;
}

/**
 * Detect the package manager used to install Claude Code
 */
function detectPackageManager() {
  if (platform === 'darwin') {
    const brewCheck = spawnSync('brew', ['list', 'claude-code'], { encoding: 'utf8' });
    if (brewCheck.status === 0) return 'brew';
  }

  if (platform === 'win32') {
    const wingetCheck = spawnSync('winget', ['list', 'Anthropic.ClaudeCode'], {
      encoding: 'utf8',
      shell: true
    });
    if (wingetCheck.status === 0 && wingetCheck.stdout?.includes('Claude')) return 'winget';
  }

  if (platform === 'linux') {
    const apkCheck = spawnSync('apk', ['info', 'claude-code'], { encoding: 'utf8' });
    if (apkCheck.status === 0 && apkCheck.stdout?.includes('claude-code')) return 'apk';
  }

  const npmCheck = spawnSync('npm', ['list', '-g', '@anthropic-ai/claude-code'], {
    encoding: 'utf8',
    shell: platform === 'win32'
  });
  if (npmCheck.status === 0 && npmCheck.stdout?.includes('claude-code')) return 'npm';

  return null;
}

/**
 * Check if an update is available
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
 * Run the update command
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
const messages = [];

// Setup: disable built-in update notification
try {
  const modifiedProfile = ensureAutoupdaterDisabled();
  if (modifiedProfile) {
    messages.push(`[auto-update] Added DISABLE_AUTOUPDATER to ${modifiedProfile}. Restart your terminal to hide the update notification.`);
  }
} catch (e) {
  // Ignore errors - not critical
}

// Check and run updates
const pm = detectPackageManager();

if (!pm) {
  console.log(JSON.stringify({
    continue: true,
    systemMessage: messages.length ? messages.join(' ') : undefined
  }));
  process.exit(0);
}

try {
  if (checkForUpdate(pm)) {
    runUpdate(pm);
    messages.push(`[auto-update] Claude Code updated via ${pm}! Restart to use the new version.`);
  }
} catch (error) {
  // Update failed, continue anyway
}

console.log(JSON.stringify({
  continue: true,
  systemMessage: messages.length ? messages.join(' ') : undefined
}));
