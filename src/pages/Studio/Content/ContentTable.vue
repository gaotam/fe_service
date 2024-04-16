<script setup>
import dayjs from "dayjs";
import { ref, reactive, watch, defineProps, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconPlus,
  IconExternalLink
} from "@tabler/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

import api from "../../../api/axios";
import { convertThumbnail } from "@/utils/videoThumbnail";
import { useCategoryStore } from "../../../stores/category";

const props = defineProps({
  videos: {
    type: Array,
    required: true,
  },
});

const router = useRouter();
const categoryStore = useCategoryStore();

// const categories = ref(categoryStore.categories);
// const getCategories = async () => {
//   try {
//     const categoriesRes = await api.get("api/v1/categories");
//     categories.value = categoriesRes.data;
//   } catch (error) {
//     console.log(error);
//   }
// };
onBeforeMount(async () => {
  await categoryStore.callAPICategories();
});

const idVideoSelected = ref("");
const isOpenUpdateModal = ref(false);
const updateFormRef = ref(null);
const updateForm = reactive({
  title: "",
  desc: "",
  categoryId: "",
  thumbnail: [],
});
const rules = {
  title: [
    {
      required: true,
      message: "Bạn cần đặt tiêu đề cho video của mình",
      trigger: "blur",
    },
  ],
};

const thumbnailPreview = ref(null);
watch(
  () => updateForm.thumbnail,
  () => {
    if (updateForm.thumbnail.length !== 0) {
      thumbnailPreview.value = URL.createObjectURL(updateForm.thumbnail[0].raw);
    }
  }
);

const deleteVideoHandler = async (id) => {
  try {
    await ElMessageBox.confirm(
      "Tôi hiểu rằng video sẽ bị xóa vĩnh viễn và không thể khôi phục",
      "Xóa vĩnh viễn video này?",
      {
        confirmButtonText: "XÓA VĨNH VIỄN",
        cancelButtonText: "HỦY",
      }
    );
    await api._delete("api/v1/videos/" + id);
    ElMessage({
      type: "success",
      message: "Đã xóa vĩnh viễn một vieo.",
    });
    router.go(0);
  } catch (error) {
    console.log(error);
  }
};
const openUpdateModel = ({ id, title, desc, thumbnail, category }) => {
  isOpenUpdateModal.value = true;
  Object.assign(updateForm, { title, desc, categoryId: category.id });
  thumbnailPreview.value = convertThumbnail(thumbnail);
  idVideoSelected.value = id;
};
const updateVideoHandler = async () => {
  try {
    await api.putForm("api/v1/videos/" + idVideoSelected.value, {
      ...updateForm,
      thumbnail: updateForm.thumbnail[0]?.raw,
    });
    isOpenUpdateModal.value = false;
    ElMessage({
      type: "success",
      message: "Chỉnh sửa thành công.",
    });
    router.go(0);
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <el-table :data="videos" style="width: 100%">
    <el-table-column prop="summary" label="Video" width="600">
      <template #default="{ row }">
        <router-link
          v-if="!row.livestream?.status || row.livestream?.status == 'SUCCESS'"
          class="summary"
          :to="{ name: 'video-detail', params: { videoId: row.id } }"
        >
          <div class="thumbnail">
            <img :src="convertThumbnail(row.thumbnail)" alt="" />
          </div>
          <div>
            <p class="title">{{ row.title }}</p>
            <p class="desc">{{ row.desc }}</p>
          </div>
        </router-link>
        <router-link 
          v-else
          class="summary"
          :to="{ name: 'livestream-detail', params: { videoId: row.id } }">
          <div class="thumbnail">
            <img :src="convertThumbnail(row.thumbnail)" alt="" />
          </div>
          <div>
            <p class="title">{{ row.title }}</p>
            <p class="desc">{{ row.desc }}</p>
          </div>
        </router-link>
      </template>
    </el-table-column>
    <el-table-column prop="createdAt" label="Ngày">
      <template #default="{ row }">
        {{ dayjs(row.createdAt).format("DD [thg] M, YYYY") }}
      </template>
    </el-table-column>
    <el-table-column prop="views" label="Số lượt xem" />
    <el-table-column prop="status" label="Trạng thái" />
    <!-- <el-table-column prop="like" label="Số lượt thích" /> -->
    <el-table-column prop="options" label="Tùy chọn">
      <template #default="{ row }">
        <el-popover
          :width="250"
          trigger="click"
          popper-class="popper"
          placement="bottom-end"
          :hide-after="0"
        > 
          <router-link v-if="row.isLive && ['IDLE', 'PROCESS'].includes(row.livestream.status)" :to="{ name: 'livestream', query: { live: row.id } }">
            <div class="popper-link" >
              <IconExternalLink stroke-width="1" />
              <span>Truy cập trang quản lý</span>
            </div>
          </router-link>
          
          <div class="popper-link" @click="openUpdateModel(row)">
            <IconEdit stroke-width="1" />
            <span>Chỉnh sửa tiêu đề và mô tả</span>
          </div>

          <div class="popper-link" @click="deleteVideoHandler(row.id)">
            <IconTrash stroke-width="1" />
            <span>Xóa vĩnh viễn</span>
          </div>
          <template #reference>
            <div class="options">
              <IconDotsVertical :stroke-width="1" />
            </div>
          </template>
        </el-popover>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    v-model="isOpenUpdateModal"
    title="Chỉnh sửa tiêu đề và thông tin mô tả video"
    width="800"
    align-center
  >
    <el-form
      class="update-form"
      ref="updateFormRef"
      :rules="rules"
      :model="updateForm"
      label-position="top"
    >
      <div class="left">
        <el-form-item prop="title" label="Tiêu đề (bắt buộc)" required>
          <el-input
            v-model="updateForm.title"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 1, maxRows: 2 }"
            type="textarea"
            placeholder="Thêm tiêu đề"
          />
        </el-form-item>
        <el-form-item prop="desc" label="Mô tả">
          <el-input
            v-model="updateForm.desc"
            maxlength="500"
            show-word-limit
            :autosize="{ minRows: 4 }"
            type="textarea"
            placeholder="Thêm nội dung mô tả"
          />
        </el-form-item>
        <el-form-item prop="categoryId" label="Thể loại">
          <el-select
            v-model="updateForm.categoryId"
            placeholder="Chọn thể loại"
          >
            <el-option
              v-for="{ id, name } in categoryStore.categories"
              :key="id"
              :label="name"
              :value="id"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="right">
        <el-form-item prop="thumbnail" label="Hình thu nhỏ">
          <div v-if="!thumbnailPreview">
            <el-upload
              style="width: 250px; height: 150px"
              v-model:file-list="updateForm.thumbnail"
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
              <IconTrash
                @click="
                  () => {
                    updateForm.thumbnail = [];
                    thumbnailPreview = null;
                  }
                "
              />
            </div>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="isOpenUpdateModal = false">Hủy</el-button>
        <el-button type="primary" @click="updateVideoHandler"> Lưu </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" src="./Content.scss"></style>
