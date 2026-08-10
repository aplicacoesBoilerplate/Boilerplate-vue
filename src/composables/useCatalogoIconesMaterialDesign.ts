import { computed, shallowRef } from 'vue';

import type { IIconeMaterialDesign } from '@/models/components/IIconeMaterialDesign';
import type { Ref } from 'vue';

import { CIconeMaterialDesignService } from '@/services/CIconeMaterialDesignService';

const icones = shallowRef<IIconeMaterialDesign[]>([]);
const carregando = shallowRef(false);
const erro = shallowRef(false);
let carregamentoCatalogo: Promise<void> | undefined;

/**
 * @description Mantem em memoria o catalogo remoto e disponibiliza sua busca local.
 * @returns Estado compartilhado, carregamento e filtro do catálogo.
 */
export function useCatalogoIconesMaterialDesign() {
  /**
   * @description Carrega uma unica vez o catalogo compartilhado entre instancias do seletor.
   * @returns Promessa resolvida apos concluir o carregamento.
   */
  async function carregarCatalogo(): Promise<void> {
    if (icones.value.length || carregamentoCatalogo) {
      return carregamentoCatalogo;
    }

    carregando.value = true;
    erro.value = false;
    carregamentoCatalogo = CIconeMaterialDesignService.obterCatalogo()
      .then((pIcones) => {
        icones.value = pIcones;
      })
      .catch(() => {
        erro.value = true;
      })
      .finally(() => {
        carregando.value = false;
        carregamentoCatalogo = undefined;
      });

    return carregamentoCatalogo;
  }

  /**
   * @description Filtra nome e aliases sem nova requisicao ao catalogo remoto.
   * @param pTermoBusca - Texto informado pelo usuario.
   * @returns Icones que correspondem ao termo de busca.
   */
  function filtrarIcones(pTermoBusca: Ref<string>) {
    return computed(() => {
      const termoNormalizado = pTermoBusca.value.trim().toLocaleLowerCase();

      if (!termoNormalizado) {
        return icones.value;
      }

      return icones.value.filter(
        (pIcone) =>
          pIcone.nome.includes(termoNormalizado) ||
          pIcone.aliases.some((pAlias) => pAlias.toLocaleLowerCase().includes(termoNormalizado)),
      );
    });
  }

  return {
    icones,
    carregando,
    erro,
    carregarCatalogo,
    filtrarIcones,
  };
}
