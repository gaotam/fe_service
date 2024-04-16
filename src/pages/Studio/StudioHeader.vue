<template>
  <div class="studio-header">
    <div class="container flex">
      <div class="header-home flex">
        <span>
          <IconBaselineDensityMedium
            @click.stop="openMobileNav"
            stroke-width="1"
          />
        </span>
        <router-link to="/studio/dashboard" class="home-link">
          HoangStudio
        </router-link>
      </div>
      <div class="header-btn flex">
        <router-link
          class="btn-login flex"
          to="/login"
          v-if="!authStore.isAuth()"
        >
          <IconUserCircle stroke-width="1" /> Đăng nhập
        </router-link>
        <div class="user" v-else>
          <div class="btn-setting">
            <el-popover
              :width="200"
              trigger="click"
              popper-class="popper"
              placement="bottom-end"
              :hide-after="0"
            >
              <div>
                <router-link
                  class="popper-link"
                  :to="{ name: route.name, query: { upload: true } }"
                >
                  <IconArrowBarUp stroke-width="1" />
                  <span>Tải video lên</span>
                </router-link>
                <router-link to="/livestream" class="popper-link">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      enable-background="new 0 0 24 24"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      focusable="false"
                      style="
                        pointer-events: none;
                        display: block;
                        width: 100%;
                        height: 100%;
                      "
                    >
                      <g>
                        <path
                          d="M14 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM8.48 8.45l-.71-.7C6.68 8.83 6 10.34 6 12s.68 3.17 1.77 4.25l.71-.71C7.57 14.64 7 13.39 7 12s.57-2.64 1.48-3.55zm7.75-.7-.71.71c.91.9 1.48 2.15 1.48 3.54s-.57 2.64-1.48 3.55l.71.71C17.32 15.17 18 13.66 18 12s-.68-3.17-1.77-4.25zM5.65 5.63l-.7-.71C3.13 6.73 2 9.24 2 12s1.13 5.27 2.95 7.08l.71-.71C4.02 16.74 3 14.49 3 12s1.02-4.74 2.65-6.37zm13.4-.71-.71.71C19.98 7.26 21 9.51 21 12s-1.02 4.74-2.65 6.37l.71.71C20.87 17.27 22 14.76 22 12s-1.13-5.27-2.95-7.08z"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <span>Phát trực tiếp</span>
                </router-link>
              </div>
              <template #reference>
                <button class="create-btn">
                  <IconVideoPlus color="red" stroke-width="1" />
                  <span>TẠO</span>
                </button>
              </template>
            </el-popover>
          </div>
          <el-popover
            :width="250"
            popper-class="popper"
            trigger="click"
            placement="bottom-end"
            :hide-after="0"
          >
            <div class="user-info">
              <div class="user-avt">
                <img
                  :src="convertThumbnail(user.avatar) || '/src/assets/user.png'"
                  alt=""
                />
              </div>
              <p>{{ user.fullname }}</p>
            </div>
            <div class="user-nav">
              <router-link to="/" class="popper-link">
                <IconBrandYoutube stroke-width="1" />
                <span>HoangTube</span>
              </router-link>
              <router-link to="/logout" class="popper-link">
                <IconLogout stroke-width="1" />
                <span>Đăng xuất</span>
              </router-link>
            </div>
            <template #reference>
              <div class="user-avt">
                <img
                  :src="convertThumbnail(user.avatar) || '/src/assets/user.png'"
                  alt=""
                />
              </div>
            </template>
          </el-popover>
        </div>
      </div>
    </div>
  </div>

  <el-drawer
    v-model="isOpenMobileNav"
    direction="ltr"
    size="200px"
    :withHeader="false"
  >
    <div style="max-height: 100vh; overflow: hidden">
      <div class="mobile-header-home container">
        <span>
          <IconBaselineDensityMedium
            @click.stop="isOpenMobileNav = false"
            stroke-width="1"
          />
        </span>
        <router-link to="/" class="home-link"> HoangStudio </router-link>
      </div>
      <Navigation @click="isOpenMobileNav = false" />
    </div>
  </el-drawer>
</template>

<style lang="scss" src="./StudioHeader.scss"></style>

<script setup>
import {
  IconUserCircle,
  IconVideoPlus,
  IconBaselineDensityMedium,
  IconLogout,
  IconBrandYoutube,
  IconArrowBarUp,
} from "@tabler/icons-vue";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import api from "@/api/axios";
import { useBreakpoints } from "@/composables/useBreakpoints";
import Navigation from "./Navigation.vue";
import { convertThumbnail } from "../../utils/videoThumbnail";

const route = useRoute();
const authStore = useAuthStore();

const user = ref({});
onBeforeMount(async () => {
  try {
    const res = await api.get("api/v1/users/profile");
    user.value = res.data;
  } catch (error) {
    console.log(error);
  }
});

const { width } = useBreakpoints();
const isOpenMobileNav = ref(false);
const openMobileNav = () => {
  if (width.value <= 576) {
    isOpenMobileNav.value = true;
  }
};
</script>
