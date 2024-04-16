<template>
  <div class="header">
    <div class="container flex" v-if="isOpenMobileHeader && width <= 576">
      <div class="header-btn flex">
        <span @click="isOpenMobileHeader = false">
          <IconArrowLeft stroke-width="1" />
        </span>
      </div>
      <form
        @submit.prevent="
          router.push({ name: 'results', query: { s: searchQuery } })
        "
        class="header-search flex"
      >
        <input
          v-model="searchQuery"
          type="text"
          name="search_query"
          placeholder="Tìm kiếm"
        />
        <button><IconSearch stroke-width="1" /></button>
      </form>
    </div>
    <div class="container flex" v-else>
      <div class="header-home flex">
        <span>
          <IconBaselineDensityMedium
            @click.stop="openMobileNav"
            stroke-width="1"
          />
        </span>
        <router-link to="/" class="home-link"> HoangTuBe </router-link>
      </div>
      <form
        @submit.prevent="
          router.push({ name: 'results', query: { s: searchQuery } })
        "
        class="header-search flex"
        v-if="width > 576 || isOpenMobileHeader"
      >
        <input
          v-model="searchQuery"
          type="text"
          name="search_query"
          placeholder="Tìm kiếm"
        />
        <button><IconSearch stroke-width="1" /></button>
      </form>
      <div class="header-btn flex">
        <span v-if="width <= 576" @click="isOpenMobileHeader = true">
          <IconSearch stroke-width="1" />
        </span>
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
                  to="/studio/content?upload=true"
                  class="popper-link"
                >
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
                      <path
                        d="m10 8 6 4-6 4V8zm11-5v18H3V3h18zm-1 1H4v16h16V4z"
                      ></path>
                    </svg>
                  </div>
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
                <span>
                  <IconVideoPlus stroke-width="1" />
                </span>
              </template>
            </el-popover>
            <el-popover
              :width="500"
              popper-class="popper"
              trigger="click"
              content="Create video"
              placement="bottom-end"
              v-model:visible="notiPopoverVisible"
              :hide-after="0"
              v-if="width > 767"
            >
              <h3 class="noti-title">Thông báo</h3>
              <el-scrollbar v-if="notifications.length" max-height="450px">
                <HeaderNoti
                  v-for="noti in notifications"
                  :key="noti.id"
                  :notification="noti"
                  @click="notiClickHandler(noti)"
                />
              </el-scrollbar>
              <el-empty v-else description="Không có thông báo nào!" />
              <div
                class="showmore"
                v-if="
                  notifications.length !== totalNoti ||
                  notifications.length === 0
                "
                @click="showMoreNoti"
              >
                <span>Hiện thêm</span>
              </div>
              <template #reference>
                <span>
                  <el-badge
                    v-if="totalUnWatched"
                    :value="totalUnWatched"
                    :max="9"
                  >
                    <IconBell stroke-width="1" />
                  </el-badge>
                  <IconBell v-else stroke-width="1" />
                </span>
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
                  :src="
                    convertThumbnail(user.avatar) || '/src/assets/user.png'
                  "
                  alt=""
                />
              </div>
              <p>{{ user.fullname }}</p>
            </div>
            <div class="user-nav">
              <router-link to="/studio/dashboard" class="popper-link">
                <IconUserSquare stroke-width="1" />
                <span>Kênh của tôi</span>
              </router-link>
              <router-link to="/logout" class="popper-link">
                <IconLogout stroke-width="1" />
                <span>Đăng xuất</span>
              </router-link>
            </div>
            <template #reference>
              <div class="user-avt">
                <img
                  :src="
                    convertThumbnail(user.avatar) || '/src/assets/user.png'
                  "
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
    <div class="aa" @click="isOpenMobileNav = false">
      <div class="mobile-header-home flex">
        <span>
          <IconBaselineDensityMedium
            @click.stop="isOpenMobileNav = false"
            stroke-width="1"
          />
        </span>
        <router-link to="/" class="home-link"> HoangTuBe </router-link>
      </div>
      <Navigation />
    </div>
  </el-drawer>
</template>

<style lang="scss" src="./Header.scss"></style>

<script setup>
import {
  IconSearch,
  IconUserCircle,
  IconVideoPlus,
  IconBell,
  IconBaselineDensityMedium,
  IconLogout,
  IconUserSquare,
  IconArrowLeft,
} from "@tabler/icons-vue";
import { ref, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import api from "../../api/axios";
import { useBreakpoints } from "../../composables/useBreakpoints";
import HeaderNoti from "./HeaderNoti.vue";
import Navigation from "../Navigation/Navigation.vue";
import { useSocketIO } from "../../compositions/socket";
import { convertThumbnail } from "../../utils/videoThumbnail";

const authStore = useAuthStore();
const { socket } = useSocketIO();
const user = ref({});
const notifications = ref([]);
const curNotiPage = ref(1);
const totalNoti = ref(0);
const totalUnWatched = ref(0);
const loadUser = async () => {
  try {
    const userRes = await api.get("api/v1/users/profile");
    user.value = userRes.data;
  } catch (error) {
    console.log(error);
  }
};
const loadNotifications = async () => {
  try {
    const notiRes = await api.getWithParams("api/v1/notifications", {
      page: curNotiPage.value,
      limit: 10,
    });
    notifications.value.push(...notiRes.data.notifications);
    totalNoti.value = notiRes.data.total;
    totalUnWatched.value = notiRes.data.totalUnWatched;
  } catch (error) {
    console.log(error);
  }
};
const showMoreNoti = async () => {
  if (
    notifications.value.length === totalNoti.value &&
    notifications.value.length !== 0
  )
    return;
  curNotiPage.value++;
  await loadNotifications();
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

const router = useRouter();
const searchQuery = ref(router.currentRoute.value.query.s);

const { width } = useBreakpoints();
const isOpenMobileNav = ref(false);
const isOpenMobileHeader = ref(false);
const openMobileNav = () => {
  if (width.value <= 576) {
    isOpenMobileNav.value = true;
  }
};

const notiPopoverVisible = ref(false);
const notiClickHandler = async (notification) => {
  try {
    await api.put(`api/v1/notifications/${notification.id}`);
    await loadNotifications();
    notiPopoverVisible.value = false;
    router.push({
      name: notification.video.isLive ? "livestream-detail" : "video-detail",
      params: { videoId: notification.video.id },
    });
  } catch (error) {
    console.log(error);
  }
};
</script>
