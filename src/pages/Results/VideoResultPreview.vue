<script setup>
import dayjs from "dayjs";
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import { durationFormat } from "../../utils/formatTime";
import { convertThumbnail } from "../../utils/videoThumbnail";
const props = defineProps(["video"]);

const router = useRouter();
</script>

<template>
  <div
    class="video-box"
    @click="
      router.push({ name: 'video-detail', params: { videoId: video.id } })
    "
  >
    <div class="video-thumbnail">
      <img :src="convertThumbnail(video.thumbnail)" alt="" />
      <div class="duration">
        {{ durationFormat(video.duration) }}
      </div>
    </div>
    <div>
      <h4>
        {{ video.title }}
      </h4>
      <div class="video-channel">
        <p class="chanel-data">
          {{ video.views }} lượt xem -
          {{ dayjs(video.createdAt).fromNow() }}
        </p>
        <p class="channel-infor">
          <img
            class="channel-avatar"
            :src="convertThumbnail(video.user.avatar) || '/src/assets/user.png'"
            alt=""
          />
          <span>
            {{ video.user.fullname }}
          </span>
        </p>
      </div>
      <p class="video-desc">
        {{ video?.desc }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-box {
  display: flex;
  margin-top: 15px;
  cursor: pointer;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
  .video-thumbnail {
    flex: 0.5;
    position: relative;
    @media screen and (max-width: 992px) {
      flex: 1;
    }
    img {
      width: 100%;
      object-fit: cover;
      opacity: 1;
      border-radius: 5px;
      -webkit-transition: 0.3s ease-in-out;
      transition: 0.3s ease-in-out;
    }
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
  &:hover .video-thumbnail img {
    opacity: 0.7;
  }
  > div:not(.video-thumbnail) {
    flex: 1;
    margin-left: 15px;
    @media screen and (max-width: 767px) {
      margin-left: 0;
      margin-top: 10px;
    }
  }
  h4 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .video-channel {
    .chanel-data {
      font-size: 12px;
    }
    .channel-infor {
      display: flex;
      align-items: center;
      margin: 5px 0;
    }
    .channel-avatar {
      border-radius: 90%;
      width: 30px;
      height: 30px;
      margin-right: 10px;
      @media screen and (max-width: 767px) {
        width: 25px;
        height: 25px;
      }
    }
  }
  .video-desc {
    font-size: 12px;
    margin-top: 10px;
    color: #606060;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
