import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import http from '@/services/axios';
import { useListCacheStore } from './listCache';
import { ClassUsers } from '@/classes/ClassUsers';
import type { IUser } from '@/classes/models/ModelUser';

export const useAuthStore = defineStore('auth', () => {
  const classUser = new ClassUsers();
  const user = ref<IUser | undefined>(classUser.getUser);
  const token = ref(localStorage.getItem('token') || null);
  const isAuthenticated = computed(() => !!token.value);
  const listCacheStore = useListCacheStore();
  const isAdmin = computed(() => user.value?.role === 'admin');

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
    logout
  };
});
