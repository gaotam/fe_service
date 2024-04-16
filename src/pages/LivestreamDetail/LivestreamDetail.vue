<template>
  <Header />
  
  <main>
    <div class="video-detail">
      <el-row>
        <el-col :lg="2">
          <Navigation></Navigation>
        </el-col>
        <el-col :lg="12">
          <div v-html="iframe" class="player-live"></div>
          <h3>{{ live?.title }}</h3>
          <div class="video-action">
            <div class="video-left">
              <img class="channel-avatar" :src="convertThumbnail(live?.user?.avatar) || '/src/assets/user.png'" alt="" />
              <div style="margin-left: 5px">
                <p>{{ live?.user?.fullname }}</p>
                <span>10N người đăng ký</span>
              </div>
              <div class="btn-subscribe">Đăng ký</div>
            </div>
            <div class="video-right">
              <div><IconShare3 stroke-width="1" /> Chia sẻ</div>
              <div><IconDownload stroke-width="1" /> Tải xuống</div>
              <div><IconFlag stroke-width="1" /> Báo cáo</div>
            </div>
          </div>
          <div class="video-desc">
            <p class="desc-meta">
              {{ view }} lượt xem -
              {{ dayjs(video?.createdAt).fromNow() }}
            </p>
            {{ video?.desc }}
          </div>
        </el-col>
        <el-col :lg="8">
          <Comment></Comment>
        </el-col>
      </el-row>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import {
  IconShare3,
  IconDownload,
  IconFlag,
} from "@tabler/icons-vue";
import api from "@/api/axios";
import Comment from "./Comment.vue";
import Header from "@/components/Header/Header.vue";
import Navigation from "../../components/Navigation/Navigation.vue";
import { convertThumbnail } from "@/utils/videoThumbnail";

const route = useRoute();
let live = reactive({});
const view = ref(0)

watchEffect(async () => {
  let { data } = await api.get(`/api/v1/videos/${route.params.videoId}`);
  Object.assign(live, data);
  live.thumbnail = `${import.meta.env.VITE_API_URL}/static${live.thumbnail}`;
  // video.srcTranscode = `${import.meta.env.VITE_API_URL}/static${
  //   video.srcTranscode
  // }`;
  const { liveKey } = data.livestream;
  iframe.value = `<iframe width="600" id="player-live" height="600" scrolling="no" src="http://localhost:3000/views/player?liveKey=${liveKey}&thumbnail=${live.thumbnail}"></iframe>`;

  let data1 = await api.get(`/api/v1/live/view/${liveKey}`);
  view.value = data1.data
});

const iframe = ref(
  '<iframe scrolling="no" src="http://localhost:3000/views/player"></iframe>'
);

</script>

<style lang="scss" src="./LivestreamDetail.scss"></style>
