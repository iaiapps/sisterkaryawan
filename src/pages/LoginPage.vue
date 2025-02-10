<template>
    <div class="container">
        <div class="p-3">
            <div class="bg-white shadow p-3 rounded top">
                <div
                    v-if="failed"
                    class="alert alert-danger alert-dismissible fade show"
                    role="alert"
                >
                    <span>Email atau Password Salah !</span>
                    <button
                        v-on:click="close"
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="text-center mb-4">
                    <img
                        src="@/assets/img/logo.svg"
                        alt="logo"
                        class="bg-success p-1 rounded my-3 login-logo"
                    />
                    <h1 class="display-6 mt-1">Login Aplikasi Presensi</h1>
                    <p class="mt-1">SDIT Harapan Umat Jember</p>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="email"
                        ><i class="bi bi-envelope-fill"></i
                    ></span>
                    <input
                        v-model="email"
                        type="email"
                        class="form-control"
                        placeholder="email@example.com"
                        aria-label="email"
                        aria-describedby="email"
                    />
                </div>

                <div class="input-group mb-3">
                    <span class="input-group-text" id="password"
                        ><i class="bi bi-key-fill"></i
                    ></span>
                    <input
                        v-if="showPassword"
                        type="text"
                        class="form-control"
                        v-model="password"
                    />
                    <input
                        v-else
                        v-model="password"
                        type="password"
                        class="form-control"
                        placeholder="********"
                        aria-label="email"
                        aria-describedby="password"
                    />
                    <span class="input-group-text" v-on:click="toggleShow">
                        <!-- <i class="bi bi-eye-fill"></i> -->
                        <i
                            class="bi"
                            :class="{
                                'bi-eye-slash-fill': showPassword,
                                'bi-eye-fill': !showPassword,
                            }"
                        ></i>
                    </span>
                </div>
                <button
                    v-on:click="login"
                    class="btn btn-success w-100 mt-2 mb-3"
                >
                    LOGIN
                </button>
            </div>
            <div
                class="footer p-2 text-center bg-success text-white fixed-bottom"
            >
                <small>
                    Tim IT SDIT Harum Jember <br />
                    Sister MobileK Versi 1.1.0
                </small>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-logo {
    width: 80px;
    border-radius: 13px !important;
}

.top {
    margin-top: 70px;
}
</style>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAddressStore } from "../stores/address";
import { useAuthStore } from "../stores/login";
import { useLocalStore } from "../stores/local";

// get data from store with pinia
const addressStore = useAddressStore();
const authStore = useAuthStore();
const localStore = useLocalStore();

//get link route
const router = useRouter();
const toHome = () => {
    router.push({ path: "/homepage" });
};

//login data
const email = ref();
const password = ref();

// show password
const showPassword = ref();
const toggleShow = () => {
    showPassword.value = !showPassword.value;
};

//login failed
const failed = ref();
const errorCheck = () => {
    if (failed.value == "401") failed.value = true;
};

//close alert
const close = () => {
    failed.value = false;
};

//function login
const login = async () => {
    try {
        const response = await axios.post(`${addressStore.address}/login`, {
            email: email.value,
            password: password.value,
        });

        if (response.data.data.email && response.data.access_token) {
            authStore.login(email.value, response.data.access_token);
            localStore.saveLocal(response.data);
            toHome();
            console.log(response.data)
        }
    } catch (error) {
        console.log(error);
        failed.value = error.response.status;
        errorCheck();
    }
};
</script>
