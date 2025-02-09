import { defineStore } from "pinia";

export const useLocalStore = defineStore("local", {
    state: () => ({
        loginData: "",
        localData: "",
    }),
    actions: {
        saveLocal(loginData) {
            localStorage.setItem("localDataSave", JSON.stringify(loginData));
        },
        loadLocal() {
            return (this.localData = JSON.parse(
                localStorage.getItem("localDataSave")
            ));
        },
        clearLocal() {
            localStorage.clear();
        },
    },
});
