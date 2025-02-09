<template>
    <div class="container">
        <TimeComponent />
        <img
            src="@/assets/img/logo.svg"
            alt="logo"
            class="bg-success p-1 mt-4 logo-app"
        />

        <div class="bg-white text-center p-3 top shadow rounded">
            <p class="my-1 mt-4">Assalamualaikum Wr. Wb.</p>
            <p class="fs-5 mb-1">
                <b>{{ localStore.loadLocal().data.name }}</b>
            </p>

            <!-- koordinat -->
            <div class="mt-3 small">
                <ul v-if="viewK" class="list-group">
                    <li class="list-group-item py-1">
                        Titik Koordinat ({{ latitude + ", " + longitude }})
                    </li>
                    <li class="list-group-item py-1">{{ hasil }}</li>
                </ul>
                <p v-else>Mengambil titik koordinat ...</p>
            </div>
        </div>

        <div class="bg-white mt-4 text-center p-3 rounded shadow">
            <p class="fs-5">
                Klik tombol berikut untuk <br />
                mengisi presensi
            </p>
            <button class="btn btn-success btn-lg mt-1" v-on:click="scan()">
                SCAN QR
            </button>
        </div>
    </div>
</template>

<style>
.logo-app {
    position: absolute;
    z-index: 9;
    left: 0;
    right: 0;
    width: 70px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    border-radius: 13px;
}

.top {
    margin-top: 70px !important;
}
</style>

<script setup>
import axios from "axios";
import TimeComponent from "@/components/TimeComponent.vue";
import { ref, onMounted, onUnmounted } from "vue";

import { useAddressStore } from "../stores/address";
import { useLocalStore } from "../stores/local";

// get data from store with pinia
const addressStore = useAddressStore();
const localStore = useLocalStore();

// koordinat
// Tambah get GPS
// Deklarasi variabel reaktif
const viewK = ref(false);
const latitude = ref(0);
const longitude = ref(0);
const hasil = ref();
const isWithinScanRadius = ref(false); // Menyimpan status apakah dalam radius

// Fungsi untuk mendapatkan lokasi
const getK = () => {
    viewK.value = false; // Set view ke loading sebelum memulai proses

    // Fungsi sukses untuk menangkap lokasi
    const onSuccess = (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        console.log(
            "Latitude: " +
                position.coords.latitude +
                "\n" +
                "Longitude: " +
                position.coords.longitude +
                "\n"
        );

        // Lokasi pengguna berdasarkan navigator
        const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };

        // Lokasi pusat (contoh)
        const centerPoint = {
            lat: localStore.loadLocal().latitude,
            lng: localStore.loadLocal().longitude,
        }; // Latitude dan Longitude pusat
        const radius = localStore.loadLocal().radius; // Radius dalam meter

        // Cek apakah pengguna berada dalam radius
        const result = isWithinRadius(centerPoint, userLocation, radius);
        viewK.value = true; // Menampilkan hasil setelah selesai

        if (result.withinRadius) {
            hasil.value = `Radius ${result.distance.toFixed(
                2
            )} m dari titik yang ditentukan.`;
            isWithinScanRadius.value = true;
            // viewK.value = false;
            // console.log(`Anda berada dalam radius ${result.distance.toFixed(2)} m dari titik yang ditentukan.`)
        } else {
            hasil.value = `Berada di luar radius, jarak: ${result.distance.toFixed(
                2
            )} m dari titik yang ditentukan.`;
            isWithinScanRadius.value = false;
            // viewK.value = false;
            // console.log(`Anda berada di luar radius. Jarak: ${result.distance.toFixed(2)} m dari titik yang ditentukan.`)
        }
    };
    // Fungsi error untuk menangani kesalahan
    const onError = (error) => {
        if (error.code === 1) {
            // Error kode 1: Izin ditolak
            hasil.value =
                "Izin lokasi ditolak. Harap aktifkan GPS dan beri izin akses lokasi.";
        } else if (error.code === 2) {
            // Error kode 2: Tidak ada sinyal lokasi
            hasil.value = "Tidak dapat menemukan lokasi. Pastikan GPS aktif.";
        } else if (error.code === 3) {
            // Error kode 3: Waktu permintaan habis
            hasil.value = "Waktu permintaan lokasi habis. Coba lagi.";
        } else {
            // Error lainnya
            hasil.value = `Kesalahan lokasi: ${error.message}`;
        }
        viewK.value = true;
        isWithinScanRadius.value = false;
        console.error("Kesalahan GPS:", error);
    };

    // Mendapatkan posisi pengguna

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true, // Gunakan lokasi dengan akurasi tinggi (GPS)
        timeout: 10000, // Batas waktu 10 detik
    });
};

// Fungsi untuk mengonversi derajat ke radian
const toRadians = (deg) => (deg * Math.PI) / 180;

// Fungsi untuk menghitung jarak menggunakan rumus Haversine
const calculateDistance = (point1, point2) => {
    const R = 6371000; // Radius bumi dalam meter
    const lat1 = toRadians(point1.lat);
    const lat2 = toRadians(point2.lat);
    const deltaLat = toRadians(point2.lat - point1.lat);
    const deltaLng = toRadians(point2.lng - point1.lng);

    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Hasil dalam meter
};

// Fungsi untuk memeriksa apakah pengguna berada dalam radius
const isWithinRadius = (centerPoint, userLocation, radius) => {
    const distance = calculateDistance(centerPoint, userLocation);
    return { withinRadius: distance <= radius, distance };
};

const axiosDefaultHeader = () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${
        localStore.loadLocal().access_token
    }`;
};

const postData = () => {
    axiosDefaultHeader();
    axios
        .post(`${addressStore.address}/presencekaryawan`, {
            teacher_id: localStore.loadLocal().teacher_id,
            // teacher_id: 1,
        })
        .then((result) => {
            // console.log(result.data.pesan);
            const pesan = result.data.pesan;
            alert(`${pesan}`);
        })
        .catch((err) => {
            // console.log(err.response.data.pesan);
            const pesan = err.response.data.pesan;
            alert(`${pesan}`);
        });
};

const scan = () => {
    if (!isWithinScanRadius.value) {
        alert(
            "Data koordinat tidak ada atau berada di luar radius scan. Pemindaian QR Code tidak diizinkan."
        );
        return;
    }

    const result = (result) => {
        const hasilScan = result.text;
        if (hasilScan === localStore.loadLocal().qrcode) {
            postData();
        } else {
            alert("data QR tidak sama");
        }
    };
    const err = (err) => {
        alert("scan QR: " + err);
    };
    const options = {
        preferFrontCamera: false,
        saveHistory: false,
        prompt: "Tempatkan QRCODE pada area tengah scanner",
        resultDisplayDuration: 0,
        formats: "QR_CODE,EAN_13,DATA_MATRIX",
    };
    window.cordova.plugins.barcodeScanner.scan(result, err, options);
};

onMounted(() => {
    const onDeviceReady = () => {
        console.log("Cordova device ready.");
        getK(); // Mendapatkan lokasi saat perangkat siap
        // verifyToken();
    };

    const onResume = () => {
        console.log("Aplikasi dilanjutkan (resume).");
        getK(); // Memanggil lokasi saat aplikasi dilanjutkan
        // verifyToken();
    };

    document.addEventListener("deviceready", onDeviceReady);
    document.addEventListener("resume", onResume);

    // Membersihkan event listener saat komponen dilepas
    onUnmounted(() => {
        document.removeEventListener("deviceready", onDeviceReady);
        document.removeEventListener("resume", onResume);
    });
});
</script>
