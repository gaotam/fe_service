import { defineStore } from 'pinia'
import api from '../api/axios'
import { router } from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      token: JSON.parse(localStorage.getItem('hoangyt:auth')) || null,
      user: (localStorage.getItem('hoangyt:user')) || null,
      returnUrl: null
    }
  },
  actions: {
    async login(account, password){
      const { access_token, user } = (await api.post("/api/v1/auth/login", { account, password })).data.data
      this.token = access_token;
      this.user = user.id
      localStorage.setItem('hoangyt:auth', JSON.stringify(access_token));
      localStorage.setItem('hoangyt:user', user.id);

      setTimeout(() => {
        router.push(this.returnUrl || '/');
      },300)
    },
    isAuth(){
      return !!this.token
    },
    getUserId(){
      return this.user
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('hoangyt:auth');
      localStorage.removeItem('hoangyt:user');
      router.push('/');
    }
  }
})