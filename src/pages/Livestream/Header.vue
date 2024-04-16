<template>
  <div class="header-studio">
    <router-link to="/" class="studio-logo">
      <img src="https://www.gstatic.com/youtube/img/creator/yt_studio_logo_white.svg" alt="">
    </router-link>
    <div class="avatar">
      <img :src="convertThumbnail(user.avatar) || '/src/assets/user.png'" alt="">
    </div>
  </div>
</template>

<style lang="scss" src="./Header.scss" scoped>
</style>

<script setup>
import { ref, watch, watchEffect } from "vue";
import api from "../../api/axios";
const user = ref({});
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
import { convertThumbnail } from "../../utils/videoThumbnail";


const loadUser = async () => {
  try {
    const userRes = await api.get("api/v1/users/profile");
    user.value = userRes.data;
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => [authStore.token],
  async () => {
    if (authStore.token) {
      await loadUser();
      await loadNotifications();
      socket.on(`notification-${authStore.user}`, async () => {
        await loadNotifications();
      });
    }
  },
  { immediate: true }
);

</script>