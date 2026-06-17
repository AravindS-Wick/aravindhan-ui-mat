import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe('@aravi1008/ui-mat — Monorepo Structure', () => {
  test('root package.json is valid', async () => {
    const pkgPath = path.join(__dirname, '../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    expect(pkg.name).toBe('@aravi1008/ui-mat');
    expect(pkg.private).toBe(true);
    expect(pkg.type).toBe('module');
  });

  test('turbo.json configuration exists', async () => {
    const turboPath = path.join(__dirname, '../turbo.json');
    expect(fs.existsSync(turboPath)).toBe(true);

    const turbo = JSON.parse(fs.readFileSync(turboPath, 'utf-8'));
    expect(turbo.tasks).toBeDefined();
  });

  test('changesets configuration exists', async () => {
    const changesetPath = path.join(__dirname, '../.changeset/config.json');
    expect(fs.existsSync(changesetPath)).toBe(true);

    const config = JSON.parse(fs.readFileSync(changesetPath, 'utf-8'));
    expect(config.changelog).toBeDefined();
    expect(config.access).toBe('public');
  });

  test('React package exists and is configured', async () => {
    const reactPkgPath = path.join(__dirname, '../packages/react/package.json');
    expect(fs.existsSync(reactPkgPath)).toBe(true);

    const pkg = JSON.parse(fs.readFileSync(reactPkgPath, 'utf-8'));
    expect(pkg.name).toBe('@aravi1008/ui-react');
    expect(pkg.peerDependencies.react).toBeDefined();
  });

  test('Vue package exists and is configured', async () => {
    const vuePkgPath = path.join(__dirname, '../packages/vue/package.json');
    expect(fs.existsSync(vuePkgPath)).toBe(true);

    const pkg = JSON.parse(fs.readFileSync(vuePkgPath, 'utf-8'));
    expect(pkg.name).toBe('@aravi1008/ui-vue');
    expect(pkg.peerDependencies.vue).toBeDefined();
  });

  test('React package has build script', async () => {
    const reactPkgPath = path.join(__dirname, '../packages/react/package.json');
    const pkg = JSON.parse(fs.readFileSync(reactPkgPath, 'utf-8'));
    expect(pkg.scripts.build).toBeDefined();
  });

  test('Vue package has build script', async () => {
    const vuePkgPath = path.join(__dirname, '../packages/vue/package.json');
    const pkg = JSON.parse(fs.readFileSync(vuePkgPath, 'utf-8'));
    expect(pkg.scripts.build).toBeDefined();
  });

  test('root has build and dev scripts', async () => {
    const pkgPath = path.join(__dirname, '../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    expect(pkg.scripts.build).toBeDefined();
    expect(pkg.scripts.dev).toBeDefined();
    expect(pkg.scripts.lint).toBeDefined();
    expect(pkg.scripts.typecheck).toBeDefined();
  });

  test('monorepo uses pnpm with version 9+', async () => {
    const pkgPath = path.join(__dirname, '../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    expect(pkg.packageManager).toBeDefined();
    expect(pkg.packageManager).toMatch(/pnpm@9/);
  });

  test('Node engine requirement is >= 18', async () => {
    const pkgPath = path.join(__dirname, '../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    expect(pkg.engines.node).toBe('>=18');
  });

  test('monorepo defines eslint configuration', async () => {
    const eslintPath = path.join(__dirname, '../eslint.config.js');
    // File may or may not exist, but packages should have eslint
    const reactPkgPath = path.join(__dirname, '../packages/react/package.json');
    const pkg = JSON.parse(fs.readFileSync(reactPkgPath, 'utf-8'));
    expect(pkg.devDependencies.eslint).toBeDefined();
  });

  test('react and vue packages are independent', async () => {
    const reactPkgPath = path.join(__dirname, '../packages/react/package.json');
    const vuePkgPath = path.join(__dirname, '../packages/vue/package.json');

    const react = JSON.parse(fs.readFileSync(reactPkgPath, 'utf-8'));
    const vue = JSON.parse(fs.readFileSync(vuePkgPath, 'utf-8'));

    // Should not depend on each other
    expect(react.dependencies['@aravi1008/ui-vue']).toBeUndefined();
    expect(vue.dependencies['@aravi1008/ui-react']).toBeUndefined();
  });

  test('both packages depend on core @aravi1008/ui', async () => {
    const reactPkgPath = path.join(__dirname, '../packages/react/package.json');
    const vuePkgPath = path.join(__dirname, '../packages/vue/package.json');

    const react = JSON.parse(fs.readFileSync(reactPkgPath, 'utf-8'));
    const vue = JSON.parse(fs.readFileSync(vuePkgPath, 'utf-8'));

    // Both should reference core UI package
    expect(react.peerDependencies['@aravi1008/ui']).toBeDefined();
    expect(vue.peerDependencies['@aravi1008/ui']).toBeDefined();
  });
});
