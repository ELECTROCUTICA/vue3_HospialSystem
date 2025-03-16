<script setup>
import { reactive, onMounted } from "vue";
import axios from 'axios';
import config from "@/config/config";

const admin = reactive({
    id: undefined
});

function confirmLogout() {
    if (confirm('您确定要退出系统吗？')) {
        window.location.href = '/admin/logout';
    }
}

onMounted(async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/getAdmin`,
        method: 'get',
    }).then(response => {
        let admin_id = response.data.id;
        if (admin_id === undefined || admin_id === '') {
            window.location.href = '/admin/login';
        }
        admin.id = admin_id;
    }).catch(error => {
        console.log(error);
    });
});


</script>

<template>
    <div class="container-fluid" style="padding: 0;">

        <nav class="navbar navbar-expand-lg bg-dark" style="padding-left: 12%; padding-right: 12%; height: 60px">
            <a class="navbar-brand text-white" href="/admin" style="font-family: 'Microsoft YaHei UI',serif;">医院管理系统</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav">

                    <li class="nav-item active">
                        <a class="nav-link text-white" href="/admin/schedule"><span class="sr-only">医生排班系统</span></a>
                    </li>

                    <li class="nav-item active">
                        <a class="nav-link text-white" href="/admin/doctorinfo"><span class="sr-only">医生信息管理</span></a>
                    </li>

                    <li class="nav-item active">
                        <a class="nav-link text-white" href="/admin/patientManager"><span class="sr-only">用户信息管理</span></a>
                    </li>

                    <li class="nav-item active">
                        <a class="nav-link text-white" href="/admin/departments"><span class="sr-only">科室部门管理</span></a>
                    </li>

                    <li class="nav-item active">
                        <a class="nav-link text-white" href="/admin/noonManager"><span class="sr-only">午别时间管理</span></a>
                    </li>

                    <li class="nav-item active">
                        <a class="nav-link text-white" href="/admin/titleManager"><span class="sr-only">职称管理</span></a>
                    </li>

                </ul>
            </div>

            <span style="padding-right: 1%; color: white" v-if="admin.id !== '' && admin.id !== undefined && admin.id != null">管理员：{{admin.id}}</span>
            <span style="padding-right: 1%; color: white" v-else>管理员：null</span>
            <button @click="confirmLogout" class="btn btn-danger btn-block" id="logout">登出</button>
        </nav>
    </div>
</template>

<style scoped>

</style>