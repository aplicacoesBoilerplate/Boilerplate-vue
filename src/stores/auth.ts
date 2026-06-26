import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import http from '@/services/axios';
import { useListCacheStore } from './listCache';
import { ClassUsuarios } from '@/classes/ClassUsers';
import type { IUsuario } from '@/models/model/usuario/lUsuario';

export const useAuthStore = defineStore('auth', () => {
  const classUser = new ClassUsuarios();
  const user = ref<IUsuario | undefined>(classUser.model);
  const token = ref(localStorage.getItem('token') || null);
  const isAuthenticated = computed(() => !!token.value);
  const listCacheStore = useListCacheStore();
  const isAdmin = computed(() => user.value?.papel === 'ADMIN');

  async function fetchUser() {
    if (!token.value) return;
    try {
      const res = await http.get('/api/me');
      user.value = res.data;
    } catch (error) {
      logout();
    }
  }

  function logout() {
    token.value = null;
    user.value = undefined;
    localStorage.removeItem('token');
    listCacheStore.clearAll();
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    fetchUser,
    logout,
  };
});
