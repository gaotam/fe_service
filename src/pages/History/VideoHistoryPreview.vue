<script setup>
import dayjs from "dayjs";
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import { durationFormat } from "../../utils/formatTime";
const props = defineProps(["video"]);

const router = useRouter();

const thumbnail = `${import.meta.env.VITE_API_URL}/static/${
  props.video.video.thumbnail
}`;
</script>

<template>
  <div
    class="video-box"
    @click="
      router.push({ name: 'video-detail', params: { videoId: video.video.id } })
    "
  >
    <div class="video-thumbnail">
      <img :src="thumbnail" alt="" />
      <div class="duration">{{ durationFormat(video.video.duration) }}</div>
    </div>
    <div>
      <h4>{{ video.video.title }}</h4>
      <div class="video-channel">
        <span>
          <router-link
            @click.stop="
              router.push({
                name: 'channel',
                params: { userId: video.user.id },
              })
            "
            :to="{ name: 'channel', params: { userId: video.user.id } }"
          >
            {{ video.user.fullname }}
          </router-link>
          - {{ video.video.views }} lượt xem -
          {{ dayjs(video.video.createdAt).fromNow() }}
        </span>
      </div>
      <p class="video-desc">
        {{ video.video?.desc }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-box {
  display: flex;
  max-width: 800px;
  margin-top: 15px;
  cursor: pointer;
  .video-thumbnail {
    flex: 0.5;
    @media screen and (max-width: 992px) {
      flex: 1;
    }
    
    width: 100%;
    overflow: hidden;
    border-radius: 5px;
    opacity: 1;
    -webkit-transition: 0.3s ease-in-out;
    transition: 0.3s ease-in-out;
    img {
      width: 100%;
      aspect-ratio: 1.78;
      object-fit: cover;
      display: block;
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
  &:hover img {
    opacity: 0.7;
  }
  > div:not(.video-thumbnail) {
    flex: 1;
    margin-left: 15px;
    @media screen and (max-width: 767px) {
      display: none;
    }
  }
  h4 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .video-channel {
    margin-top: 5px;
  }
  .video-desc {
    font-size: 0.8rem;
    margin-top: 10px;
    color: #606060;
  }
}
</style>
