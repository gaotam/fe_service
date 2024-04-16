<script setup>
import dayjs from "dayjs";
import { defineProps } from "vue";

import { convertThumbnail } from "../../../utils/videoThumbnail";

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="studio-comment-line">
    <div class="left">
      <img
        class="user-avt"
        src="@/assets/hoang.jpg"
        alt=""
      />
      <div>
        <p>
          <span class="username">{{ comment.user.fullname }}</span>
          •
          <span class="time">{{ dayjs(comment.createdAt).fromNow() }}</span>
        </p>
        <p class="comment-content">{{ comment.content }}</p>
      </div>
    </div>
    <router-link
      class="right"
      :to="{ name: 'video-detail', params: { videoId: comment.video.id } }"
    >
      <img
        class="video-thumbnail"
        :src="convertThumbnail(comment.video.thumbnail)"
        alt=""
      />
      <p class="video-title">{{ comment.video.title }}</p>
    </router-link>
  </div>
</template>

<style lang="scss" scoped src="./CommentLine.scss"></style>
