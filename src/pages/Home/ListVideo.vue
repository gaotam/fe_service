<template>
  <div class="list-video" v-if="typeCategory != 'live'">
    <div
      v-for="video in videosTrend"
      :key="video.id"
      class="video-box"
      @click="videoDetail(video)"
    >
      <div class="thumbnail">
        <img :src="video.thumbnail" alt="" />
        <div class="duration">
          {{ durationFormat(video.duration) }}
        </div>
      </div>
      <div class="rich-grid">
        <router-link
          v-if="video?.user"
          @click.stop="
            router.push({
              name: 'channel',
              params: { userId: video.user.id },
            })
          "
          :to="{ name: 'channel', params: { userId: video.user.id } }"
        >
          <img
            class="channel-avatar"
            :src="convertThumbnail(video.user.avatar) || '/src/assets/user.png'"
            alt=""
          />
        </router-link>
        <div class="video-title">
          <p>{{ video.title }}</p>
          <router-link
            v-if="video?.user"
            @click.stop="
              router.push({
                name: 'channel',
                params: { userId: video.user.id },
              })
            "
            :to="{ name: 'channel', params: { userId: video?.user?.id } }"
          >
            {{ video.user.fullname }}
          </router-link>
          <br />
          <span
            >{{ shortView(video.views) }} lượt xem -
            {{ dayjs(video.createdAt).fromNow() }}</span
          >
        </div>
      </div>
    </div>
  </div>
  <el-divider v-if="typeCategory != 'live'"/>
  <div class="list-video">
    <div
      v-for="video in videos"
      :key="video.id"
      class="video-box"
      v-infinite-scroll="loadVideos" 
      infinite-scroll-delay="300"
      @click="videoDetail(video)"
    >
      <div class="thumbnail">
        <img :src="video.thumbnail" alt="" />
        <div class="duration">{{ durationFormat(video.duration) }}</div>
      </div>
      <div class="rich-grid">
        <router-link
          v-if="video?.user"
          @click.stop="
            router.push({
              name: 'channel',
              params: { userId: video.user.id },
            })
          "
          :to="{ name: 'channel', params: { userId: video?.user?.id } }"
        >
          <img
            class="channel-avatar"
            :src="convertThumbnail(video.user.avatar) || '/src/assets/user.png'"
            alt=""
          />
        </router-link>
        <div class="video-title">
          <p>{{ video.title }}</p>
          <router-link
            v-if="video?.user"
            @click.stop="
              router.push({
                name: 'channel',
                params: { userId: video.user.id },
              })
            "
            :to="{ name: 'channel', params: { userId: video?.user?.id } }"
          >
            {{ video.user.fullname }}
          </router-link>
          <br />
          <span
            >{{ shortView(video.views) }} lượt xem -
            {{ dayjs(video.createdAt).fromNow() }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./ListVideo.scss"></style>

<script setup>
import { watchEffect, watch, ref, computed } from "vue";
import { router } from "@/router";
import { shortView } from "@/utils/view";
import { useCategoryStore } from "@/stores/category";
const categoryStore = useCategoryStore();
import api from "@/api/axios";
import dayjs from "dayjs";

import { durationFormat } from "../../utils/formatTime";
import { convertThumbnail } from "../../utils/videoThumbnail";
const videosTrend = ref();
const videos = ref([]);
let page = 1;
const typeCategory = computed(() => categoryStore.type);

watchEffect(async () => {
  try {
    let data = await api.get(
      `/api/v1/videos/trending?type=${typeCategory.value}`
    );
    videosTrend.value = data.data.slice(0, 8).map((v) => {
      return {
        ...v,
        thumbnail: `${import.meta.env.VITE_API_URL}/static/${v.thumbnail}`,
      };
    });
  } catch (error) {
    console.log(error);
  }
});

const loadVideos = async () => {
  try {
    let data = await api.get(
      `/api/v1/videos?page=${page++}&type=${typeCategory.value}`
    );

    videos.value.push(...data.data.videos.map((v) => {
      return {
        ...v,
        thumbnail: `${import.meta.env.VITE_API_URL}/static/${v.thumbnail}`,
      };
  }));
  } catch (error) {
    console.log(error);
  }
};

watchEffect(async () => {
  await loadVideos();
});

const videoDetail = (video) => {
  if(!video?.livestream || video?.livestream?.status == "SUCCESS"){
    router.push({ name: "video-detail", params: { videoId: video.id } });
  } else {
    router.push({ name: "livestream-detail", params: { videoId: video.id } });
  }
};

watch(typeCategory, () => {
  page = 1;
  videos.value = []
});
</script>
