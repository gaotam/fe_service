<template>
    <Header />
    <div class="forget-password">

        <el-row :gutter="0" style="width: 100%;">
            <el-col :xs="2" :sm="5" :md="7" :lg="7" :xl="8">
                
            </el-col>
        
            <el-col :xs="1" :sm="1" :md="1" :lg="10" :xl="1">
                <div class="flex switch-auth">
                    <h2>Đổi mật khẩu</h2>
                </div>

                <form action="" class="form-login" @submit.prevent="onSubmit">
                    <div class="username">
                        <label for="username">Nhập mã bí mật<span>*</span></label>
                        <input type="text" id="email" v-model="resetPassword.code" placeholder="Nhập mã bí mật">
                    </div>  

                    <div class="username">
                        <label for="username">Nhập mật khẩu mới<span>*</span></label>
                        <input type="password" id="password" v-model="resetPassword.password" placeholder="Nhập mật khẩu mới">
                    </div>  

                    <div class="username">
                        <label for="username">Nhập lại mật khẩu<span>*</span></label>
                        <input type="password" id="re-password" placeholder="Nhập lại mật khẩu">
                    </div>  
                    <div>
                        <button v-if="!loading">ĐỔI MẬT KHẨU</button>
                        <button v-else disabled class="is-loading"> <el-icon class="icon-loading"><Loading /></el-icon> Đang xử lý</button>
                    </div>
                </form>
            </el-col>
        
            <el-col :xs="0" :sm="5" :md="7" :lg="7" :xl="8">
        
            </el-col>
        </el-row>
        
    </div>

   <Footer />
</template>

<script setup>
    import { reactive, ref } from 'vue';
    import { router } from '@/router'
    import { ElNotification } from 'element-plus'
    import api from '@/api/axios'

    import Header  from '@/components/Header/Header.vue';
    import Footer  from '@/components/Footer/Footer.vue';

    const loading = ref(false)
    const resetPassword = reactive({
        code: "",
        password: ""
    })

    const onSubmit = async() => {
        loading.value = true;
        try {
            await api.post("/api/v1/users/reset-password", { ...resetPassword })
            ElNotification({
                title: 'Thành công',
                message: 'Đổi mật khẩu thành công',
                type: 'success',
            })

            router.push({
                name: "login",
            })
        } catch (error) {
            console.log(error);
            ElNotification({
                title: 'Thất bại',
                message: error?.response ? error.response.data.message : error,
                type: 'error',
            })
        } finally {
            setTimeout(() => {
                loading.value = false;
            }, 400)
        }
    }
</script>

<style lang="scss" src="./ResetPassword.scss" >
    
</style>