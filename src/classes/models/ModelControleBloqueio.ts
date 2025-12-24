// Utilizado por um adm ao liberar acesso de um usuário
export interface IControleBloqueio {
  emailUsuario: string
  operacaoBloqueio: string
  ativo: boolean
}
// Criar o controle de rota
