<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';


const data1 = reactive({
    Time: '',
    dateParam: ''
});

const regs = reactive({
    registrations: []
});

onMounted(async () => {
    const responseTime = await axios({
        url: 'http://localhost:8080/patient/interface/getServerTime',
        // url: 'http://localhost:5000/patient/api/getServerTime',
        method: 'get'
    });
    data1.Time = responseTime.data.Time;
    data1.dateParam = responseTime.data.dateParam;

    const responseRegistrations = await axios({
        url: 'http://localhost:8080/patient/interface/getRegistrationsToday',
        // url: 'http://localhost:5000/patient/api/getRegistrationsToday',
        method: 'get',
        params: {
            dateParam: data1.dateParam
        }
    });
    regs.registrations = responseRegistrations.data;
});


</script>

<template>
    <div class="container-fluid mt-1">
        <patientHeader></patientHeader>             <!--病人个人信息 -->

        <hr>

        <div class="row">
            <div class="col-2">
                <patientNav></patientNav>             <!--病人导航栏 -->
            </div>

            <div class="col-1 border-start"></div>

            <div class="col-8" id="content">          <!--实际内容 -->
                <div class="row mb-3">
                    <h4 id="date" class="h4">当前时间：{{data1.Time}}</h4>
                </div>

                <div class="row mt-3">
                    <h5 class="h5">您的今日挂号候诊列表</h5>
                </div>

                <div class="row mt-3">
                    <ul class="list-group">
                        <li v-for="(value, message) in regs.registrations" :key="message" class="list-group-item list-group-item-action">
                            <span>{{message}}</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div class="col-1 border-end-0"></div>
        </div>
    </div>

</template>

<style scoped>

</style>