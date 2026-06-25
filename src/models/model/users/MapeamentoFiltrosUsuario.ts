// Types e Interfaces
import { EFilterType } from '@/models/filters/enums/EnumFilterType';
import type { IUser } from './lUser';
import type { ICampoFiltroOption } from '@/models/filters/ICampoFiltroOption';

// Define com base na interface do Model, quais são os campos os quais os filtros não são aplicaveis.
export type TCamposFiltroUsuario = Omit<IUser, 'avatar' | 'receiveNotifications'>;

const DESCRICAO_CAMPOS_FILTRO_USERS: Record<keyof TCamposFiltroUsuario, string> = {
  idUser: 'Código',
  username: 'Nome',
  email: 'Email',
  role: 'Cargo',
  phoneNumber: 'Telefone',
  active: 'Ativo',
};

const ICONE_CAMPOS_FILTRO_USERS: Record<keyof TCamposFiltroUsuario, string> = {
  idUser: 'mdi-account',
  username: 'mdi-account',
  email: 'mdi-email',
  role: 'mdi-account-tie',
  phoneNumber: 'mdi-phone',
  active: 'mdi-check-circle',
};

const TIPOS_CAMPOS_FILTRO_USERS: Record<keyof TCamposFiltroUsuario, EFilterType[]> = {
  idUser: [EFilterType.NUMBER],
  username: [EFilterType.STRING],
  email: [EFilterType.STRING],
  role: [EFilterType.SELECT],
  phoneNumber: [EFilterType.STRING],
  active: [EFilterType.BOOLEAN],
};

export const MAPEAMENTO_CAMPOS_FILTRO_USERS: ICampoFiltroOption<keyof TCamposFiltroUsuario>[] = (
  Object.keys(DESCRICAO_CAMPOS_FILTRO_USERS) as Array<keyof TCamposFiltroUsuario>
).map((key) => ({
  valor: key,
  descricao: DESCRICAO_CAMPOS_FILTRO_USERS[key],
  icone: ICONE_CAMPOS_FILTRO_USERS[key],
  tipos: TIPOS_CAMPOS_FILTRO_USERS[key],
}));
