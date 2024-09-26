<script setup>

function confirmLogout() {
    if (confirm('您确定要退出系统吗？')) {
        window.location.href = '/patient/logout';
    }
}

</script>

<template>
    <div id="patientNav">
        <input type="button" class="navbtn btn btn-outline-success btn-block form-control mb-3" name="goHome" value="主页" onclick="window.location.href='/patient/home'" /><br>
        <input type="button" class="navbtn btn btn-outline-success btn-block form-control mb-3" name="goRegister" value="按科室挂号预约" onclick="window.location.href='/patient/registration'" /><br>
        <input type="button" class="navbtn btn btn-outline-success btn-block form-control mb-3" name="goRecord" value="查看挂号记录" onclick="window.location.href='/patient/record'" /><br>
        <input type="button" class="navbtn btn btn-outline-success btn-block form-control mb-3" name="goEdit" value="修改个人信息" onclick="window.location.href='/patient/edit'" /><br>
        <input type="button" class="navbtn btn btn-outline-danger btn-block form-control mb-3" name="logout" value="登出" @click="confirmLogout" /><br>
    </div>
</template>

<style scoped>
    .navbtn {
        height: 50px;
    }
</style>