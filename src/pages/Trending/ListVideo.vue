<template>
  <div class="trend-video">
    <div class="trend-title">
      <img
        src="https://www.youtube.com/img/trending/avatar/trending.png"
        alt=""
      />
      <h1>Thịnh hành</h1>
    </div>
    <div class="trend-tab">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="Mới nhất" name="new">
          <div
            class="video-box"
            v-for="video in newVideos"
            @click="videoDetail(video.id)"
            :key="video.id"
          >
            <div class="thumbnail">
              <img :src="video.thumbnail" alt="" />
              <div class="duration">
                {{ durationFormat(video.duration) }}
              </div>
            </div>
            <div class="video-infor">
              <h3>{{ video.title }}</h3>
              <div class="video-channel">
                <span>{{ video.user.fullname }}</span> -
                <span>{{ video.views }} lượt xem</span> -
                <span>{{ dayjs(video.createdAt).fromNow() }}</span>
              </div>
              <p class="video-desc">
                {{ video?.desc }}
              </p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Âm nhạc" name="music">
          <div
            class="video-box"
            v-for="video in musicVideos"
            @click="videoDetail(video.id)"
            :key="video.id"
          >
            <div class="thumbnail">
              <img :src="video.thumbnail" alt="" />
              <div class="duration">
                {{ durationFormat(video.duration) }}
              </div>
            </div>
            <div class="video-infor">
              <h3>{{ video.title }}</h3>
              <div class="video-channel">
                <span>{{ video.user.fullname }}</span> -
                <span>{{ video.views }} lượt xem</span> -
                <span>{{ dayjs(video.createdAt).fromNow() }}</span>
              </div>
              <p class="video-desc">
                {{ video?.desc }}
              </p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Trò chơi" name="game">
          <div
            class="video-box"
            v-for="video in gameVideos"
            @click="videoDetail(video.id)"
            :key="video.id"
          >
            <div class="thumbnail">
              <img :src="video.thumbnail" alt="" />
              <div class="duration">
                {{ durationFormat(video.duration) }}
              </div>
            </div>
            <div class="video-infor">
              <h3>{{ video.title }}</h3>
              <div class="video-channel">
                <span>{{ video.user.fullname }}</span> -
                <span>{{ video.views }} lượt xem</span> -
                <span>{{ dayjs(video.createdAt).fromNow() }}</span>
              </div>
              <p class="video-desc">
                {{ video?.desc }}
              </p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Phim ảnh" name="film">
          <div
            class="video-box"
            v-for="video in filmVideos"
            @click="videoDetail(video.id)"
            :key="video.id"
          >
            <div class="thumbnail">
              <img :src="video.thumbnail" alt="" />
              <div class="duration">
                {{ durationFormat(video.duration) }}
              </div>
            </div>
            <div class="video-infor">
              <h3>{{ video.title }}</h3>
              <div class="video-channel">
                <span>{{ video.user.fullname }}</span> -
                <span>{{ video.views }} lượt xem</span> -
                <span>{{ dayjs(video.createdAt).fromNow() }}</span>
              </div>
              <p class="video-desc">
                {{ video?.desc }}
              </p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" src="./ListVideo.scss"></style>

<script setup>
import { ref, watchEffect } from "vue";
import dayjs from "dayjs";
import { router } from "@/router";

import api from "@/api/axios";
import { durationFormat } from "../../utils/formatTime";
const activeName = ref("new");

const newVideos = ref([]);
const musicVideos = ref([]);
const gameVideos = ref([]);
const filmVideos = ref([]);

watchEffect(async () => {
  let data = await Promise.all([
    api.get("/api/v1/videos/trending"),
    api.get("/api/v1/videos/trending?type=music"),
    api.get("/api/v1/videos/trending?type=game"),
    api.get("/api/v1/videos/trending?type=film"),
  ]);

  newVideos.value = data[0].data.map((v) => {
    return {
      ...v,
      thumbnail: `${import.meta.env.VITE_API_URL}/static/${v.thumbnail}`,
    };
  });

  musicVideos.value = data[1].data.map((v) => {
    return {
      ...v,
      thumbnail: `${import.meta.env.VITE_API_URL}/static/${v.thumbnail}`,
    };
  });

  gameVideos.value = data[2].data.map((v) => {
    return {
      ...v,
      thumbnail: `${import.meta.env.VITE_API_URL}/static/${v.thumbnail}`,
    };
  });

  filmVideos.value = data[3].data.map((v) => {
    return {
      ...v,
      thumbnail: `${import.meta.env.VITE_API_URL}/static/${v.thumbnail}`,
    };
  });
});

const videoDetail = (id) => {
  router.push({ name: "video-detail", params: { videoId: id } });
};
</script>
