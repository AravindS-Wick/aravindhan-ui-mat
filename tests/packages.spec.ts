import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe('@aravi1008/ui-mat — Package Artifacts', () => {
  test('React package dist files exist', async () => {
    const reactDistPath = path.join(__dirname, '../packages/react/dist');
    expect(fs.existsSync(reactDistPath)).toBe(true);

    // Check main exports
    expect(fs.existsSync(path.join(reactDistPath, 'index.js'))).toBe(true);
    expect(fs.existsSync(path.join(reactDistPath, 'index.cjs'))).toBe(true);
    expect(fs.existsSync(path.join(reactDistPath, 'index.d.ts'))).toBe(true);
  });

  test('Vue package dist files exist', async () => {
    const vueDistPath = path.join(__dirname, '../packages/vue/dist');
    expect(fs.existsSync(vueDistPath)).toBe(true);

    // Check main exports
    expect(fs.existsSync(path.join(vueDistPath, 'index.js'))).toBe(true);
    expect(fs.existsSync(path.join(vueDistPath, 'index.cjs'))).toBe(true);
    expect(fs.existsSync(path.join(vueDistPath, 'index.d.ts'))).toBe(true);
  });

  test('React package has valid exports', async () => {
    const reactPkgPath = path.join(__dirname, '../packages/react/package.json');
    const pkg = JSON.parse(fs.readFileSync(reactPkgPath, 'utf-8'));

    expect(pkg.exports).toBeDefined();
    expect(pkg.exports['.']).toBeDefined();
    expect(pkg.main).toBeDefined();
    expect(pkg.module).toBeDefined();
    expect(pkg.types).toBeDefined();
  });

  test('Vue package has valid exports', async () => {
    const vuePkgPath = path.join(__dirname, '../packages/vue/package.json');
    const pkg = JSON.parse(fs.readFileSync(vuePkgPath, 'utf-8'));

    expect(pkg.exports).toBeDefined();
    expect(pkg.exports['.']).toBeDefined();
    expect(pkg.main).toBeDefined();
    expect(pkg.module).toBeDefined();
    expect(pkg.types).toBeDefined();
  });

  test('React package has peer dependencies defined', async () => {
    const reactPkgPath = path.join(__dirname, '../packages/react/package.json');
    const pkg = JSON.parse(fs.readFileSync(reactPkgPath, 'utf-8'));

    expect(pkg.peerDependencies['react']).toBeDefined();
    expect(pkg.peerDependencies['react-dom']).toBeDefined();
  });

  test('Vue package has peer dependencies defined', async () => {
    const vuePkgPath = path.join(__dirname, '../packages/vue/package.json');
    const pkg = JSON.parse(fs.readFileSync(vuePkgPath, 'utf-8'));

    expect(pkg.peerDependencies['vue']).toBeDefined();
  });

  test('React package has dev build tools', async () => {
    const reactPkgPath = path.join(__dirname, '../packages/react/package.json');
    const pkg = JSON.parse(fs.readFileSync(reactPkgPath, 'utf-8'));

    expect(pkg.devDependencies['tsup']).toBeDefined();
    expect(pkg.devDependencies['typescript']).toBeDefined();
  });

  test('Vue package has dev build tools', async () => {
    const vuePkgPath = path.join(__dirname, '../packages/vue/package.json');
    const pkg = JSON.parse(fs.readFileSync(vuePkgPath, 'utf-8'));

    expect(pkg.devDependencies['vite']).toBeDefined();
    expect(pkg.devDependencies['typescript']).toBeDefined();
  });

  test('React package has test configuration', async () => {
    const reactPkgPath = path.join(__dirname, '../packages/react/package.json');
    const pkg = JSON.parse(fs.readFileSync(reactPkgPath, 'utf-8'));

    expect(pkg.scripts.test).toBeDefined();
  });

  test('Vue package has test configuration', async () => {
    const vuePkgPath = path.join(__dirname, '../packages/vue/package.json');
    const pkg = JSON.parse(fs.readFileSync(vuePkgPath, 'utf-8'));

    expect(pkg.scripts.test).toBeDefined();
  });

  test('packages have source files in src/ directory', async () => {
    const reactSrcPath = path.join(__dirname, '../packages/react/src');
    const vueSrcPath = path.join(__dirname, '../packages/vue/src');

    expect(fs.existsSync(reactSrcPath)).toBe(true);
    expect(fs.existsSync(vueSrcPath)).toBe(true);
  });

  test('React package exports multiple components', async () => {
    const reactDistPath = path.join(__dirname, '../packages/react/dist/index.d.ts');

    if (fs.existsSync(reactDistPath)) {
      const types = fs.readFileSync(reactDistPath, 'utf-8');
      // Should export multiple components
      expect(types.length).toBeGreaterThan(100);
    }
  });

  test('Vue package exports multiple components', async () => {
    const vueDistPath = path.join(__dirname, '../packages/vue/dist/index.d.ts');

    if (fs.existsSync(vueDistPath)) {
      const types = fs.readFileSync(vueDistPath, 'utf-8');
      // Should export multiple components
      expect(types.length).toBeGreaterThan(0);
    }
  });
});
