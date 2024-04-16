<script setup>
import { IconSearch } from "@tabler/icons-vue";
import { ref, onBeforeMount } from "vue";

import api from "../../../api/axios";
import CommentLine from "./CommentLine.vue";

const keyword = ref("");
const comments = ref([]);
onBeforeMount(async () => {
  try {
    const res = await api.get("/api/v1/comments/me");
    comments.value = res.data.comments;
    console.log(comments.value);
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="studio-comment">
    <h2>Bình luận trên kênh</h2>
    <form class="search" @submit.prevent="filterByKeyword">
      <IconSearch :stroke-width="1" />
      <input
        v-model="keyword"
        type="text"
        name="search"
        placeholder="Tìm kiếm"
      />
    </form>
    <div class="list-comments">
      <CommentLine
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.studio-comment {
  h2 {
    margin: 20px 30px;
  }
  .search {
    padding: 0px 30px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    :first-child {
      cursor: pointer;
    }
    input[name="search"] {
      padding: 15px 10px;
      border: 0;
      outline: none;
      display: block;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
