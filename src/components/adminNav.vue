<script setup>
import { reactive, onMounted } from "vue";
import axios from 'axios';

const admin = reactive({
    id: ''
});

function confirmLogout() {
    if (confirm('您确定要退出系统吗？')) {
        window.location.href = '/admin/logout';
    }
}

onMounted(async () => {
    await axios({
        url: "http://localhost:8080/admin/interface/getAdmin",
        method: 'get',
    }).then(response => {
        admin.id = response.data.id;
    });
});


</script>

<template>
    <div class="container-fluid" style="padding: 0;">

        <nav class="navbar navbar-expand-lg bg-dark" style="padding-left: 12%; padding-right: 12%; height: 60px">
            <a class="navbar-brand" href="/admin" style="color: white; font-family: 'Microsoft YaHei UI',serif;">医院管理系统</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav">

                    <li class="nav-item active">
                        <a class="nav-link" href="/admin/schedule" style="color: white">医生排班系统<span class="sr-only"></span></a>
                    </li>

                    <li class="nav-item active">
                        <a class="nav-link" href="/admin/doctorinfo" style="color: white">医生信息管理<span class="sr-only"></span></a>
                    </li>

                    <li class="nav-item active">
                        <a class="nav-link" href="/admin/patientManager" style="color: white">用户信息管理<span class="sr-only"></span></a>
                    </li>

                    <li class="nav-item active">
                        <a class="nav-link" href="/admin/department" style="color: white">科室部门管理<span class="sr-only"></span></a>
                    </li>

                </ul>
            </div>
            <span style="padding-right: 1%; color: white" >管理员：{{admin.id}}</span>
            <button @click="confirmLogout" class="btn btn-danger btn-block" id="logout">登出</button>
        </nav>
    </div>
</template>

<style scoped>

</style>