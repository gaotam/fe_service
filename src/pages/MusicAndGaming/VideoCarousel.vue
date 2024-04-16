<script setup>
import { defineProps, onBeforeMount, ref } from "vue";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-vue";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
const modules = [Navigation];

import api from "../../api/axios";
import VideoBox from "./VideoBox.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const videos = ref([]);
onBeforeMount(async () => {
  try {
    const res = await api.getWithParams(
      `/api/v1/videos/category/${props.category}`,
      {
        type: props.type,
      }
    );
    videos.value = res.data;
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="video-carousel">
    <h3>{{ title }}</h3>
    <swiper
      :space-between="10"
      :navigation="{
        nextEl: `.slide-btn.slide-next-btn.slide-btn-${type}`,
        prevEl: `.slide-btn.slide-prev-btn.slide-btn-${type}`,
        disabledClass: 'slide-disabled-btn',
      }"
      :modules="modules"
      :breakpoints="{
        1200: {
          slidesPerView: 5,
        },
        992: {
          slidesPerView: 4,
        },
        767: {
          slidesPerView: 3,
        },
        576: {
          slidesPerView: 2,
        },
        0: {
          slidesPerView: 1,
        },
      }"
    >
      <swiper-slide v-for="video in videos" :key="video.id">
        <VideoBox :video="video" />
      </swiper-slide>
    </swiper>
    <button class="slide-btn slide-prev-btn" :class="`slide-btn-${type}`">
      <IconChevronLeft />
    </button>
    <button class="slide-btn slide-next-btn" :class="`slide-btn-${type}`">
      <IconChevronRight />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.video-carousel {
  position: relative;
  padding: 30px 0;
  h3 {
    margin-bottom: 20px;
  }
  .slide-btn {
    width: 35px;
    height: 35px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3), 0 0 4px rgba(0, 0, 0, 0.2);
    border: 0;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    z-index: 10;
    &.slide-prev-btn {
      left: 0;
      transform: translate(-50%, -100%);
    }
    &.slide-next-btn {
      right: 0;
      transform: translate(50%, -100%);
    }
  }
  .slide-disabled-btn {
    display: none;
  }
}
</style>
