<template>
    <div class="btn-group fixed-bottom shadow">
        <router-link to="/homepage" class="btn btn-success btn-sm rounded-0">
            <i class="bi bi-house-door-fill fs-5"></i>
            <span class="small d-block">Home</span>
        </router-link>

        <router-link
            to="/presencepage"
            class="btn btn-success btn-sm rounded-0"
        >
            <i class="bi bi-bar-chart-line-fill fs-5"></i>
            <span class="small d-block">Data</span>
        </router-link>
        <button v-on:click="logout" class="btn btn-success btn-sm rounded-0">
            <i class="bi bi-x-circle-fill fs-5"></i>
            <span class="small d-block">Keluar</span>
        </button>
    </div>
</template>

<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
import { useAddressStore } from "../stores/address";
import { useLocalStore } from "@/stores/local";
import { useAuthStore } from "@/stores/login";

// get data from address store with pinia
const addressStore = useAddressStore();
const localStore = useLocalStore();
const authStore = useAuthStore();

//router
const router = useRouter();
const toRoot = () => {
    router.push({ path: "/" });
};

//axios default header
const axiosDefaultheader = () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${
        localStore.loadLocal().access_token
    }`;
};

const logout = () => {
    if (confirm("Apakah anda yakin untuk keluar ?") == true) {
        axiosDefaultheader();
        axios
            .post(`${addressStore.address}/logout`)
            .then((result) => {
                // this.items = result;
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            });
        localStore.clearLocal();
        authStore.logout();
        toRoot();
        // menu();
        console.log("berhasil logout");
    } else {
        console.log("cancel logout");
    }
};
</script>
