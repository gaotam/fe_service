<script setup>
import dayjs from "dayjs";
import { defineProps } from "vue";
import { useRouter } from "vue-router";

import { convertThumbnail } from "../../utils/videoThumbnail";
import { durationFormat } from "../../utils/formatTime";

const router = useRouter();

const props = defineProps({
  video: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div
    class="video-box"
    @click="
      router.push({ name: 'video-detail', params: { videoId: video.id } })
    "
  >
    <div class="thumbnail">
      <img :src="convertThumbnail(video.thumbnail)" alt="" />
      <div class="duration">{{ durationFormat(video.duration) }}</div>
    </div>
    <div class="video-title">
      <p>{{ video.title }}</p>
      <router-link
        @click.stop="
          router.push({ name: 'channel', params: { userId: video.user.id } })
        "
        :to="{ name: 'channel', params: { userId: video.user.id } }"
      >
        {{ video.user.fullname }}
      </router-link>
      <span
        >{{ video.views }} lượt xem -
        {{ dayjs(video.createdAt).fromNow() }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-box {
  cursor: pointer;
  &:hover .thumbnail {
    opacity: 0.5;
  }
  .thumbnail {
    width: 100%;
    overflow: hidden;
    border-radius: 5px;
    opacity: 1;
    -webkit-transition: 0.3s ease-in-out;
    transition: 0.3s ease-in-out;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      aspect-ratio: 1.78;
    }
    position: relative;
    .duration {
      background-color: rgba(0, 0, 0, 0.8);
      width: max-content;
      color: #fff;
      padding: 2px 3px;
      border-radius: 4px;
      font-size: 14px;
      line-height: 12px;
      position: absolute;
      right: 3px;
      bottom: 3px;
    }
  }
  .video-title {
    margin-top: 10px;
    p {
      &:first-child {
        font-size: 0.9rem;
        font-weight: bold;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    span {
      color: #606060;
      font-size: 0.8rem;
      display: block;
      margin-top: 8px;
    }
  }
}
p {
  margin: 0;
}
</style>
