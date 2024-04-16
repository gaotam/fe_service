import { defineStore } from 'pinia'
import api from '../api/axios'
import { router } from '../router'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: {
        email: ""
      }
    }
  },
  actions: {
    async getInfo(){
      const user  = (await api.get("/api/v1/users/me"))
      this.user = user.data;
    },
  }
})
