<script setup>
import {
  IconCategory,
  IconMessage,
  IconPhotoVideo,
  IconUser,
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
  <div class="mobile-studio-navigation">
    <div class="nav-channel">
      <img
        :src="convertThumbnail(user.avatar) || '/src/assets/user.png'"
        alt=""
      />
    </div>
    <div class="nav-group">
      <router-link
        class="nav-btn"
        :class="{ selected: route.name == 'studio-dashboard' }"
        to="/studio/dashboard"
      >
        <IconCategory stroke-width="1" />
      </router-link>
      <router-link
        class="nav-btn"
        :class="{ selected: route.name == 'studio-content' }"
        to="/studio/content"
      >
        <IconPhotoVideo stroke-width="1" />
      </router-link>
      <router-link
        class="nav-btn"
        :class="{ selected: route.name == 'studio-comments' }"
        to="/studio/comments"
      >
        <IconMessage stroke-width="1" />
      </router-link>
      <router-link
        class="nav-btn"
        :class="{ selected: route.name == 'studio-profile' }"
        to="/studio/profile"
      >
        <IconUser stroke-width="1" />
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Navigation.scss"></style>
