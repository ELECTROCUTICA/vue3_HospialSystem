<script setup>
import { onMounted } from 'vue';
import axios from 'axios';

onMounted(async () => {
    await axios({
        url: 'http://localhost:8080/admin/interface/logout',
        method: 'get'
    }).then(response => {
        alert(response.data);
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