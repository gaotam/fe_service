<template>
  <div class="video-detail">
    <el-row>
      <el-col :lg="16">
        <Player>
          <Hls :config="hlsConfig" version="1.4.14" :poster="video?.thumbnail">
            <source
              :data-src="video?.srcTranscode"
              type="application/x-mpegURL"
            />
          </Hls>
          <DefaultUi> </DefaultUi>
        </Player>
        <h3>{{ video?.title }}</h3>
        <div class="video-action">
          <div class="video-left">
            <img
              class="channel-avatar"
              src="@/assets/hoang.jpg"
              alt=""
            />
            <router-link
              v-if="video.user?.id"
              style="margin-left: 5px"
              :to="{ name: 'channel', params: { userId: video.user.id } }"
            >
              <p>{{ video?.user?.fullname }}</p>
              <span>{{ totalSub }} người đăng ký</span>
            </router-link>
            <div v-if="video.user && userStore.getUserId() != video.user.id">
              <div v-if="!isSub" class="btn-subscribe" @click="() => subscribeHandler(video.user.id)">Đăng ký</div>
              <div v-else class="btn-subscribe" style="background-color: #e5e5e5; color: black;" @click="() => unSubscribeHandler(video.user.id)">Hủy đăng ký</div>
            </div>
          </div>
          <div class="video-right">
            <div><IconShare3 stroke-width="1" /> Chia sẻ</div>
            <div><IconDownload stroke-width="1" /> Tải xuống</div>
            <div><IconFlag stroke-width="1" /> Báo cáo</div>
          </div>
        </div>
        <div class="video-desc">
          <p class="desc-meta">
            {{ video?.views?.toLocaleString('en-US') }} lượt xem -
            {{ dayjs(video?.createdAt).fromNow() }}
          </p>
          {{ video?.desc }}
        </div>

        <Comment v-if="video" :disable="video?.disableComment"/>
      </el-col>
      <el-col :lg="8">
        <VideoRight></VideoRight>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, watch, watchEffect, ref } from "vue";
import { useRoute } from "vue-router";
import { router } from "@/router";
import { useAuthStore } from "@/stores/auth"
import dayjs from "dayjs";
import { Player, DefaultUi, Hls } from "@vime/vue-next";
import {
  IconShare3,
  IconDownload,
  IconFlag,
} from "@tabler/icons-vue";
import api from "@/api/axios";
import VideoRight from "./VideoRight.vue";
import Comment from "./Comment.vue";
const route = useRoute();

const isSub = ref(true);
const totalSub = ref(0);
let video = reactive({});

const userStore = useAuthStore();

const loadVideoDetail = async() => {
  let data = await api.get(`/api/v1/videos/${route.params.videoId}`);
  Object.assign(video, data.data);
  video.thumbnail = `${import.meta.env.VITE_API_URL}/static${video.thumbnail}`;
  video.srcTranscode = `${import.meta.env.VITE_API_URL}/static${
    video.srcTranscode
  }`;

  getSub(video.user.id)
    .then(() => { })
    .catch(() => { isSub.value = false })

  loadUserInfo(video.user.id)
    .then((data) => {
      totalSub.value = data.totalSub
    })
    .catch(err => console.log(err))
}


const loadUserInfo = async (userId) => {
  try {
    const res = await api.get(`api/v1/users/${userId}`);
    return res.data
  } catch (error) {
    console.log(error);
  }
};

const getSub = async (userId) => {
  let data = await api.get(`/api/v1/subscriptions/${userId}`);
  return data.data
}

const subscribeHandler = async (userId) => {
  try {
    const res = await api.post(
      `api/v1/subscriptions?type=sub&subId=${userId}`
    );
    isSub.value = true;
    totalSub.value++
  } catch (error) {
    console.log(error);
  }
};


const unSubscribeHandler = async (userId) => {
  try {
    const res = await api.post(
      `api/v1/subscriptions?type=un_sub&subId=${userId}`
    );
    isSub.value = false;
    totalSub.value--
  } catch (error) {
    console.log(error);
  }
};

watchEffect(async () => {
  await loadVideoDetail()
});

watch(route.params.videoId, async() => {
  await loadVideoDetail()
})

const hlsConfig = reactive({});
</script>

<style lang="scss" src="./VideoDetail.scss"></style>
