<script setup>
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
</script>

<template>
  <Header />
  <main>
    <router-view></router-view>
  </main>
  <Footer />
</template>

<style lang="scss" scoped>
main {
  padding: 70px 4% 0 4%;
}
</style>
