<template>
  <div class="mobile-navigation">
    <div class="nav-group">
      <router-link class="nav-btn selected" to="/">
        <IconHome stroke-width="1" />
        <span> Trang chủ </span>
      </router-link>
      <div class="nav-btn">
        <IconPlaylistAdd stroke-width="1" />
        <span> Kênh đăng ký </span>
      </div>
    </div>
    <el-divider />
    <div class="nav-group">
      <router-link class="nav-btn" to="/studio/dashboard">
        <IconUser stroke-width="1" />
        <span>Kênh của bạn</span>
      </router-link>
      <router-link to="/history">
        <div class="nav-btn">
          <IconHistory stroke-width="1" />
          <span>Video đã xem</span>
        </div>
      </router-link>
    </div>
    <el-divider />
    <div class="nav-group">
      <router-link class="nav-btn" to="/trending">
        <IconFlame stroke-width="1" />
        <span>Thịnh hành</span>
      </router-link>
      <router-link class="nav-btn" to="/music">
        <IconMusic stroke-width="1" />
        <span>Âm nhạc</span>
      </router-link>
      <router-link class="nav-btn" to="/gaming">
        <IconDeviceGamepad2 stroke-width="1" />
        <span>Trò chơi</span>
      </router-link>
    </div>
    <el-divider />
  </div>
</template>

<style lang="scss" src="./Navigation.scss"></style>

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
} from "@tabler/icons-vue";

import { useBreakpoints } from "../../composables/useBreakpoints";
const { width } = useBreakpoints();
</script>
