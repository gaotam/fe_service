<template>
    <div class="chip-bar">
        <ul class="flex">
            <li v-for="(category, idx) in categories" :class="{ 'selected': idx === selectIdx }" @click="() => categoryStore.changeType(idx)">
                {{ category.name }}
            </li>
        </ul>
    </div>
</template>

<style lang="scss" src="./ChipBar.scss"></style>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useCategoryStore } from '@/stores/category'
const categoryStore = useCategoryStore()
let categories = ref()
const selectIdx = computed(() => categoryStore.idx);

watchEffect(async() => {
    try {
        await categoryStore.callAPICategories()
        categories.value = categoryStore.getCategories
    } catch (error) {
        console.log(error);
    }
})
</script>