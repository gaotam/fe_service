<template>
  <Header></Header>
  <div class="livestream">
    <el-row>
      <el-col :lg="18">
        <div class="preview-box">
          <div class="flex" style="justify-content: space-between; flex-wrap: wrap">
            <div class="live-preview">
              <div v-html="iframe" style="margin-right: 20px"></div>
              <div>
                <div>
                  <p class="title">Tiêu đề</p>
                  <p>{{ setting.title }}</p>
                </div>
                <div>
                  <p class="title">Danh mục</p>
                  <p>{{ setting.category?.label }}</p>
                </div>
                <div>
                  <p class="title">Quyền riêng tư</p>
                  <p>Công khai</p>
                </div>
              </div>
            </div>
            <div>
              <div class="btn-edit" @click="dialogFormVisible = true">
                CHỈNH SỬA
              </div>
              <div class="btn-edit btn-stop" v-if="statusLive" @click="dialogStopVisible = true">
                DỪNG PHÁT
              </div>
            </div>
          </div>
          <div class="live-status" v-if="!statusLive">
            Để phát trực tiếp, hãy gửi video của bạn đến YouTube bằng phần mềm
            phát trực tiếp
          </div>
          <div class="live-status" v-else>
            Buổi phát trực tiếp của bạn đang bắt đầu.
          </div>
        </div>

        <div class="live-config">
          <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="Cài đặt" name="setting">
              <div class="btn-group">
                <span>URL sự kiện trực tiếp</span> <br />
                <el-input v-model="rtmp_enpoint" class="w-50 m-2" size="large" placeholder="" style="width: 400px"
                  :prefix-icon="IconLockOpen" />
              </div>

              <div class="btn-group">
                <span>Mã sự kiện trực tiếp</span> <br />
                <el-input v-model="liveKey" class="w-50 m-2" size="large" placeholder="" style="width: 400px"
                  type="password" show-password :prefix-icon="IconLockOpen" />
              </div>

              <div class="btn-group">
                <span>Bật chế độ ghi hình</span> <br />
                <el-switch v-model="setting.isRecord" @click="handleUpdate" />
              </div>
            </el-tab-pane>
            <el-tab-pane label="Số liệu" name="analyst">Số liệu</el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :lg="6">
        <div class="chat-container">
          <div class="chat-header">
            <h4>Trò chuyện trực tiếp</h4>
          </div>
          <div class="chat-box">
            <div class="user-info" v-for="comment in comments">
              <div>
                <img
                  :src="convertThumbnail(comment.user.avatar) || '/src/assets/user.png'"
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
      </el-col>
    </el-row>

    <el-dialog v-model="dialogFormVisible" title="Chỉnh sửa chế độ cài đặt" width="1000">
      <template #header="{ close, titleId, titleClass }">
        <h2 :id="titleId" :class="titleClass">Chỉnh sửa chế độ cài đặt</h2>
      </template>
      <div class="live-form-ele">
        <label for="fname">Tiêu đề (bắt buộc):</label><br />
        <el-input v-model="setting.title" placeholder="Nhập tiêu đề" />
      </div>
      <div class="live-form-ele">
        <label for="fname">Mô tả:</label><br />
        <el-input v-model="setting.desc" :rows="3" type="textarea" placeholder="" />
      </div>
      <div>
        <label for="category">Thể loại</label><br />
        <el-select v-model="setting.category" class="m-2" placeholder="Chọn thể loại" style="width: 240px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item" />
        </el-select>
      </div>
      <div class="live-form-ele">
        <label for="fname">Ảnh thumbnail</label><br />
        <el-upload 
          class="avatar-uploader" 
          :action="action" 
          :show-file-list="false"
          name="thumbnail"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </div>
      <div class="live-form-ele">
        <label for="fname">Cho phép bình luận</label><br />
        <el-radio-group v-model="setting.disableComment">
          <el-radio :label="true">Bật</el-radio>
          <el-radio :label="false">Tắt</el-radio>
        </el-radio-group>
      </div>
      <div>
        <el-row class="mb-4">
          <el-button type="" @click="dialogFormVisible = false">Hủy</el-button>
          <el-button type="primary" @click="handleUpdate">Lưu</el-button>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog v-model="dialogStopVisible" title="Xác nhận" width="500">
      <span>Bạn có chắc chắn muốn dừng livestream này?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogStopVisible = false">Hủy</el-button>
          <el-button type="primary" @click="handleStopLive">
            Xác nhận
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" src="./Livestream.scss"></style>

<script setup>
import { reactive, ref, watchEffect, watch } from "vue";
import { useRoute } from "vue-router";
import { Plus } from '@element-plus/icons-vue'
import { router } from "@/router";
import { IconLockOpen, IconSend } from "@tabler/icons-vue";
import { ElNotification } from "element-plus";
import Header from "./Header.vue";
import api from "@/api/axios";
import { useSocketIO } from "@/compositions/socket";
import { convertThumbnail } from "@/utils/videoThumbnail";
const { socket } = useSocketIO();

socket.on("connect", () => {
  console.log("connect socket");
});

const route = useRoute();

const iframe = ref(
  '<iframe width="500" height="260" scrolling="no" src="http://localhost:3000/views/player"></iframe>'
);

const dialogFormVisible = ref(false);
const dialogStopVisible = ref(false);
const statusLive = ref(false);
const activeName = ref("setting");
const setting = reactive({
  title: "",
  desc: "",
  category: null,
  disableComment: false,
  showViews: false,
  isRecord: false,
});

let options = ref();
let liveKey = ref("");
const comment = ref("");
const comments = ref([]);
const imageUrl = ref('')

const action = ref('')
const rtmp_enpoint = import.meta.env.VITE_RTMP_ENPOINT;
const api_enpoint = import.meta.env.VITE_API_URL

watchEffect(async () => {
  const liveId = route.query?.live;

  action.value = `${api_enpoint}/api/v1/live/upload/${liveId}`

  let data = await api.get("/api/v1/categories");
  const categories = data.data.categories.map((c) => {
    return {
      value: c.id,
      label: c.name,
    };
  });

  options.value = categories;
  setting.category = categories[1];

  if (!liveId) {
    const form = new FormData();
    form.append("categoryId", categories[0].value);
    form.append("title", "Phát trực tiếp");
    form.append("desc", "");
    form.append("isRecord", false);
    form.append("disableComment", false);
    const live = await api.post("/api/v1/live", form);
    const { category, livestream, title, id, desc, disableComment, thumbnail } =
      live.data.data;
    liveKey.value = livestream.liveKey;
    setting.category = {
      value: category.id,
      label: category.name,
    };
    setting.title = title;
    setting.desc = desc;
    setting.disableComment = disableComment;
    initPlayer(livestream.liveKey, thumbnail);
    router.push({ name: "livestream", query: { live: id } });
  } else {
    let live = await api.get(`/api/v1/videos/${liveId}`);
    const { category, livestream, title, id, desc, disableComment, thumbnail } =
      live.data;
    setting.title = title;
    setting.category = {
      value: category.id,
      label: category.name,
    };
    setting.isRecord = livestream.isRecord;
    setting.desc = desc;
    setting.disableComment = disableComment;
    liveKey.value = livestream.liveKey;
    statusLive.value = livestream.status == "PROCESS";
    initPlayer(livestream.liveKey, thumbnail);
  }
});

watch(liveKey, (newData, oldData) => {
  const videoId = route.query?.live;

  if (newData != "") {
    socket.removeAllListeners();
    socket.on(`on-publish-${newData}`, (data) => {
      statusLive.value = true;
    });

    socket.on(`on-publish-done-${newData}`, (data) => {
      statusLive.value = false;
    });

    socket.on(`comment-${videoId}`, (data) => {
      loadComment().then(() => { });
    });
  }
});

const initPlayer = (liveKey, thumbnail) => {
  iframe.value = `<iframe width="600" id="player-live" height="340" scrolling="no" src="http://localhost:3000/views/player?liveKey=${liveKey}&thumbnail=${thumbnail}"></iframe>`;
};

const handleUpdate = async () => {
  const liveId = route.query?.live;
  const form = new FormData();
  form.append("categoryId", setting.category.value);
  form.append("title", setting.title);
  form.append("desc", setting.desc);
  form.append("isRecord", setting.isRecord);
  form.append("disableComment", setting.disableComment);
  try {
    await api.put(`/api/v1/live/${liveId}`, form);
    ElNotification({
      title: "Thồng báo",
      message: "Cập nhật thành công",
      type: "success",
    });
    dialogFormVisible.value = false;
  } catch (error) {
    ElNotification({
      title: "Error",
      message: error.msg,
      type: "error",
    });
  }
};

const loadComment = async () => {
  const liveId = route.query?.live;
  let { data } = await api.get(
    `/api/v1/comments/?videoId=${liveId}&limit=1000`
  );
  comments.value = data.comments;
};

watchEffect(async () => {
  // const liveId = route.query?.live
  // let { data } = await api.get(`/api/v1/comments?videoId=${liveId}`)
  // comments.value = data.comments.reverse()
  await loadComment();
});

const handleStopLive = async () => {
  const liveId = route.query?.live;
  try {
    await api._delete(`/api/v1/live/${liveId}`);
    router.push({ name: "home" });
  } catch (error) {
    ElNotification({
      title: "Error",
      message: error.msg,
      type: "error",
    });
  } finally {
    dialogStopVisible.value = false;
  }
};

const handleComment = async () => {
  const videoId = route.query?.live;
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

const handleAvatarSuccess = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
}
</script>


<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>