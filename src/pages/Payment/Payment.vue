<template>
  <Header></Header>
  <div class="container payment">
    <div v-if="state.code == 2">
      <h1>Thành công</h1>
      <p>Đơn hàng của quý khách đang được xử lý</p>
    </div>

    <div v-if="state.code == 1">
      <h1>Thanh toán thất bại</h1>
      <p>Nếu có thắc mắc vui lòng liên hệ hotline của chúng tôi</p>
    </div>

    <div v-if="state.code == 3">
      <h1>Đơn hàng đang được xử lý</h1>
      <p>Nếu có thắc mắc vui lòng liên hệ hotline của chúng tôi</p>
    </div>
  </div>
  <Footer></Footer>
</template>

<script setup>
import { reactive } from 'vue'
import { useRoute } from "vue-router";
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
import queryString from 'query-string';
import api from '@/api/axios'

const route = useRoute()

const state = reactive({
  code: null
})

const checkStatus = async() => {
  const stringified = queryString.stringify(route.query);
  let { data } = await api.get(`/api/v1/orders/status?${stringified}`)
  Object.assign(state, { code: data.code})
}
checkStatus()

console.log(route.query);
</script>

<style src="./Payment.scss"></style>