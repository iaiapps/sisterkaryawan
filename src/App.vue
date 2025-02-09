<template>
    <div class="bg-img">
        <router-view> </router-view>
        <div class="kosong"></div>
        <MenuComponent v-if="menu"> </MenuComponent>
    </div>
</template>
<style>
.bg-img {
    background-image: url("@/assets/img/bglogin.svg");
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100%;
    background-position-x: center;
    /* background-size: 500px 430px; */
    padding-top: 12px;
}

.kosong {
    height: 90px;
}
</style>

<script setup>
import MenuComponent from "./components/MenuComponent.vue";
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./stores/login";
import { useLocalStore } from "./stores/local";

// get data from store with pinia
const authStore = useAuthStore();
const localStore = useLocalStore();

const router = useRouter();

// check login
const checkPageLogin = () => {
    if (localStore.loadLocal() == null) {
        router.push({ path: "/" });
    } else {
        router.push({ path: "homepage" });
    }
};

// cek navbar menu
const menu = computed(() => {
    return authStore.isLoggedIn;
});

onMounted(() => {
    checkPageLogin();
});
</script>
