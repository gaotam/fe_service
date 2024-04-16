<script setup>
import { ref, onBeforeMount, watchEffect, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import api from "../../api/axios";
import { useAuthStore } from "../../stores/auth";
import VideoBox from "./VideoBox.vue";
import { convertThumbnail } from "../../utils/videoThumbnail";

const route = useRoute();
const router = useRouter();

const curUserId = useAuthStore().user;

const channel = ref({});
const totalSubUsers = ref(0);

const loadChannel = async () => {
  try {
    const res = await api.get("api/v1/users/" + route.params.userId);
    channel.value = res.data;
    totalSubUsers.value = res.data.totalSub;
  } catch (error) {
    console.log(error);
  }
};

const isSub = ref(false);
const loadSubs = async () => {
  try {
    const res = await api.get("api/v1/subscriptions");
    isSub.value = res.data.some((s) => s.sup_user.id == channel.value?.id);
  } catch (error) {
    console.log(error);
  }
};
const subscribeHandler = async () => {
  try {
    const res = await api.post(
      `api/v1/subscriptions?type=sub&subId=${channel.value.id}`
    );
    isSub.value = true;
    totalSubUsers.value++;
  } catch (error) {
    console.log(error);
  }
};

const unSubscribeHandler = async () => {
  try {
    const res = await api.post(
      `api/v1/subscriptions?type=un_sub&subId=${channel.value.id}`
    );
    isSub.value = false;
    totalSubUsers.value--;
  } catch (error) {
    console.log(error);
  }
};

const tabs = [
  {
    label: "Video",
    tab: "videos",
  },
  {
    label: "Trực tiếp",
    tab: "live",
  },
];
const activeName = ref("videos");

const videos = ref([]);
const curPage = ref(0);
const total = ref(0);

const loadVideos = async () => {
  if (videos.value.length == total.value && videos.value.length != 0) return;
  try {
    const res = await api.getWithParams(`api/v1/${activeName.value}`, {
      page: curPage.value,
      userId: route.params.userId,
    });
    videos.value.push(...res.data.videos);
    total.value = res.data.total;
  } catch (error) {
    console.log(error);
    videos.value = [];
  }
};

onBeforeMount(async () => {
  await loadChannel();
  await loadVideos();
  await loadSubs();
});

// watch(
//   activeName,
//   () => {
//     curPage.value = 1
//   }
// );

watch(
  () => [curPage.value, activeName.value],
  async ([_newPage, newActive], [_oldPage, oldActive]) => {
    if(newActive != oldActive){
      videos.value = []
      if(curPage.value == 1){
        await loadVideos();
      } else {
        curPage.value = 1
      }
    } else {
      await loadVideos();
    }
  }
);
</script>

<template>
  <div class="channel">
    <div class="user-info">
      <img
        :src="convertThumbnail(channel.avatar) || '/src/assets/user.png'"
        alt=""
        class="avt"
        width="160"
        height="160"
      />
      <div class="info">
        <h1 class="userrname">{{ channel?.fullname }}</h1>
        <p class="data">
          {{ channel?.fullname }} ‧ {{ totalSubUsers }} người đăng ký ‧
          {{ channel?.totalVideo }} video
        </p>
        <div v-if="channel?.id !== curUserId">
          <button v-if="!isSub" class="btn" @click="subscribeHandler">
            Đăng ký
          </button>
          <button v-else class="btn subscribed" @click="unSubscribeHandler">
            Hủy đăng ký
          </button>
        </div>
      </div>
    </div>

    <el-tabs
      v-model="activeName"
      v-infinite-scroll="
        () => {
          curPage += 1;
        }
      "
    >
      <el-tab-pane
        v-for="{ label, tab } in tabs"
        :key="tab"
        :label="label"
        :name="tab"
      >
        <div class="tab-wrapper">
          <video-box
            v-for="v in videos"
            :key="v.id"
            :video="v"
            @click="
              $router.push({ name: 'video-detail', param: { videoId: v.id } })
            "
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" src="./Channel.scss"></style>
