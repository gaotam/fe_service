<template>
    <Header />
    <div class="forget-password">

        <el-row :gutter="0" style="width: 100%;">
            <el-col :xs="2" :sm="5" :md="7" :lg="7" :xl="8">
                
            </el-col>
        
            <el-col :xs="1" :sm="1" :md="1" :lg="10" :xl="1">
                <div class="flex switch-auth">
                    <h2>Quên mật khẩu</h2>
                </div>

                <form action="" class="form-login" @submit.prevent="onSubmit">
                    <div class="username">
                        <label for="username">Nhập email<span>*</span></label>
                        <input type="text" id="username" v-model="email" placeholder="Nhập email khôi phục">
                    </div>    
                    <div>
                        <button v-if="!loading">KHÔI PHỤC MẬT KHẨU</button>
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
    import { ref } from 'vue';
    import { router } from '@/router'
    import { ElNotification } from 'element-plus'
    import api from '@/api/axios'

    import Header  from '@/components/Header/Header.vue';
    import Footer  from '@/components/Footer/Footer.vue';

    const loading = ref(false)
    const email = ref("")

    const onSubmit = async() => {
        loading.value = true;
        try {
            await api.post("/api/v1/users/forget-password", { email: email.value })
            ElNotification({
                title: 'Thành công',
                message: 'Vui lòng kiểm tra hòm thư',
                type: 'success',
            })

            router.push({
                name: "reset-password",
            })
            
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

<style lang="scss" src="./ForgetPassword.scss" >
    
</style>