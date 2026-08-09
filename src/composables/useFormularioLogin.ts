// Ecossistema Vue
import { reactive } from 'vue';

// Types e Interfaces
import type { TLogin } from '@/models/model/core/autenticacao.model';

// Utils
import { ClassManagerStorage } from '@/utils/ManagerStorage';

const EMAIL_ACESSO_STORAGE_KEY = 'access_email';
const EMAIL_ACESSO_PADRAO = '@gmail.com';

export function useFormularioLogin(): {
  login: TLogin;
  resetarLogin: () => void;
  salvarPreferenciaEmail: () => void;
} {
  const login = reactive<TLogin>(criarLoginPadrao());

  function criarLoginPadrao(): TLogin {
    return {
      identificacaoAcesso: ClassManagerStorage.get<string>(EMAIL_ACESSO_STORAGE_KEY, EMAIL_ACESSO_PADRAO, 'local') ?? '',
      senha: '',
    };
  }

  function resetarLogin(): void {
    Object.assign(login, {
      identificacaoAcesso: EMAIL_ACESSO_PADRAO,
      senha: '',
    });

    ClassManagerStorage.set(EMAIL_ACESSO_STORAGE_KEY, EMAIL_ACESSO_PADRAO, 'local');
  }

  function salvarPreferenciaEmail(): void {
    ClassManagerStorage.set(EMAIL_ACESSO_STORAGE_KEY, login.identificacaoAcesso, 'local');
  }

  return {
    login,
    resetarLogin,
    salvarPreferenciaEmail,
  };
}
