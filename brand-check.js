// brand-check.js
const { execSync } = require('child_process');

try {
  // Match "silent disco" with any whitespace between words, case-insensitive
  const cmd = `grep -Rni -E "silent[[:space:]]*disco" --exclude-dir=node_modules --exclude=brand-check.js .`;
  const res = execSync(cmd, { encoding: 'utf8' });
  if (res && res.trim()) {
    console.error("❌ Forbidden term found:\n" + res);
    process.exit(1);
  }
  console.log("✅ Brand check passed: forbidden term not found.");
} catch (e) {
  // grep exits 1 when no matches — that's success for us
  if (e.status === 1) {
    console.log("✅ Brand check passed: forbidden term not found.");
    process.exit(0);
  }
  console.error("❌ Brand check error:\n" + e.message);
  process.exit(2);
}