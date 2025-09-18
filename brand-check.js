#!/usr/bin/env node
// Brand compliance check - prevents forbidden terms from being committed
// Run with: node brand-check.js

const { execSync } = require('child_process');
const FORBIDDEN_TERM = 'silent disco'; // Replace locally during checks

try {
  const result = execSync(`grep -Rni --exclude-dir=node_modules --exclude=brand-check.js "${FORBIDDEN_TERM}" .`, { encoding: 'utf8' });
  if (result.trim()) {
    console.error(`❌ BRAND VIOLATION: Found forbidden term "${FORBIDDEN_TERM}" in:`);
    console.error(result);
    process.exit(1);
  }
} catch (error) {
  // grep returns non-zero when no matches found, which is what we want
  if (error.status === 1) {
    console.log('✅ Brand compliance check passed - no forbidden terms found');
    process.exit(0);
  } else {
    console.error('❌ Brand check failed with error:', error.message);
    process.exit(1);
  }
}