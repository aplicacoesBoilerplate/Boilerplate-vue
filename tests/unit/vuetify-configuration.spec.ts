import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Vuetify build configuration', () => {
  it('does not register the complete component catalogue while auto-import is enabled', async () => {
    const source = await readFile(
      resolve(process.cwd(), 'src/plugins/vuetify.ts'),
      'utf8',
    );

    expect(source).not.toContain("import * as components from 'vuetify/components'");
    expect(source).not.toContain('...components');
    expect(source).toContain('VMaskInput');
  });
});
