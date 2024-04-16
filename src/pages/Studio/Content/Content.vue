<script setup>
import { reactive, ref, watch, watchEffect } from "vue";
import { IconSearch } from "@tabler/icons-vue";

import ContentTable from "./ContentTable.vue";
import api from "../../../api/axios";

const tabs = [
  {
    label: "Video",
    tab: "videos",
  },
  {
    label: "Trực tiếp",
    tab: "live",
  },
];

const statusMap = {
  "IDLE": "Đang chờ tín hiệu",
  "PROCESS": "Đang diễn ra",
  "SUCCESS": "Kết thúc"
}

const activeName = ref("videos");

const videos = ref([]);

const keyword = ref("");
const isSearched = ref(false);
const pageMeta = reactive({
  page: 1,
  limit: 10,
  total: 0,
});

const loadVideos = async (q = "") => {
  try {
    const res = await api.getWithParams(`api/v1/${activeName.value}/me?sortBy=createdAt`, {
      page: pageMeta.page,
      limit: pageMeta.limit,
      q,
    });

    videos.value = res.data.videos.map(v => {
      if(activeName.value == "videos"){
        return {
          ...v,
          status: v.srcTranscode ? "Hoàn thành" : "Đang xử lý"
        }
      } else {
        return {
          ...v,
          status: statusMap[v.livestream.status]
        }
      }
    });
    pageMeta.total = res.data.total;
  } catch (error) {
    console.log(error);
  }
};
watchEffect(async () => {
  await loadVideos();
});
const filterByKeyword = async () => {
  await loadVideos(keyword.value);
  isSearched.value = true;
};
watch(keyword, async (newKeyword, oldKeyword) => {
  if (isSearched.value && oldKeyword !== "" && newKeyword === "") {
    await loadVideos();
    isSearched.value = false;
  }
});
</script>

<template>
  <div class="studio-content">
    <h2>Nội dung của kênh</h2>
    <el-tabs v-model="activeName">
      <form class="search" @submit.prevent="filterByKeyword">
        <IconSearch :stroke-width="1" />
        <input
          v-model="keyword"
          type="text"
          name="search"
          placeholder="Tìm kiếm"
        />
      </form>

      <el-tab-pane
        v-for="{ label, tab } in tabs"
        :key="tab"
        :label="label"
        :name="tab"
      >
        <ContentTable :videos="videos" />

        <div class="pagination">
          <el-pagination
            v-model:current-page="pageMeta.page"
            v-model:page-size="pageMeta.limit"
            :pager-count="5"
            layout="prev, pager, next"
            :total="pageMeta.total"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" src="./Content.scss"></style>
