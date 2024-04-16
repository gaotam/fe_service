<template>
  <div class="video-right-wrapper">
    <ChipBar></ChipBar>
    <div class="video-right-nav">
      <div class="video-box" v-for="video in videos" :key="video.id">
        <div class="thumbnail">
          <img
            :src="video.thumbnail"
            alt=""
            @click="() => videoDetail(video.id)"
          />
          <div class="duration">
            {{ durationFormat(video.duration) }}
          </div>
        </div>
        <div class="video-info">
          <p class="video-title" @click="() => videoDetail(video.id)">
            {{ video.title }}
          </p>
          <span class="channel-name" @click="() => channel(video.user.id)">{{
            video.user.fullname
          }}</span>
          <br />
          <span @click="() => videoDetail(video.id)"
            >{{ video.views }} lượt xem -
            {{ dayjs(video?.createdAt).fromNow() }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./VideoRight.scss"></style>

<script setup>
import { ref, watchEffect } from "vue";
import { router } from "@/router";
import dayjs from "dayjs";
import api from "@/api/axios";
import ChipBar from "@/pages/Home/ChipBar.vue";
import { durationFormat } from "../../utils/formatTime";

let videos = ref();

watchEffect(async () => {
  let data = await api.get("/api/v1/videos");
  videos.value = data.data.videos.map((v) => {
    return {
      ...v,
      thumbnail: `${import.meta.env.VITE_API_URL}/static/${v.thumbnail}`,
    };
  });
});

const videoDetail = (id) => {
  router.push({ name: "video-detail", params: { videoId: id } });
};

const channel = (id) => {
  router.push({ name: "channel", params: { userId: id } });
};
</script>
