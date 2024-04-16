<script setup>
import VideoCarousel from "./VideoCarousel.vue";

const types = [
  { title: "Nổi bật", type: "trending" },
  { title: "Đề xuất", type: "propose" },
  { title: "Video mới", type: "new" },
];
</script>

<template>
  <div class="music">
    <div class="music-title">
      <img
        src="https://yt3.googleusercontent.com/vCqmJ7cdUYpvR0bqLpWIe8ktaor4QafQLlfQyTuZy-M9W_YafT8Wo9kdsKL2St1BrkMRpVSJgA=s176-c-k-c0x00ffffff-no-rj-mo"
        alt=""
      />
      <h1>Âm nhạc</h1>
    </div>
    <VideoCarousel
      v-for="{ title, type } in types"
      :key="type"
      :title="title"
      :type="type"
      category="music"
      class="video-carousel"
    />
  </div>
</template>

<style lang="scss" scoped>
.music {
  width: 100%;
  .music-title {
    margin-top: 20px;
    display: flex;
    align-items: center;
    img {
      height: 72px;
      width: 72px;
      border-radius: 50%;
      margin-right: 20px;
    }
  }
  .video-carousel {
    &:not(:last-child) {
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
