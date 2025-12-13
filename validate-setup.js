#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const checks = [];

// Check if required files exist
const requiredFiles = [
  'backend/package.json',
  'frontend/package.json',
  'backend/prisma/schema.prisma',
  'backend/src/app.js',
  'backend/server.js',
  'frontend/src/main.jsx',
  'frontend/index.html',
  '.github/workflows/deploy.yml',
  'render.yaml',
  'vercel.json',
  'Dockerfile'
];

console.log('🔍 Validating FocusFlow Setup...\n');

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
    checks.push(true);
  } else {
    console.log(`❌ ${file} - MISSING`);
    checks.push(false);
  }
});

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...');

try {
  const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  const frontendPkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
  
  const requiredBackendScripts = ['start', 'build', 'test', 'lint'];
  const requiredFrontendScripts = ['build', 'test', 'lint'];
  
  requiredBackendScripts.forEach(script => {
    if (backendPkg.scripts[script]) {
      console.log(`✅ Backend: ${script}`);
      checks.push(true);
    } else {
      console.log(`❌ Backend: ${script} - MISSING`);
      checks.push(false);
    }
  });
  
  requiredFrontendScripts.forEach(script => {
    if (frontendPkg.scripts[script]) {
      console.log(`✅ Frontend: ${script}`);
      checks.push(true);
    } else {
      console.log(`❌ Frontend: ${script} - MISSING`);
      checks.push(false);
    }
  });
} catch (error) {
  console.log(`❌ Error reading package.json files: ${error.message}`);
  checks.push(false);
}

// Check environment files
console.log('\n🔧 Checking environment configuration...');

const envFiles = [
  'backend/.env.example',
  'backend/.env.production',
  'frontend/.env.production'
];

envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
    checks.push(true);
  } else {
    console.log(`❌ ${file} - MISSING`);
    checks.push(false);
  }
});

// Summary
const passed = checks.filter(Boolean).length;
const total = checks.length;

console.log('\n' + '='.repeat(50));
console.log(`📊 Validation Summary: ${passed}/${total} checks passed`);

if (passed === total) {
  console.log('🎉 All checks passed! FocusFlow is ready for deployment.');
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above.');
  process.exit(1);
}