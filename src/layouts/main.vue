<script setup>
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
import Navigation from "@/components/Navigation/Navigation.vue";
import MobileNavigation from "@/components/Navigation/MobileNavigation.vue";

import { useBreakpoints } from "../composables/useBreakpoints";
const { width } = useBreakpoints();
</script>

<template>
  <Header />
  <div class="wrapper">
    <Navigation v-if="width > 992" />
    <MobileNavigation v-else-if="width > 576" />
    <div class="content">
      <main>
        <router-view></router-view>
      </main>
    </div>
  </div>
  <Footer />
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  $navigation-width: 200px;
  padding-top: 70px;
  padding-left: 200px;
  @media screen and (max-width: 992px) and (min-width: 576px) {
    padding-left: 80px;
  }
  @media screen and (max-width: 576px) {
    padding-left: 0;
  }
  .content {
    flex: 1;
    width: calc(100% - $navigation-width);
    main {
      padding: 0 7%;
    }
  }
}
</style>
