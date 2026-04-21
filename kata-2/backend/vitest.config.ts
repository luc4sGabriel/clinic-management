import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

function jsExtensionToTsPlugin() {
  const projectRoot = path.dirname(fileURLToPath(import.meta.url));

  return {
    name: 'js-extension-to-ts',
    enforce: 'pre',

    resolveId(source: string, importer?: string) {
      if (!importer) return null;
      if (!source.endsWith('.js')) return null;

      // Only rewrite local/absolute imports (avoid touching node_modules packages)
      if (!(source.startsWith('.') || source.startsWith('/'))) return null;

      // Only rewrite imports coming from our source/tests
      if (!importer.startsWith(projectRoot)) return null;

      const resolvedJsPath = path.resolve(path.dirname(importer), source);
      const candidateTsPath = resolvedJsPath.slice(0, -3) + '.ts';
      if (existsSync(candidateTsPath)) {
        return candidateTsPath;
      }

      // Support `./dir/index.js` style imports where the TS source is `./dir/index.ts`
      const candidateIndexTs = path.join(resolvedJsPath.slice(0, -3), 'index.ts');
      if (existsSync(candidateIndexTs)) {
        return candidateIndexTs;
      }

      return null;
    },
  };
}

export default defineConfig({
  plugins: [jsExtensionToTsPlugin()],
  test: {
    environment: 'node',
    include: ['src/**/*.spec.{js,ts}'],
  },
});
