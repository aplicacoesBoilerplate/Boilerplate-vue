// Ecossistema Vue
import { reactive } from 'vue';

// Types e Interfaces
import type { ILogin } from '@/models/model/autenticacao/autenticacao.models';

// Utils
import { ClassManagerStorage } from '@/utils/ManagerStorage';

const EMAIL_ACESSO_STORAGE_KEY = 'access_email';
const EMAIL_ACESSO_PADRAO = '@gmail.com';

export function useFormularioLogin(): {
  login: ILogin;
  resetarLogin: () => void;
  salvarPreferenciaEmail: () => void;
} {
  const login = reactive<ILogin>(criarLoginPadrao());

  function criarLoginPadrao(): ILogin {
    return {
      email: ClassManagerStorage.get<string>(EMAIL_ACESSO_STORAGE_KEY, EMAIL_ACESSO_PADRAO, 'local') ?? '',
      password: '',
    };
  }

  function resetarLogin(): void {
    Object.assign(login, {
      email: EMAIL_ACESSO_PADRAO,
      password: '',
    });

    ClassManagerStorage.set(EMAIL_ACESSO_STORAGE_KEY, EMAIL_ACESSO_PADRAO, 'local');
  }

  function salvarPreferenciaEmail(): void {
    ClassManagerStorage.set(EMAIL_ACESSO_STORAGE_KEY, login.email, 'local');
  }

  return {
    login,
    resetarLogin,
    salvarPreferenciaEmail,
  };
}
