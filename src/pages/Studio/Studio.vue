<script setup>
import { watch, ref, watchEffect, reactive, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-vue";
import { ElMessage } from "element-plus";

import Header from "./StudioHeader.vue";
import Navigation from "./Navigation.vue";
import MobileNavigation from "./MobileNavigation.vue";

import api from "../../api/axios";
import { useBreakpoints } from "@/composables/useBreakpoints";

const { width } = useBreakpoints();

const route = useRoute();
const router = useRouter();

const categories = ref([]);
const getCategories = async () => {
  try {
    const categoriesRes = await api.get("api/v1/categories");
    categories.value = categoriesRes.data.categories;
  } catch (error) {
    console.log(error);
  }
};
onBeforeMount(async () => {
  await getCategories();
});

const isOpenUpload = ref(!!route.query.upload);
// const isOpenUpload = ref(true);
watch(
  () => route.query,
  () => {
    isOpenUpload.value = !!route.query.upload;
  }
);
watchEffect(() => {
  if (!isOpenUpload.value) {
    router.push(route.path);
  } else {
    router.push({ name: route.name, query: { upload: isOpenUpload.value } });
  }
});

const uploadFormRef = ref(null);
const rules = {
  title: [
    {
      required: true,
      message: "Bạn cần đặt tiêu đề cho video của mình",
      trigger: "change",
    },
  ],
  desc: [],
  categoryId: [
    {
      required: true,
      message: "Bạn cần chọn thể loại cho video của mình",
      trigger: "change",
    },
  ],
  disableComment: [],
  thumbnail: [
    {
      required: true,
      message: "Bạn cần chọn hình thu nhỏ cho video của mình",
      trigger: "change",
    },
  ],
  video: [
    {
      required: true,
      message: "Bạn cần một tệp video từ trong  máy",
      trigger: "change",
    },
  ],
};
const uploadForm = reactive({
  title: "",
  desc: "",
  categoryId: "",
  disableComment: false,
  thumbnail: [],
  video: [],
});

const removeFile = (key) => {
  uploadForm[key] = [];
};
const uploadVideo = async () => {
  if (!uploadFormRef.value) return;
  await uploadFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        await api.postForm("api/v1/videos", {
          ...uploadForm,
          thumbnail: uploadForm.thumbnail[0].raw,
          video: uploadForm.video[0].raw,
        });
        ElMessage({
          type: "success",
          message: "Đã tải lên video thành công.",
        });
        isOpenUpload.value = false;
        uploadFormRef.value.resetFields();
        setTimeout(() => {
          router.go(0);
        }, 0);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const thumbnailPreview = ref(null);
const videoFileName = ref("");
watch(
  () => [uploadForm.video, uploadForm.thumbnail],
  () => {
    if (uploadForm.thumbnail.length !== 0) {
      thumbnailPreview.value = URL.createObjectURL(uploadForm.thumbnail[0].raw);
    }
    if (uploadForm.video.length !== 0) {
      videoFileName.value = uploadForm.video[0].name.replace(
        /\.(ogm|wmv|mpg|webm|ogv|mov|asx|mpeg|mp4|m4v|avi)$/,
        ""
      );
    } else {
      // uploadForm.title = "";
    }
  }
);
</script>

<template>
  <Header />
  <div class="wrapper">
    <Navigation v-if="width > 992" />
    <MobileNavigation v-else-if="width > 576" />
    <div class="content">
      <router-view></router-view>
    </div>
  </div>

  <el-dialog
    v-model="isOpenUpload"
    title="Tải video lên"
    width="900"
    align-center
  >
    <h3 style="margin-bottom: 20px">Chi Tiết</h3>

    <el-form
      class="create-form"
      ref="uploadFormRef"
      :rules="rules"
      :model="uploadForm"
      label-position="top"
    >
      <div class="left">
        <el-form-item prop="title" label="Tiêu đề (bắt buộc)">
          <el-input
            v-model="uploadForm.title"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 1, maxRows: 3 }"
            type="textarea"
            placeholder="Thêm tiêu đề để mô tả video của bạn"
          />
        </el-form-item>
        <el-form-item prop="desc" label="Mô tả">
          <el-input
            v-model="uploadForm.desc"
            maxlength="500"
            show-word-limit
            :autosize="{ minRows: 4 }"
            type="textarea"
            placeholder="Giới thiệu về video của bạn cho người xem"
          />
        </el-form-item>
        <el-form-item prop="categoryId" label="Thể loại">
          <el-select
            v-model="uploadForm.categoryId"
            placeholder="Chọn thể loại"
          >
            <el-option
              v-for="{ id, name } in categories"
              :key="id"
              :label="name"
              :value="id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="disableComment">
          <el-checkbox
            v-model="uploadForm.disableComment"
            label="Khóa bình luận"
            name="disableComment"
          />
        </el-form-item>
      </div>
      <div class="right">
        <el-form-item prop="thumbnail" label="Hình thu nhỏ">
          <div v-if="uploadForm.thumbnail.length == 0">
            <el-upload
              style="width: 250px; height: 150px"
              v-model:file-list="uploadForm.thumbnail"
              drag
              list-type="picture-card"
              :auto-upload="false"
              accept="image/*"
            >
              <IconPlus />
            </el-upload>
          </div>
          <div v-else class="file-preview thumbnail-preview">
            <img :src="thumbnailPreview" alt="" />
            <div class="file-preview-overlay">
              <IconTrash @click="removeFile('thumbnail')" />
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="video" label="Video">
          <div v-if="uploadForm.video.length === 0">
            <el-upload
              v-model:file-list="uploadForm.video"
              accept="video/*"
              :auto-upload="false"
              :limit="1"
            >
              <el-button>Chọn video từ máy</el-button>
            </el-upload>
          </div>
          <div v-else class="file-preview video-preview">
            <div>{{ videoFileName }}</div>
            <div class="file-preview-overlay">
              <IconX @click="removeFile('video')" />
            </div>
          </div>
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="isOpenUpload = false">Hủy</el-button>
      <el-button type="primary" @click="uploadVideo"> Lưu </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  $navigation-width: 200px;
  .content {
    flex: 1;
    overflow-y: scroll;
    height: calc(100vh - 70px);
    width: calc(100% - $navigation-width);
  }
}
</style>
<style lang="scss">
.create-form {
  display: flex;
  justify-content: space-between;
  .left {
    width: 65%;
    margin-right: 30px;
  }
  .right {
    flex: 1;
    > * {
      width: 100%;
    }
    overflow: hidden;
    .file-preview {
      position: relative;
      &.thumbnail-preview {
        width: 250px;
        height: 150px;
        img {
          width: 100%;
          object-fit: cover;
        }
      }
      &:hover .file-preview-overlay {
        display: flex;
      }
      .file-preview-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.3);
        display: none;
        justify-content: center;
        align-items: center;
        > * {
          cursor: pointer;
          color: #fff;
          padding: 8px;
        }
      }
      &.video-preview {
        div:first-child {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .file-preview-overlay {
          justify-content: end;
          > * {
            &:hover {
              color: #065fd4;
            }
          }
        }
      }
    }
  }
}
</style>
