<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import config from "@/config/config";


const data1 = reactive({
    dateText: '',
    dateParam: '',
    registrations: []
});


onMounted(async () => {
    const responseTime = await axios({
        url: `${config.spring_cloud_gateway_url}app/patient/getServerTime`,
        method: 'get'
    });
    data1.dateText = responseTime.data.dateText;
    data1.dateParam = responseTime.data.dateParam;

    const responseRegistrations = await axios({
        url: `${config.spring_cloud_gateway_url}app/patient/getRegistrationsToday`,
        method: 'get',
        params: {
            dateParam: data1.dateParam
        }
    });
    data1.registrations = responseRegistrations.data.registrations;
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
                    <h4 id="date" class="h4">今日时间：{{data1.dateText}}</h4>
                </div>

                <div class="row mt-3">
                    <h5 class="h5">您的今日挂号候诊列表</h5>
                </div>

                <div class="row mt-3">
                    <div v-if="data1.registrations.length === 0">
                        <ul class="list-group">
                            <li class="list-group-item list-group-item-action">
                                <span>您今日没有挂号就诊</span>
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <ul class="list-group">
                            <li v-for="(registration, key) in data1.registrations" :key="key" class="list-group-item list-group-item-action">
                            <span>当日号:{{registration.serial_id}} {{registration.dep_name}} {{registration.doctor_name}} {{registration.title_name}}
                                {{registration.begin_time_hour}}:{{registration.begin_time_minute}}-{{registration.end_time_hour}}:{{registration.end_time_minute}}</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

            <div class="col-1 border-end-0"></div>
        </div>
    </div>

</template>

<style scoped>

</style>