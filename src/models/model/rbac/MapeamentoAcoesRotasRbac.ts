// Types e Interfaces
import type { IMapeamentoRotaApiRbac } from './ICargoRbac';

/**
 * @description Constante que alimenta o formulário do ControlePermissoesCargo.
 * A chave do objeto é o recurso e o valor é um objeto com as ações e os endpoints da API associados a cada rota.
 * Ações não determindas ficam bloqueadas por padrão. Manter um padrão alinhado com o backend.
 */
export const MAPEAMENTO_ROTAS_API_RBAC: Partial<Record<string, IMapeamentoRotaApiRbac>> = {
  Usuarios: {
    acoes: {
      consultar: [
        { metodo: 'GET', path: '/usuarios/**' },
        { metodo: 'POST', path: '/usuarios/consulta' },
        { metodo: 'POST', path: '/usuarios/search' },
      ],
      gravar: [
        { metodo: 'POST', path: '/usuarios' },
      ],
      editar: [
        { metodo: 'PUT', path: '/usuarios/**' },
      ],
      remover: [
        { metodo: 'DELETE', path: '/usuarios/**' },
      ],
    },
  },
  Rbac: {
    acoes: {
      consultar: [
        { metodo: 'GET', path: '/rbac/cargos/**' },
        { metodo: 'POST', path: '/rbac/cargos/consulta' },
      ],
      gravar: [
        { metodo: 'POST', path: '/rbac/cargos' },
      ],
      editar: [
        { metodo: 'PUT', path: '/rbac/cargos/**' },
      ],
      remover: [
        { metodo: 'DELETE', path: '/rbac/cargos/**' },
      ],
    },
  },
  Erros: {
    acoes: {
      consultar: [
        { metodo: 'GET', path: '/erros/**' },
        { metodo: 'POST', path: '/erros/consulta' },
      ],
    },
  },
};
