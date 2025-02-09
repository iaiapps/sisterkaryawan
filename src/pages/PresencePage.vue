<template>
    <div class="container">
        <div class="bg-white text-center p-3 mt-1 shadow rounded">
            <h1 class="fs-5 my-0">REKAP DATA PRESENSI</h1>
        </div>

        <div class="mt-4 bg-white p-3 rounded">
            <template v-if="loading">
                <p class="m-0 text-center">Mengambil data ...</p>
            </template>
            <template v-else-if="data && data.length > 0">
                <div class="table-responsive">
                    <table class="table text-center">
                        <thead>
                            <tr>
                                <th scope="col">Tgl</th>
                                <th scope="col">Datang</th>
                                <th scope="col">Pulang</th>
                                <!-- <th scope="col">Ket</th> -->
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in data" :key="index">
                                <td>
                                    {{
                                        new Date(
                                            item.created_at
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                </td>
                                <td>{{ item.time_in }}</td>
                                <td>{{ item.time_out }}</td>
                                <!-- <td>{{ item.note + " " + (item.description == null ? "" : ": " + item.description) }} </td> -->
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            <template v-else>
                <div class="bg-white rounded text-center">{{ errorText }}</div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import axios from "axios";

import { useAddressStore } from "../stores/address";
import { useLocalStore } from "../stores/local";

// get data from store with pinia
const addressStore = useAddressStore();
const localStore = useLocalStore();

// const loading = ref(true);
const loading = ref(true);
const data = ref([]);
const errorText = ref();

const axiosDefaultHeader = () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${
        localStore.loadLocal().access_token
    }`;
};

const getData = () => {
    axiosDefaultHeader();
    axios
        .get(
            `${addressStore.address}/presencekaryawan/${
                localStore.loadLocal().teacher_id
            }`
        )
        .then((result) => {
            data.value = result.data.data;
            // console.log(data.value);
        })
        .catch((error) => {
            if (error.response.status == 404) {
                // data.value = [];
                errorText.value = "Tidak ada data";
            } else {
                errorText.value = "Server bermasalah";
            }
            // console.log(error.response);
        })
        .finally(() => {
            loading.value = false;
        });
};

onBeforeMount(() => {
    getData();
});
</script>
