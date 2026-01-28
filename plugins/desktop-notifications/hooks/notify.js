#!/usr/bin/env node

const { exec } = require('child_process');
const os = require('os');

const title = 'Claude Code';
const message = 'Task complete!';

const platform = os.platform();

let command;

if (platform === 'darwin') {
  // macOS - use terminal-notifier for better control
  const iconPath = __dirname.replace('/hooks', '') + '/claude-icon.png';
  command = `terminal-notifier -title "${title}" -message "${message}" -sound default -appIcon "${iconPath}"`;
} else if (platform === 'win32') {
  // Windows - using PowerShell toast notification
  command = `powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('${message}', '${title}')"`;
} else {
  // Linux
  command = `notify-send "${title}" "${message}"`;
}

exec(command, (error) => {
  // Silent fail - don't break Claude if notification fails
});

// Output valid hook response
console.log(JSON.stringify({
  continue: true
}));
