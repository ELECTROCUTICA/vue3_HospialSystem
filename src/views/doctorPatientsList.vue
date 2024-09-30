<script setup>
import { reactive, onMounted} from 'vue'
import axios from 'axios'

const data1 = reactive({
    registrations: []
});

onMounted(async () => {
    await axios({
        url: 'http://localhost:8080/doctor/interface/getPatientsList',
        method: 'get'
    }).then(response => {
        data1.registrations = response.data;
    }).catch(error => {
        console.log(error);
    });
});

function changingStatus(id, status) {
    let alertmessage;
    if (status === 2) {
        alertmessage = '您确定已经完成对该病人的就诊吗？';
    }
    else {
        alertmessage = '您确定要取消该就诊吗？';
    }
    if (confirm(alertmessage)) {
        axios({
            url: 'http://localhost:8080/doctor/changingStatus',
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                id: id,
                status: status
            },
        }).then(response => {
            alert(response.data.message);
            if (response.data.state === 'ok') {
                window.location.reload();
            }
        }).catch(error => {
            console.log(error);
        });
    }
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

                <table class="table table-striped">

                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>就诊号</th>
                        <th>患者姓名</th>
                        <th>患者身份证号码</th>
                        <th>患者性别</th>
                        <th>患者年龄</th>
                        <th>负责医生</th>
                        <th>预约就诊时间</th>
                        <th>就诊状态</th>
                        <th>操作</th>
                    </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(registration, key) in data1.registrations" :key="key">
                            <td>{{key}}</td>
                            <td>{{registration.id}}</td>
                            <td>{{registration.patient_name}}</td>
                            <td>{{registration.patient_id}}</td>
                            <td>{{registration.patient_sex}}</td>
                            <td>{{registration.patient_age}}</td>
                            <td>{{registration.doctor_name}}</td>
                            <td>{{registration.visit_date}}</td>
                            <td>
                                <span v-if="registration.status === 0">
                                    <span>已取消</span>
                                </span>
                                <span v-else-if="registration.status === 1">
                                    <span>待就诊</span>
                                </span>
                                <span v-else-if="registration.status === 2">
                                    <span>已就诊</span>
                                </span>
                                <span v-else>
                                    <span>状态异常</span>
                                </span>
                            </td>

                            <td>
                                <span v-if="registration.status === 1">
                                     <input type="button" @click="changingStatus(registration.id, 2)" class="btn btn-primary btn-block" style="margin: 0 3px 0 3px" name="finish" value="完成就诊" />
                                     <input type="button" @click="changingStatus(registration.id, 0)" class="btn btn-danger btn-block" style="margin: 0 3px 0 3px" name="cancel" value="取消就诊"/>
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