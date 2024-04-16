import { defineStore } from 'pinia'
import api from '../api/axios'

const typeCategory = ["", "game", "live", "music", "film"]

export const useCategoryStore = defineStore('category', {
  state: () => {
    return {
      categories: [],
      idx: 0,
      type: typeCategory[0]
    }
  },
  getters: {
    getCategories: (state) => state.categories
  },
  actions: {
    async callAPICategories(){
      let data = await api.get("/api/v1/categories")
      this.categories = data.data.categories;
    },
    changeType(idx) {
      this.idx = idx;
      this.type = typeCategory[idx]
    }
  }
})
