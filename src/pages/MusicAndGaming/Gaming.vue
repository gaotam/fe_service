<script setup>
import VideoCarousel from "./VideoCarousel.vue";

const types = [
  { title: "Nổi bật", type: "trending" },
  { title: "Đề xuất", type: "propose" },
  { title: "Video mới", type: "new" },
];
</script>

<template>
  <div class="gaming">
    <div class="gaming-title">
      <img
        src="https://yt3.googleusercontent.com/pzvUHajbQDLDt63gKFYUX445k3VprUs8CeJFpNTxGQZlk0grOSkAqU8Th1_C97dyYM3nENgjbw=s120-c-k-c0x00ffffff-no-rj"
        alt=""
      />
      <h1>Trò chơi</h1>
    </div>
    <VideoCarousel
      v-for="{ title, type } in types"
      :key="type"
      :title="title"
      :type="type"
      category="game"
      class="video-carousel"
    />
  </div>
</template>

<style lang="scss" scoped>
.gaming {
  width: 100%;
  .gaming-title {
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
