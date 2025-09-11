#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const rootDir = path.join(__dirname, '..');

try {
  const files = fs.readdirSync(distDir);
  files.forEach(file => {
    const srcPath = path.join(distDir, file);
    const destPath = path.join(rootDir, file);
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`📄 Copied ${file}`);
    }
  });
  console.log('Copied all files to root');
} catch (error) {
  console.error('Copy failed!:', error.message);
  process.exit(1);
}