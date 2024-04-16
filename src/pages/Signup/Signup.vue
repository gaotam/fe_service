<template>
  <Header />
  <div class="signup">
    <el-row :gutter="0" style="width: 100%;">
      <el-col :xs="0" :sm="2" :md="3" :lg="7" :xl="7">

      </el-col>

      <el-col :xs="24" :sm="20" :md="18" :lg="10" :xl="10">
        <div class="flex switch-auth">
          <router-link to="/login">Đăng nhập</router-link>
          <router-link activeClass="active" to="/signup">Đăng ký</router-link>
        </div>

        <form action="" class="form-login" @submit.prevent="onSubmit">
          <div class="mt-25">
            <label for="">Họ và tên<span class="required">*</span></label>
            <input type="text" v-model="user.fullname" placeholder="Nhập tên">
          </div>

          <div class="mt-25">
            <label for="">Email<span class="required">*</span></label>
            <input type="text" v-model="user.email" placeholder="Nhập email">
          </div>

          <div class="mt-25 gender">
            <label for="">Giới tính<span class="required">*</span></label>
            <el-radio-group v-model="user.gender" class="ml-4">
              <el-radio label="MALE" size="large">Nam</el-radio>
              <el-radio label="FEMALE" size="large">Nữ</el-radio>
            </el-radio-group>
          </div>

          <div class="mt-25 password">
            <label for="">Mật khẩu <span class="required">*</span></label>
            <input v-if="!showPassword" type="password" placeholder="Nhập mật khẩu" v-model="user.password">
            <input v-else type="text" placeholder="Nhập mật khẩu" v-model="user.password">

            <el-icon v-if="!showPassword" class="show-password" @click="togglePassword">
              <View />
            </el-icon>
            <el-icon v-else class="show-password" @click="togglePassword">
              <Hide />
            </el-icon>
          </div>

          <div class="mt-25 password">
            <label for="">Nhập lại mật khẩu<span class="required">*</span></label>
            <input v-if="!showPassword" type="password" placeholder="Nhập lại mật khẩu" v-model="user.re_password">
            <input v-else type="text" placeholder="Nhập lại mật khẩu" v-model="user.re_password">

            <el-icon v-if="!showPassword" class="show-password" @click="togglePassword">
              <View />
            </el-icon>
            <el-icon v-else class="show-password" @click="togglePassword">
              <Hide />
            </el-icon>
          </div>

          <div>
            <button v-if="!loading">ĐĂNG KÝ</button>
            <button v-else disabled class="is-loading"> <el-icon class="icon-loading">
                <Loading />
              </el-icon> Đang xử lý</button>
          </div>
        </form>
      </el-col>

      <el-col :xs="0" :sm="2" :md="3" :lg="7" :xl="7">

      </el-col>
    </el-row>

  </div>

  <!-- <Footer /> -->
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { ElNotification } from 'element-plus'
import { useAuthStore } from '@/stores/auth';
import api from '@/api/axios'
import { router } from '@/router'

import Header from '@/components/Header/Header.vue';
import Footer from '@/components/Footer/Footer.vue';

const showPassword = ref(false)
const loading = ref(false)

const user = reactive({
  fullname: "",
  email: "",
  gender: "",
  password: "",
  re_password: "",
  gender: ""
})

const togglePassword = () => {
  showPassword.value = !showPassword.value;
}

const onSubmit = async () => {
  loading.value = true;
  try {
    if (user.password != user.re_password) {
      ElNotification({
        title: 'Thất bại',
        message: 'Nhập lại mật khẩu không khớp',
        type: 'error',
      })
      return;
    }

    delete user.re_password

    await api.post("/api/v1/auth/signup", user)
    ElNotification({
      title: 'Thành công',
      message: 'Đăng ký thành công.',
      type: 'success',
    })

    router.push({name: "login"})
  } catch (error) {
    console.log(error);
    ElNotification({
      title: 'Thất bại',
      message: error.response.data.message,
      type: 'error',
    })
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 400)
  }
}
</script>

<style lang="scss" src="./Signup.scss" ></style>