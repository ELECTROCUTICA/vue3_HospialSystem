<script setup>
import { onMounted } from 'vue';
import axios from 'axios';
import config from "@/config/config";

onMounted(async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/logout`,
        method: 'get'
    }).then(response => {
        alert(response.data.message);
        window.location.href = '/admin/login'
    }).catch(error => {
        console.log(error);
    });
});
</script>

<template>
    <div class="logout"></div>
</template>

<style scoped>

</style>