<script setup>
import { watch, onBeforeMount, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IconAdjustmentsHorizontal, IconX } from "@tabler/icons-vue";

import VideoResultPreview from "@/pages/Results/VideoResultPreview.vue";
import api from "../../api/axios";

const router = useRouter();
const route = useRoute();

const isFilterOpen = ref(false);
const curPage = ref(1);
const total = ref(0);
const videos = ref([]);
const filter = reactive({
  createdAt: route.query.created_at || "",
  duration: route.query.duration || "",
  sortBy: route.query.sort_by || "",
});
const filterConstant = {
  createdAt: [
    { label: "Một giờ trước", createdAt: "h" },
    { label: "Hôm nay", createdAt: "today" },
    { label: "Tuần này", createdAt: "w" },
    { label: "Tháng này", createdAt: "m" },
    { label: "Năm này", createdAt: "y" },
  ],
  duration: [
    { label: "Dưới 4 phút", duration: "1" },
    { label: "4 - 20 phút", duration: "2" },
    { label: "Trên 20 phút", duration: "3" },
  ],
  sortBy: [
    {
      label: "Mức độ liên quan",
      sortBy: "",
    },
    {
      label: "Ngày tải lên",
      sortBy: "createdAt",
    },
    {
      label: "Lượt xem",
      sortBy: "views",
    },
  ],
};

const loadVideos = async () => {
  if (videos.value.length == total.value && videos.value.length != 0) return;
  const searchQuery = route.query.s;
  if (!searchQuery) return;
  try {
    const res = await api.getWithParams("api/v1/videos", {
      q: searchQuery,
      limit: 10,
      page: curPage.value,
      ...filter,
    });
    videos.value = res.data.videos;
    total.value = res.data.total;
    curPage.value++;
  } catch (error) {
    console.log(error);
  }
};
onBeforeMount(loadVideos);
watch(
  () => route.query,
  async () => {
    videos.value = [];
    curPage.value = 1;
    total.value = 0;
    await loadVideos();
  }
);
const filterHandler = (_filter = filter) => {
  Object.assign(filter, _filter);
  isFilterOpen.value = false;
  router.push({
    name: "results",
    query: {
      s: route.query.s,
      created_at: filter.createdAt,
      duration: filter.duration,
      sort_by: filter.sortBy,
    },
  });
};
</script>

<template>
  <div class="results">
    <div class="head">
      <button @click="isFilterOpen = true">
        <span>Bộ lọc</span>
        <IconAdjustmentsHorizontal />
      </button>
    </div>
    <div
      v-if="videos.length > 0"
      class="video-results-preview"
      v-infinite-scroll="loadVideos"
    >
      <VideoResultPreview v-for="(v, i) in videos" :key="i" :video="v" />
    </div>
    <div v-else style="text-align: center">
      <el-empty>
        <template #description>
          <h4>Không tìm thấy kết quả</h4>
          <p style="margin-top: 10px">
            Hãy thử các từ khóa khác nhau hoặc xóa bộ lọc tìm kiếm
          </p>
        </template>
      </el-empty>
    </div>
  </div>
  <el-dialog
    v-model="isFilterOpen"
    title="Bộ lọc tìm kiếm"
    width="600"
    align-center
  >
    <div class="model-row">
      <div class="col">
        <p class="head">NGÀY TẢI LÊN</p>
        <ul>
          <li
            v-for="{ createdAt, label } in filterConstant.createdAt"
            :key="createdAt"
            :class="{ selected: createdAt === filter.createdAt }"
            @click="filterHandler({ createdAt })"
          >
            <p>{{ label }}</p>
            <IconX
              :size="16"
              class="cancel-filter"
              v-if="createdAt === filter.createdAt"
              @click.stop="filterHandler({ createdAt: '' })"
            />
          </li>
        </ul>
      </div>
      <div class="col">
        <p class="head">THỜI LƯỢNG</p>
        <ul>
          <li
            v-for="{ duration, label } in filterConstant.duration"
            :key="duration"
            :class="{ selected: duration === filter.duration }"
            @click="filterHandler({ duration })"
          >
            <p>{{ label }}</p>
            <IconX
              class="cancel-filter"
              v-if="duration === filter.duration"
              :size="16"
              @click.stop="filterHandler({ duration: '' })"
            />
          </li>
        </ul>
      </div>
      <div class="col">
        <p class="head">SẮP XẾP THEO</p>
        <ul>
          <li
            v-for="{ sortBy, label } in filterConstant.sortBy"
            :key="sortBy"
            :class="{ 'sort-by-selected': sortBy === filter.sortBy }"
            @click="filterHandler({ sortBy })"
          >
            <p>{{ label }}</p>
          </li>
        </ul>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped src="./Results.scss"></style>
