import { defineStore } from "pinia";

export const useAddressStore = defineStore("address", {
    state: () => ({
        address: "http://127.0.0.1:8000/api",
        // address : 'http://192.168.74.241:8000/api' //my local ip adress
        // address : 'http://sister.sditharum.id:8000/api' //sister ip adress
    }),
});
