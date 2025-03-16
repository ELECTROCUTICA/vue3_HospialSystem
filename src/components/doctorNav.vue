<script setup>

function confirmLogout() {
    if (confirm('您确定要退出系统吗？')) {
        window.location.href = '/doctor/logout';
    }
}
</script>

<template>
    <div id="doctorNav">
        <input type="button" class="navbtn btn btn-outline-primary btn-block form-control mb-3" value="刷新就诊列表" onclick="window.location.reload()" /><br>
        <input type="button" @click="confirmLogout()" class="navbtn btn btn-outline-danger btn-block form-control mb-3"  value="登出" /><br>
    </div>
</template>

<style scoped>
    .navbtn {
        height: 50px;
    }
</style>