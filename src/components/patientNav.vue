<script setup>
import axios from "axios"

function confirmLogout() {
    if (confirm('您确定要退出挂号系统吗？')) {
        window.location.href = '/patient/logout';
    }
}

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_patient');
        config.headers['Authorization'] = `${token}`;
        return config;
    },
);

</script>

<template>
    <div id="patientNav">
        <input type="button" class="navbtn btn btn-outline-success btn-block form-control mb-3" value="主页" onclick="window.location.href='/patient/home'" />
        <input type="button" class="navbtn btn btn-outline-success btn-block form-control mb-3" value="DeepSeek AI 智能导诊" onclick="window.location.href='/patient/ai'" /><br>
        <input type="button" class="navbtn btn btn-outline-success btn-block form-control mb-3" value="按科室挂号预约" onclick="window.location.href='/patient/registration'" /><br>
        <input type="button" class="navbtn btn btn-outline-success btn-block form-control mb-3" value="搜索医生挂号" onclick="window.location.href='/patient/searchDoctor'" /><br>
        <input type="button" class="navbtn btn btn-outline-success btn-block form-control mb-3" value="查看挂号记录" onclick="window.location.href='/patient/record'" /><br>
        <input type="button" class="navbtn btn btn-outline-success btn-block form-control mb-3" value="修改个人信息" onclick="window.location.href='/patient/edit'" /><br>
        <input type="button" class="navbtn btn btn-outline-danger btn-block form-control mb-3" value="登出" @click="confirmLogout" /><br>
    </div>
</template>

<style scoped>
    .navbtn {
        height: 50px;
    }
</style>