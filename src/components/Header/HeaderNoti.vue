<script setup>
import dayjs from "dayjs";
import { defineProps } from "vue";

import { convertThumbnail } from "../../utils/videoThumbnail";

const props = defineProps({
  notification: {
    required: true,
    type: Object,
  },
});
</script>

<template>
  <div class="header-noti" :class="{ watched: notification.watched }">
    <div class="avt-chanel">
      <img src="@\assets\user.png" alt="" />
    </div>
    <div class="content">
      <p>
        {{ notification.video.user.fullname }} {{ notification.content }}
        {{ notification.video.title }}
      </p>
      <span class="time">{{ dayjs(notification.updatedAt).fromNow() }}</span>
    </div>
    <div class="video-thubmnail">
      <img :src="convertThumbnail(notification.video.thumbnail)" alt="" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-noti {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  cursor: pointer;
  position: relative;
  background-color: #f5f5f5;
  &:hover {
    background-color: #ececec !important;
  }
  .content {
    flex: 1;
    padding: 0 20px;
    p {
      margin: 0;
    }
    .time {
      display: block;
      margin-top: 10px;
    }
  }
  .avt-chanel {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    overflow: hidden;
    &::before {
      content: "";
      position: absolute;
      top: 35px;
      left: 5px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #065fd4;
    }
  }
  .video-thubmnail {
    width: 100px;
    height: 60px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &.watched {
    background-color: #fff;
    .avt-chanel {
      &::before {
        display: none;
      }
    }
  }
}
</style>
