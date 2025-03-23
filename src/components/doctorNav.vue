<script setup>
import {reactive, onMounted} from 'vue';
import axios from 'axios';
import config from "@/config/config";
import $ from 'jquery';
import { Modal } from "bootstrap";

function confirmLogout() {
    if (confirm('您确定要退出系统吗？')) {
        window.location.href = '/doctor/logout';
    }
}

const data1 = reactive({
    schedule: []
});

const submitAppendRegisterFormData = reactive({
    schedule_id: 0,
    doctor_info: '',
    work_date: '',
    noon_info: '',
    init_register_count: 0,
    remain_register_count: 0,
    append_register_count: 0
});

const complement = (value) => {
    return value < 10 ? `0${value}` : value.toString()
}

const displaySubmitAppendModal = async (ds) => {
    const modal = new Modal($('#submitAppendRegisterModal'));
    modal.show();
    submitAppendRegisterFormData.schedule_id = ds.schedule_id;
    submitAppendRegisterFormData.doctor_info = `${ds.doctor_name} ${ds.title_name} ${ds.dep_name}`;
    submitAppendRegisterFormData.work_date = ds.work_date;
    submitAppendRegisterFormData.noon_info = `${ds.noon_name} ${ds.begin_time_hour}:${complement(ds.begin_time_minute)}-${ds.end_time_hour}:${complement(ds.end_time_minute)}`;
    submitAppendRegisterFormData.init_register_count = ds.init_register_count;
    submitAppendRegisterFormData.remain_register_count = ds.remain_register_count;
    submitAppendRegisterFormData.append_register_count = ds.append_register_count;
}

const submitAppend = async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}worker/doctor/addRegisterCount`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            schedule_id: submitAppendRegisterFormData.schedule_id,
            amount: submitAppendRegisterFormData.append_register_count
        },
    }).then(response => {
        alert(response.data.message);
        if (response.data.status === 'ok'){
            $('#closeSubmitAppendRegisterModal').click();
            window.location.reload();
        }
    }).catch(error => {
        console.log(error);
    });
}

onMounted(async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}worker/doctor/getTodaySchedule`,
        method: 'get'
    }).then(response => {
        data1.schedule = response.data;
    }).catch(error => {
        console.log(error);
    });
});


</script>

<template>
    <div id="doctorNav">
        <input type="button" class="navbtn btn btn-outline-primary btn-block form-control mb-3" value="刷新就诊列表" onclick="window.location.reload()" /><br>
        <input type="button" class="navbtn btn btn-outline-primary btn-block form-control mb-3" value="门诊加号" data-bs-toggle="modal" data-bs-target="#appendRegisterCountModal"  /><br>
        <input type="button" @click="confirmLogout()" class="navbtn btn btn-outline-danger btn-block form-control mb-3"  value="登出" /><br>
    </div>

    <div class="modal fade" id="appendRegisterCountModal" tabindex="-1">
        <div class="modal-dialog modal-custom">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">当天门诊加号</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">

                    <span class="input-group-text">请选择需要加号的出诊安排</span>
                    <ul v-if="data1.schedule.length > 0" class="list-group mb-3">
                        <li v-for="(ds, key) in data1.schedule" :key="key" class="list-group-item list-group-item-action p-2">
                            {{ds.work_date}} {{ds.noon_name}} {{ds.begin_time_hour}}:{{complement(ds.begin_time_minute)}}-{{ds.end_time_hour}}:{{complement(ds.end_time_minute)}} {{ds.dep_name}} 余号：{{ds.remain_register_count}}
                            <button @click="displaySubmitAppendModal(ds)" class="btn btn-block btn-primary float-end" data-bs-dismiss="modal">加号</button>
                        </li>
                    </ul>
                    <ul v-else class="list-group mb-3">
                        <li class="list-group-item list-group-item-action">您今日没有有效的出诊安排</li>
                    </ul>

                    <div class="modal-footer">
                        <input type="button" class="btn btn-danger btn-block" id="closeAppendRegisterCountModal" data-bs-dismiss="modal" value="取消"/>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="submitAppendRegisterModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">当天门诊加号确认</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitAppend">
                        <div class="input-group mb-3 visually-hidden">
                            <span class="input-group-text">schedule_id</span>
                            <input type="text" class="form-control" disabled v-model="submitAppendRegisterFormData.schedule_id"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">医生信息</span>
                            <input type="text" class="form-control" disabled v-model="submitAppendRegisterFormData.doctor_info"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">出诊日期</span>
                            <input type="text" class="form-control" disabled v-model="submitAppendRegisterFormData.work_date"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">出诊午别</span>
                            <input type="text" class="form-control" disabled v-model="submitAppendRegisterFormData.noon_info"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">初始号源数量</span>
                            <input type="text" class="form-control" disabled v-model="submitAppendRegisterFormData.init_register_count" />
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">当前号源数量</span>
                            <input type="text" class="form-control" disabled v-model="submitAppendRegisterFormData.remain_register_count"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">加号数量</span>
                            <input type="number" class="form-control" v-model="submitAppendRegisterFormData.append_register_count" min="0" max="999"/>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" value="确定"/>
                            <input type="button" class="btn btn-danger btn-block" id="closeSubmitAppendRegisterModal" data-bs-dismiss="modal" value="取消"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .navbtn {
        height: 50px;
    }
    .modal-custom {
        --bs-modal-width:560px
    }
</style>