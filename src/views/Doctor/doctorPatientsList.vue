<script setup>
import { reactive, onMounted} from 'vue'
import axios from 'axios'
import config from "@/config/config";

const data1 = reactive({
    registrations: []
});

onMounted(async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}worker/doctor/getPatientRegisterList`,
        method: 'get'
    }).then(response => {
        data1.registrations = response.data;
    }).catch(error => {
        console.log(error);
    });
});

function changingStatus(register_id, status) {
    let alertmessage;
    if (status === 2) {
        alertmessage = '您确定已经完成对该病人的就诊吗？';
    }
    else {
        alertmessage = '您确定要取消该就诊吗？';
    }
    if (confirm(alertmessage)) {
        axios({
            url: `${config.spring_cloud_gateway_url}worker/doctor/changeRegisterStatus`,
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                register_id: register_id,
                status: status
            },
        }).then(response => {
            alert(response.data.message);
            if (response.data.status === 'ok') {
                window.location.reload();
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

const complement = (value) => {                     //用于当分钟、秒小于10时，补上十位数的0
    return value < 10 ? `0${value}` : value.toString()
}

</script>

<template>
    <div class="container-fluid mt-1">
        <doctorHeader></doctorHeader>

        <hr>
        <div class="row">
            <div class="col-2">
                <doctorNav></doctorNav>
            </div>

            <div class="col-1 border-start"></div>

            <div class="col-8" id="content">

                <table class="table table-bordered">

                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>就诊号</th>
                        <th>当日号</th>
                        <th>患者姓名</th>
                        <th>患者身份证号码</th>
                        <th>患者性别</th>
                        <th>患者年龄</th>
                        <th>负责医生</th>
                        <th>就诊时间</th>
                        <th>就诊状态</th>
                        <th>操作</th>
                    </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(registration, key) in data1.registrations" :key="key">
                            <td>{{key + 1}}</td>
                            <td>{{registration.register_id}}</td>
                            <td>{{registration.serial_id}}</td>
                            <td>{{registration.patient_name}}</td>
                            <td>{{registration.patient_id}}</td>
                            <td>{{registration.patient_sex}}</td>
                            <td>{{registration.patient_age}}</td>
                            <td>{{registration.doctor_name}}</td>
                            <td>{{registration.visit_date}} {{registration.begin_time_hour}}:{{complement(registration.begin_time_minute)}}-{{registration.end_time_hour}}:{{complement(registration.end_time_minute)}}</td>
                            <td>
                                <span v-if="registration.registration_status === -1">
                                    <span>医生取消</span>
                                </span>
                                <span v-else-if="registration.registration_status === 0">
                                    <span>患者取消</span>
                                </span>
                                <span v-else-if="registration.registration_status === 1">
                                    <span>待就诊</span>
                                </span>
                                <span v-else-if="registration.registration_status === 2">
                                    <span>已就诊</span>
                                </span>
                                <span v-else>
                                    <span>状态异常</span>
                                </span>
                            </td>

                            <td>
                                <span v-if="registration.registration_status === 1">
                                     <input type="button" @click="changingStatus(registration.register_id, 2)" class="btn btn-primary btn-block" style="margin: 0 3px 0 3px" value="完成就诊" />
                                     <input type="button" @click="changingStatus(registration.register_id, -1)" class="btn btn-danger btn-block" style="margin: 0 3px 0 3px" value="取消就诊"/>
                                </span>
                                <span v-else>
                                    <input type="button" disabled class="btn btn-primary btn-block" style="margin: 0 3px 0 3px" value="完成就诊">
                                    <input type="button" disabled class="btn btn-danger btn-block" style="margin: 0 3px 0 3px" name="cancel" value="取消就诊">
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="col-1 border-end-0"></div>
        </div>
    </div>
</template>

<style scoped>

</style>