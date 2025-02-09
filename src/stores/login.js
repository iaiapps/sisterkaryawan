import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        email: "",
        token: "",
        isLoggedIn: Boolean(localStorage.getItem("localDataSave")),
    }),
    actions: {
        login(email, token) {
            this.email = email;
            this.token = token;
            this.isLoggedIn = true;
        },
        logout() {
            this.email = "";
            this.token = "";
            this.isLoggedIn = false;
        },
    },
});
