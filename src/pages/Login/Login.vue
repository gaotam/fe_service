<template>
  <Header />
  <div class="login">
    <el-row :gutter="0" style="width: 100%">
      <el-col :xs="2" :sm="2" :md="3" :lg="7" :xl="7"> </el-col>

      <el-col :xs="24" :sm="20" :md="18" :lg="10" :xl="10">
        <div class="flex switch-auth">
          <router-link activeClass="active" to="/login">Đăng nhập</router-link>
          <router-link to="/signup">Đăng ký</router-link>
        </div>

        <form action="" class="form-login" @submit.prevent="onSubmit">
          <div class="username">
            <label for="username"
              >Tên tài khoản hoặc email <span>*</span></label
            >
            <input
              type="text"
              id="username"
              v-model="user.account"
              placeholder="Nhập tên tài khoản hoặc email"
            />
          </div>

          <div class="password">
            <label for="password">Mật khẩu <span>*</span></label>
            <input
              v-if="!showPassword"
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              v-model="user.password"
            />
            <input
              v-else
              id="password"
              type="text"
              placeholder="Nhập mật khẩu"
              v-model="user.password"
            />

            <el-icon
              v-if="!showPassword"
              class="show-password"
              @click="togglePassword"
            >
              <View />
            </el-icon>
            <el-icon v-else class="show-password" @click="togglePassword">
              <Hide />
            </el-icon>
          </div>

          <div class="forget-password">
            <router-link to="/forget-password">Bạn quên mật khẩu?</router-link>
          </div>
          <div>
            <button v-if="!loading">ĐĂNG NHẬP</button>
            <button v-else disabled class="is-loading">
              <el-icon class="icon-loading"><Loading /></el-icon> Đang xử lý
            </button>
          </div>
        </form>
      </el-col>

      <el-col :xs="0" :sm="2" :md="3" :lg="7" :xl="7"> </el-col>
    </el-row>
  </div>

  <!-- <Footer /> -->
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElNotification } from "element-plus";
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
import { useAuthStore } from "@/stores/auth";
const showPassword = ref(false);
const loading = ref(false);

const user = reactive({
  account: "mynamebvh@gmail.com",
  password: "hoangdz",
});

const auth = useAuthStore();

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const onSubmit = async () => {
  loading.value = true;
  try {
    await auth.login(user.account, user.password);
    ElNotification({
      title: "Thành công",
      message: "Đăng nhập thành công",
      type: "success",
    });
  } catch (error) {
    console.log(error);
    ElNotification({
      title: "Thất bại",
      message: "Tài khoản hoặc mật khẩu sai",
      type: "error",
    });
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 400);
  }
};
</script>

<style lang="scss" src="./Login.scss"></style>
