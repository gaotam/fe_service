<template>
  <div class="comment-detail">
    <div v-if="!props.disable" class="comment-box">
      <img src="@/assets/hoang.jpg" alt="" />
      <div class="comment-input">
        <el-input
          v-model="comment"
          :autosize="{ minRows: 2, maxRows: 100 }"
          type="textarea"
          placeholder="Viết bình luận"
        />
        <div class="comment-btn">
          <el-button @click="comment = ''">Hủy</el-button>
          <el-button type="primary" @click="createComment">Bình luận</el-button>
        </div>
      </div>
    </div>
    <div v-else class="comment-disable">
      <h3>
        Chủ kênh đã tắt tính năng bình luận
      </h3>
    </div>

    <div class="comment-box" v-for="comment in comments.data" :key="comment.id">
      <img src="@/assets/hoang.jpg" alt="" />
      <div class="comment-info">
        <div>
          <span class="comment-user">{{ comment.user.fullname }}</span> <span class="comment-time">{{ dayjs(comment?.updatedAt).fromNow() }}</span> 
          <p class="comment-content">{{ comment.content }}</p>
        </div>

        <el-popover :visible="comment.visible" placement="top" :width="230" class="comment-method">
          <el-button type="warning" @click="() => editComment(comment)"><IconEdit size="18"/> Chỉnh sửa</el-button>
          <el-button type="danger" @click="() => deleteComment(comment)"><IconTrash size="18" /> Xóa</el-button>
          <template #reference>
            <el-button @click="comment.visible = true"><IconDotsVertical stroke-width="1" size="20"/></el-button>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./Comment.scss"></style>

<script setup>
import { reactive, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-vue";
import dayjs from "dayjs";
import api from "@/api/axios";
import { ElMessage, ElMessageBox } from 'element-plus'
const props = defineProps(['disable'])

const comment = ref("")
const comments = reactive({
  data: [],
  limit: 10,
  page: 1
})  
const route = useRoute();

const loadComment = async() => {
  let { data } = await api.get(`/api/v1/comments/?videoId=${route.params.videoId}`);
  
  comments.data = data.comments.map(c => {
    return {
      ...c,
      visible: false
    }
  });
  comments.limit = data.limit;
  comments.page = data.page;
}

watchEffect(async () => {
  await loadComment();

  // video.thumbnail = `${import.meta.env.VITE_API_URL}/static${video.thumbnail}`;
});

const createComment = async() => {
  const body = {
    videoId: route.params.videoId,
    content: comment.value
  }

  try {
    let data = await api.post(`/api/v1/comments`, body);
    await loadComment();
    comment.value = ""
  } catch (err) {
    alert(err)
  }
}

const deleteComment = (comment) => {
  comment.visible = false;
  ElMessageBox.confirm(
    'Bạn muốn xóa bình luận này?',
    'Warning',
    {
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      type: 'warning',
    }
  )
  .then(async() => {
    try {
      let data = await api._delete(`/api/v1/comments/${comment.id}`);
      await loadComment();
      comment.value = ""
    } catch (err) {
      alert(err)
    }
  })
  .catch(() => {
    
  })
}

const editComment = (comment) => {
  comment.visible = false;
  ElMessageBox.prompt('Vui lòng nhập bình luận mới', 'Chỉnh sửa bình luận', {
    confirmButtonText: 'Lưu',
    cancelButtonText: 'Hủy',
    inputValue: comment.content
  })
  .then(async({ value }) => {
    try {
      const body = {
        content: value
      }

      await api.put(`/api/v1/comments/${comment.id}`, body);
      await loadComment();
      comment.value = ""
    } catch (err) {
      alert(err)
    }
  })
  .catch(() => {
    
  })
}
</script>