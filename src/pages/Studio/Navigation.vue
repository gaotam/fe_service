<script setup>
import {
  IconCategory,
  IconMessage,
  IconPhotoVideo,
  IconWand,
} from "@tabler/icons-vue";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

import api from "@/api/axios";
import { convertThumbnail } from "../../utils/videoThumbnail";

const route = useRoute();

const user = ref({});
onBeforeMount(async () => {
  try {
    const res = await api.get("api/v1/users/profile");
    user.value = res.data;
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="studio-navigation">
    <div class="nav-channel">
      <img
        :src="convertThumbnail(user.avatar) || '/src/assets/user.png'"
        alt=""
      />
      <p>{{ user.fullname }}</p>
    </div>
    <div class="nav-group">
      <router-link
        class="nav-btn"
        :class="{ selected: route.name == 'studio-dashboard' }"
        to="/studio/dashboard"
      >
        <IconCategory stroke-width="1" /> Tổng quan
      </router-link>
      <router-link
        class="nav-btn"
        :class="{ selected: route.name == 'studio-content' }"
        to="/studio/content"
      >
        <IconPhotoVideo stroke-width="1" /> Nội dung
      </router-link>
      <router-link
        class="nav-btn"
        :class="{ selected: route.name == 'studio-comments' }"
        to="/studio/comments"
      >
        <IconMessage stroke-width="1" /> Bình luận
      </router-link>
      <router-link
        class="nav-btn"
        :class="{ selected: route.name == 'studio-customization' }"
        to="/studio/customization"
      >
        <IconWand stroke-width="1" /> Tùy chỉnh
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Navigation.scss"></style>
