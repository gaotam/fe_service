<template>
  <div class="navigation">
    <div class="container">
      <div class="nav-group">
        <router-link class="nav-btn selected" to="/">
          <IconHome stroke-width="1" /> Trang chủ
        </router-link>
        <div class="nav-btn">
          <IconPlaylistAdd stroke-width="1" /> Kênh đăng ký
        </div>
      </div>
      <el-divider />
      <div class="nav-group">
        <router-link class="nav-btn" to="/studio/dashboard">
          <IconUser stroke-width="1" /> Kênh của tôi
        </router-link>
        <router-link to="/history">
          <div class="nav-btn">
            <IconHistory stroke-width="1" /> Video đã xem
          </div>
        </router-link>
      </div>
      <el-divider />
      <div class="nav-group">
        <router-link class="nav-btn" to="/trending">
          <IconFlame stroke-width="1" /> Thịnh hành
        </router-link>
        <router-link class="nav-btn" to="/music">
          <IconMusic stroke-width="1" /> Âm nhạc
        </router-link>
        <router-link class="nav-btn" to="/gaming">
          <IconDeviceGamepad2 stroke-width="1" /> Trò chơi
        </router-link>
      </div>
      <el-divider />
      <div v-if="subChannelsShort.length" class="nav-group sub-channel-list">
        <h4 style="margin: 5px 0">Kênh đăng ký</h4>
        <router-link
          class="nav-btn"
          v-for="{ sup_user } in subChannelsShort"
          :key="sup_user.id"
          :to="{ name: 'channel', params: { userId: sup_user.id } }"
        >
          <img
            :src="convertThumbnail(sup_user.avatar) || '/src/assets/user.png'"
            alt=""
          />
          <span>{{ sup_user.fullname }}</span>
        </router-link>

        <div
          class="show-more nav-btn"
          v-if="!isShowMore && subChannels.length > 5"
          @click="isShowMore = true"
        >
          <IconChevronDown />
          <span>Hiện thị thêm thêm 100 mục</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./Navigation.scss"></style>

<script setup>
import {
  IconHome,
  IconPlaylistAdd,
  IconUser,
  IconHistory,
  IconFlame,
  IconMusic,
  IconDeviceGamepad2,
  IconSoccerField,
  IconChevronDown,
} from "@tabler/icons-vue";
import { computed, onBeforeMount, ref } from "vue";

import api from "../../api/axios";
import { useAuthStore } from "../../stores/auth";
import { convertThumbnail } from "../../utils/videoThumbnail";

const authStore = useAuthStore();

const subChannels = ref([]);
const isShowMore = ref(false);
const subChannelsShort = computed(() => {
  if (isShowMore.value) {
    return subChannels.value.slice(0, subChannels.value.length);
  }
  return subChannels.value.slice(0, 5);
});
onBeforeMount(async () => {
  if (authStore.token) {
    try {
      const res = await api.get("api/v1/subscriptions");
      subChannels.value = res.data;
    } catch (error) {
      console.log(error);
    }
  }
});
</script>
