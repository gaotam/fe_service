<template>
  <div class="comment-live">
    <div class="chat-container">
      <div class="chat-header">
        <h4>Trò chuyện trực tiếp</h4>
      </div>
      <div class="chat-box">
        <div class="user-info" v-for="comment in comments">
          <div>
            <img
              :src="convertThumbnail(user.avatar) || '/src/assets/user.png'"
              alt="" />
            <span>{{ comment.user.fullname }}</span>
          </div>
          <p>{{ comment.content }}</p>
        </div>
      </div>
      <div class="chat-owner">
        <div class="flex input-chat">
          <el-input @keyup.enter="handleComment" v-model="comment" placeholder="Trò chuyện" />
          <el-button @click="handleComment">
            <IconSend />
          </el-button>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="scss" src="./Comment.scss"></style>

<script setup>
import { reactive, ref, watchEffect, watch } from "vue";
import { useRoute } from "vue-router";
import { IconLockOpen, IconSend } from "@tabler/icons-vue";
import api from "@/api/axios";
import { useSocketIO } from "@/compositions/socket";
import { convertThumbnail } from "@/utils/videoThumbnail";
const { socket } = useSocketIO();
const route = useRoute();

socket.on("connect", () => {
  console.log("connect socket");
});

watchEffect(()=> {
  const liveId = route.params?.videoId;
  if (liveId != "") {
    socket.removeAllListeners();
    socket.on(`comment-${liveId}`, (data) => {
      loadComment().then(() => {});
    });
  }
});

const comments = ref([]);
const comment = ref("");
const user = ref()


const loadComment = async () => {
  const liveId = route.params?.videoId;
  let { data } = await api.get(
    `/api/v1/comments/?videoId=${liveId}&limit=1000`
  );
  comments.value = data.comments;
};

watchEffect(async () => {
  await loadComment();
});

const handleComment = async () => {
  const videoId = route.params?.videoId;
  const body = {
    videoId,
    content: comment.value,
  };

  try {
    let data = await api.post(`/api/v1/comments`, body);
    await loadComment();
    comment.value = "";
  } catch (err) {
    alert(err);
  }
};

watchEffect(async() => {
  const userRes = await api.get("api/v1/users/profile");
  user.value = userRes.data;
})
</script>