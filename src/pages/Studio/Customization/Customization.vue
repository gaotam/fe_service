<script setup>
import { onBeforeMount, reactive, ref } from "vue";
import { IconX, IconCamera } from "@tabler/icons-vue";
import { ElMessage } from "element-plus";

import api from "../../../api/axios";
import { convertThumbnail } from "../../../utils/videoThumbnail";
import { useRouter } from "vue-router";

const router = useRouter();

const activeName = ref("informations");

const userFormRef = ref(null);
const userForm = reactive({
  fullname: "",
  email: "",
  gender: "MALE",
  avatar: [],
});
const userRules = {
  fullname: {
    required: true,
    message: "Vui lòng nhập tên để tiếp tục",
    trigger: "change",
  },
  email: {
    required: true,
    message: "Vui lòng nhập email hợp lệ",
    trigger: "change",
  },
};
const user = reactive({});

const previewAvtUrl = ref("../src/assets/user.png");
const removeAvtUpload = () => {
  userForm.avatar = [];
  previewAvtUrl.value = "../src/assets/user.png";
};
const previewAvtHandler = (file, fileList) => {
  previewAvtUrl.value =
    URL.createObjectURL(file.raw) || "../src/assets/user.png";
};
const updateUserHandler = async () => {
  if (!userFormRef.value) return;
  await userFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        if (userForm.avatar.length) {
          userForm.avatar = userForm.avatar[0].raw;
        } else delete userForm.avatar;
        await api.putForm("api/v1/users", userForm);
        ElMessage({
          type: "success",
          message: "Đã cập nhật thông tin cơ bản thành công.",
        });
        await loadComponent();
      } catch (error) {
        console.log(error);
      }
    }
  });
};

const loadComponent = async () => {
  try {
    const res = await api.get("api/v1/users/profile");
    Object.assign(user, res.data);
    userForm.fullname = user.fullname;
    userForm.email = user.email;
    userForm.gender = user.gender;
    if (user.avatar) previewAvtUrl.value = convertThumbnail(user.avatar);
  } catch (error) {
    console.log(error);
  }
};
onBeforeMount(loadComponent);

const passwordFormRef = ref(null);
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const passwordRules = {
  oldPassword: [
    {
      required: true,
      message: "Vui lòng nhập mật khẩu cũ để tiếp tục!",
      trigger: "change",
    },
  ],
  newPassword: [
    {
      required: true,
      message: "Vui lòng nhập mật khẩu mới để tiếp tục!",
      trigger: "change",
    },
  ],
  confirmPassword: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("Vui lòng nhập lại mật khẩu mới để tiếp tục!"));
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          callback(new Error("Mật khẩu mới nhập lại không chính xác"));
        }
        callback();
      },
      trigger: "change",
    },
  ],
};
const changePasswordHandler = async () => {
  if (!passwordFormRef.value) return;
  await passwordFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        await api.put("api/v1/users/change-password", {
          oldPassword: passwordForm.oldPassword,
          password: passwordForm.newPassword,
        });
        ElMessage({
          type: "success",
          message: "Đã cập nhật mật khẩu thành công.",
        });
        passwordFormRef.value.resetFields();
      } catch (error) {
        console.log(error);
        ElMessage({
          type: "error",
          message: "Mật khẩu cũ không chính xác.",
        });
      }
    }
  });
};

const saveForm = async () => {
  if (activeName.value === "informations") {
    await updateUserHandler();
  }
  if (activeName.value === "password") {
    await changePasswordHandler();
  }
};
</script>

<template>
  <div class="customization">
    <div class="customization-header">
      <h2>Tùy chỉnh kênh</h2>
      <el-button type="primary" @click="saveForm">Lưu</el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="Thông tin cơ bản" name="informations">
        <el-form
          class="profile-form"
          ref="userFormRef"
          :rules="userRules"
          :model="userForm"
          label-position="top"
        >
          <el-form-item prop="avatar">
            <div class="item avatar-form-item">
              <div>
                <div class="avatar-img">
                  <img :src="previewAvtUrl" alt="" />
                </div>
                <el-upload
                  v-if="userForm?.avatar.length === 0"
                  v-model:file-list="userForm.avatar"
                  accept="image/*"
                  :auto-upload="false"
                  :limit="1"
                  class="open-avatar-changer"
                  :on-change="previewAvtHandler"
                >
                  <icon-camera :size="25" />
                </el-upload>
                <div
                  v-else
                  @click="removeAvtUpload"
                  class="remove-avatar-upload"
                >
                  <icon-x :size="28" />
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="fullname">
            <div class="item">
              <h4>Họ và Tên</h4>
              <span>Chọn tên kênh thể hiện cá tính và nội dung của bạn.</span>
              <el-input v-model="userForm.fullname" />
            </div>
          </el-form-item>
          <el-form-item prop="email">
            <div class="item">
              <h4>Thông tin liên hệ</h4>
              <span>
                Cho mọi người biết cách liên hệ với bạn khi cần hỏi về doanh
                nghiệp của bạn. Địa chỉ email mà bạn nhập có thể xuất hiện trong
                phần "Giới thiệu" của kênh và người xem có thể thấy địa chỉ này.
              </span>
              <el-input v-model="userForm.email" />
            </div>
          </el-form-item>
          <el-form-item prop="gender">
            <el-radio-group v-model="userForm.gender">
              <el-radio label="MALE" size="large">Nam</el-radio>
              <el-radio label="FEMALE" size="large">Nữ</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Bảo mật" name="password">
        <el-form
          class="profile-form"
          ref="passwordFormRef"
          :rules="passwordRules"
          :model="passwordForm"
          label-position="top"
        >
          <el-form-item prop="oldPassword">
            <div class="item">
              <h4>Mật khẩu cũ</h4>
              <el-input
                type="password"
                show-password
                v-model="passwordForm.oldPassword"
              />
            </div>
          </el-form-item>
          <el-form-item prop="newPassword">
            <div class="item">
              <h4>Mật khẩu mới</h4>
              <el-input
                type="password"
                show-password
                v-model="passwordForm.newPassword"
              />
            </div>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <div class="item">
              <h4>Xác nhận lại mật khẩu</h4>
              <el-input
                type="password"
                show-password
                v-model="passwordForm.confirmPassword"
              />
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" src="./Customization.scss"></style>
