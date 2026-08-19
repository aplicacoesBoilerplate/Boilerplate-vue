import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('password recovery secret storage', () => {
  it('never serializes or restores the OTP and clears it on unmount', async () => {
    const source = await readFile(resolve(process.cwd(), 'src/views/RecuperacaoSenhaView.vue'), 'utf8');
    const persistedType = source.match(/type TEstadoRecuperacaoSenhaPersistido = \{([\s\S]*?)\};/)?.[1] ?? '';
    const unmountHook = source.match(/onUnmounted\(\(\) => \{([\s\S]*?)\}\);/)?.[1] ?? '';

    expect(persistedType).not.toContain('codigoOtp');
    expect(source).not.toContain('codigoOtp: codigoOtp.value');
    expect(source).not.toContain('estado.codigoOtp');
    expect(unmountHook).toContain("codigoOtp.value = ''");
  });
});
