import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useCategoryStore } from "../stores/category";
const Home = () => import("@/pages/Home/Home.vue");
const Login = () => import("@/pages/Login/Login.vue");
const Signup = () => import("@/pages/Signup/Signup.vue");
// const User = () => import("@/pages/User/User.vue");
// const Profile = () => import("@/pages/User/Profile.vue");
// const ChangePassword = () => import("@/pages/User/ChangePassword.vue");
const ResetPassword = () => import("@/pages/ResetPassword/ResetPassword.vue");
const ForgetPassword = () =>
  import("@/pages/ForgetPassword/ForgetPassword.vue");
const VideoDetail = () => import("@/pages/VideoDetail/VideoDetail.vue");
const LivestreamDetail = () =>
  import("@/pages/LivestreamDetail/LivestreamDetail.vue");
const Livestream = () => import("@/pages/Livestream/Livestream.vue");
const Trending = () => import("@/pages/Trending/Trending.vue");

const authRoute = (to, from, next) => {
  const auth = useAuthStore();
  if (!auth.token) {
    auth.returnUrl = to.fullPath;
    auth.logout();
    return next("/login?redirect=" + to.fullPath);
  }

  return next();
};

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/main.vue"),
      children: [
        {
          path: "",
          name: "home",
          component: Home,
        },
        {
          path: "trending",
          name: "trending",
          component: Trending,
        },
        {
          path: "results",
          name: "results",
          component: () => import("@/pages/Results/Results.vue"),
        },
        {
          path: "history",
          name: "history",
          component: () => import("@/pages/History/History.vue"),
        },
        {
          path: "gaming",
          name: "gaming",
          component: () => import("@/pages/MusicAndGaming/Gaming.vue"),
        },
        {
          path: "music",
          name: "music",
          component: () => import("@/pages/MusicAndGaming/Music.vue"),
        },
        {
          path: "channel/:userId",
          name: "channel",
          component: () => import("@/pages/Channel/Channel.vue"),
        },
      ],
    },
    {
      path: "/videos",
      component: () => import("@/layouts/video-watch.vue"),
      children: [
        {
          path: ":videoId",
          name: "video-detail",
          component: VideoDetail,
        },
      ],
    },
    {
      path: "/livestream/:videoId",
      name: "livestream-detail",
      component: LivestreamDetail,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      beforeEnter: () => {
        const auth = useAuthStore();
        if (auth.user) {
          return { path: "/", query: {}, hash: "" };
        }

        return true;
      },
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup,
    },
    {
      path: "/forget-password",
      name: "forget-password",
      component: ForgetPassword,
    },
    {
      path: "/doi-mat-khau",
      name: "reset-password",
      component: ResetPassword,
    },
    {
      path: "/studio",
      name: "studio",
      component: () => import("@/pages/Studio/Studio.vue"),
      beforeEnter: authRoute,
      children: [
        {
          path: "dashboard",
          name: "studio-dashboard",
          component: () => import("@/pages/Studio/Dashboard/Dashboard.vue"),
        },
        {
          path: "content",
          name: "studio-content",
          component: () => import("@/pages/Studio/Content/Content.vue"),
        },
        {
          path: "comments",
          name: "studio-comments",
          component: () => import("@/pages/Studio/Comments/Comments.vue"),
        },
        {
          path: "customization",
          name: "studio-customization",
          component: () =>
            import("@/pages/Studio/Customization/Customization.vue"),
        },
      ],
    },
    {
      path: "/livestream",
      name: "livestream",
      component: Livestream,
    },
    {
      path: "/logout",
      name: "logout",
      component: null,
      beforeEnter: () => {
        const auth = useAuthStore();
        const cart = useCategoryStore();
        auth.logout();
        cart.clearCode();
      },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        top: 80,
      };
    }

    return { top: 0 };
  },
});

router.beforeEach(async (to) => {
  const publicPages = [
    "/signup",
    "/login",
    "/",
    "/trending",
    "/music",
    "/gaming",
    "/chanel",
  ];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (auth?.tokens && publicPages.includes(to.path)) {
    return "/";
  }

  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath;
    return "/login";
  }
});
