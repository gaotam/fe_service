<script setup>
import { IconArrowBarUp } from "@tabler/icons-vue";
</script>

<template>
  <div class="studio-dashboard">
    <div class="head">
      <h2>Trang tổng quan của kênh</h2>
      <div class="func">
        <router-link to="/studio/dashboard?upload=true">
          <IconArrowBarUp stroke-width="1" />
        </router-link>
        <router-link to="/livestream">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enable-background="new 0 0 24 24"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              focusable="false"
              style="
                pointer-events: none;
                display: block;
                width: 100%;
                height: 100%;
              "
            >
              <g>
                <path
                  d="M14 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM8.48 8.45l-.71-.7C6.68 8.83 6 10.34 6 12s.68 3.17 1.77 4.25l.71-.71C7.57 14.64 7 13.39 7 12s.57-2.64 1.48-3.55zm7.75-.7-.71.71c.91.9 1.48 2.15 1.48 3.54s-.57 2.64-1.48 3.55l.71.71C17.32 15.17 18 13.66 18 12s-.68-3.17-1.77-4.25zM5.65 5.63l-.7-.71C3.13 6.73 2 9.24 2 12s1.13 5.27 2.95 7.08l.71-.71C4.02 16.74 3 14.49 3 12s1.02-4.74 2.65-6.37zm13.4-.71-.71.71C19.98 7.26 21 9.51 21 12s-1.02 4.74-2.65 6.37l.71.71C20.87 17.27 22 14.76 22 12s-1.13-5.27-2.95-7.08z"
                ></path>
              </g>
            </svg>
          </div>
        </router-link>
      </div>
    </div>
    <div class="studio-dashboard-content">
      <div class="create-video">
        <div class="upload">
          <img
            src="https://www.gstatic.com/youtube/img/creator/no_content_illustration_upload_video_v3.svg"
            alt=""
          />
          <p>Hãy đăng tải và xuất bản video</p>
          <button
            @click="
              $router.push({ name: $route.name, query: { upload: true } })
            "
          >
            TẢI VIDEO LÊN
          </button>
        </div>
      </div>
      <div class="studio-data">
        <div class="top">
          <h3>Số liệu phân tích về kênh</h3>
          <p>Số người đăng ký hiện tại</p>
          <p>1</p>
        </div>
        <div class="mid">
          <h4>Tóm tắt</h4>
          <p>28 ngày qua</p>
          <div>
            <p>Số lượt xem</p>
            <p>1 -</p>
          </div>
          <div>
            <p>Thời gian xem</p>
            <p>0,0 -</p>
          </div>
        </div>
        <div class="bottom">
          <h4>Video hàng đầu</h4>
          <p>48 giờ qua - Số lượt xem</p>
        </div>

        <div class="redirect">CHUYỂN ĐẾN SỐ LIỆU PHÂN TÍCH</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./Dashboard.scss"></style>
