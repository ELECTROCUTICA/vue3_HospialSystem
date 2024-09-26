<script setup>
import { onMounted } from 'vue';
import axios from 'axios';

onMounted(async () => {
    await axios({
        url: 'http://localhost:8080/patient/interface/logout',
        method: 'get'
    }).then(response => {
        alert(response.data.message);
        window.location.href = '/patient/login'
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