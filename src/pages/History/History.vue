<script setup>
import { onBeforeMount, watch, ref } from "vue";
import {
  IconSearch,
  IconTrash,
  IconPlayerPause,
  IconPlayerPlayFilled,
} from "@tabler/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

import VideoHistoryPreview from "./VideoHistoryPreview.vue";
import { useRouter } from "vue-router";

import api from "@/api/axios";

const router = useRouter();

const isPauseSaveHistory = ref(true);
const keyword = ref(router.currentRoute.value.query.q || "");
const curPage = ref(1);
const total = ref(0);
const videos = ref([]);

const loadVideos = async () => {
  if (videos.value.length == total.value && videos.value.length != 0) return;
  try {
    const res = await api.get("api/v1/history", {
      q: keyword.value,
      page: curPage.value,
      rowsPerPage: 10,
    });
    videos.value = res.data.history;
    total.value = res.data.total;
    curPage.value++;
  } catch (error) {
    console.log(error);
  }
};
onBeforeMount(loadVideos);
const searchHistoryVideos = async () => {
  router.push({ name: "history", query: { q: keyword.value } });
  videos.value = [];
  curPage.value = 1;
  total.value = 0;
  await loadVideos();
};
const deleteHistoryVideos = async () => {
  try {
    await ElMessageBox.confirm(
      "Nhật ký xem của bạn trên HoangTuBe sẽ bị xóa khỏi tất cả các ứng dụng HoangTuBe trên mọi thiết bị.",
      "Xoá nhật ký xem?",
      {
        confirmButtonText: "Xóa nhật ký xem",
        cancelButtonText: "Hủy",
      }
    );
    videos.value = [];
    await api._delete("api/v1/history");
    ElMessage({
      type: "success",
      message: "Đã xóa nhật ký xem.",
    });
  } catch (error) {
    console.log(error);
  }
};
const pauseSaveHistory = async () => {
  try {
    if (isPauseSaveHistory.value) {
      await ElMessageBox.confirm(
        "Việc tạm dừng nhật ký xem trên HoangTuBe có thể khiến bạn khó tìm thấy những video đã xem hơn.",
        "Tạm dừng lưu nhật ký xem?",
        {
          confirmButtonText: "Tạm dừng",
          cancelButtonText: "Hủy",
        }
      );
      isPauseSaveHistory.value = false;
      ElMessage({
        type: "success",
        message: "Đã tạm dừng lưu nhật ký xem.",
      });
    } else {
      await ElMessageBox.confirm(
        "Nhật ký xem cá nhân giúp bạn dễ dàng tìm thấy các video đã xem gần đây trên HoangTuBe.",
        "Bật nhật ký xem?",
        {
          confirmButtonText: "Bật",
          cancelButtonText: "Hủy",
        }
      );
      isPauseSaveHistory.value = true;
      ElMessage({
        type: "success",
        message: "Đã bật lưu nhật ký xem.",
      });
    }
  } catch (error) {}
};

watch(keyword, async (newKeyword, oldKeyword) => {
  if (
    oldKeyword !== "" &&
    newKeyword === "" &&
    router.currentRoute.value.query.q
  ) {
    keyword.value = "";
    await searchHistoryVideos();
  }
});
</script>

<template>
  <div class="history">
    <h1>Nhật ký xem</h1>
    <div class="flex">
      <div class="left">
        <div
          v-if="videos.length > 0"
          v-infinite-scroll="loadVideos"
          infinite-scroll-distance="5"
        >
          <VideoHistoryPreview v-for="(v, i) in videos" :key="i" :video="v" />
        </div>
        <div v-else style="text-align: center">
          Danh sách này không có video nào.
        </div>
      </div>
      <div class="right">
        <form @submit.prevent="searchHistoryVideos" class="search">
          <button>
            <IconSearch :size="18" />
          </button>
          <input
            v-model="keyword"
            type="text"
            placeholder="Tìm kiếm trong danh sách video..."
          />
        </form>
        <div @click="deleteHistoryVideos" class="action">
          <IconTrash /><span> Xóa tất cả nhật ký xem</span>
        </div>
        <div v-if="isPauseSaveHistory" @click="pauseSaveHistory" class="action">
          <IconPlayerPause /><span>Tạm dừng lưu nhật ký</span>
        </div>
        <div v-else @click="pauseSaveHistory" class="action">
          <IconPlayerPlayFilled /><span>Bật lưu nhật ký</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./History.scss"></style>
