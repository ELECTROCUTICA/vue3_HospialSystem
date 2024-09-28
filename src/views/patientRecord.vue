<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import $ from 'jquery';

let requestParam_p = Number(useRoute().query.p);
if (requestParam_p === undefined || isNaN(requestParam_p)) {
    requestParam_p = 1;
}

const data1 = reactive({
    current: -1,
    pages_count: -1,
    records_count: -1,
    registrations: []
});

onMounted(async () => {
    const data1Response = await axios({
        url: 'http://localhost:8080/patient/interface/getRecords',
        method: 'get',
        params: {
            p: requestParam_p
        },
    });
    data1.current = data1Response.data.current;
    data1.pages_count = data1Response.data.pages_count;
    data1.records_count = data1Response.data.records_count
    data1.registrations = data1Response.data.registrations;

    let previous;
    let next;
    if (requestParam_p ===  1) {
        previous = '<li class="page-item"><a class="page-link" href="" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>';
    }
    else {
        previous = '<li class="page-item"><a class="page-link" href="record?p=' + (requestParam_p - 1) + '" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>';
    }
    $('#page_navbtn').append(previous);
    for (var i = 1; i <= data1.pages_count; i++) {
        var navbtn = '<li class="page-item"><a class="page-link" href="record?p=' + i + '">' + i + '</a></li>';
        $('#page_navbtn').append(navbtn);
    }
    if (requestParam_p === data1.pages_count) {
        next = '<li class="page-item"><a class="page-link" href="" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>';
    }
    else {
        next = '<li class="page-item"><a class="page-link" href="record?p=' + (requestParam_p + 1) + '" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>';
    }
    $('#page_navbtn').append(next);
});

function cancelRegistration(id, date, dep_name, doctor_name) {
    if (confirm('您确定要取消' + date + ' ' + dep_name + ' ' + doctor_name + ' ' + '医生的挂号预约吗？')) {
        axios({
            url: 'http://localhost:8080/patient/interface/cancelRegistration',
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                id: id,
                status: 0,
            },
        }).then(() => {
            alert('取消成功');
            window.location.reload();
        }).catch(error => {
            console.log(error);
        });
    }
}

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
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th>就诊号</th>
                        <th>医生</th>
                        <th>医生职称</th>
                        <th>科室</th>
                        <th>预约就诊时间</th>
                        <th>就诊状态</th>
                        <th>操作</th>
                    </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(registration, key) in data1.registrations" :key="key">
                            <td>{{registration.id}}</td>
                            <td>{{registration.doctor_name}}</td>
                            <td>{{registration.doctor_title}}</td>
                            <td>{{registration.dep_name}}</td>
                            <td>{{registration.visit_date}}</td>
                            <td>
                                <span v-if="registration.status === 0">已取消</span>
                                <span v-else-if="registration.status === 1">待就诊</span>
                                <span v-else-if="registration.status === 2">已就诊</span>
                                <span v-else>状态异常</span>
                            </td>

                            <td>
                                <span v-if="registration.status === 1">
                                    <input type="button" @click="cancelRegistration(registration.id, registration.visit_date, registration.dep_name, registration.doctor_name)" class="btn btn-danger btn-block" name="cancel" value="取消挂号预约"/>
                                </span>
                                <span v-else>
                                    <input type="button" disabled class="btn btn-danger btn-block" name="cancel" value="取消挂号预约">
                                </span>
                            </td>
                        </tr>


                    </tbody>
                </table>

                <div class="input-group mt-3">
                    <nav aria-label="Page navigation example">
                        <ul class="pagination" id="page_navbtn">
                        </ul>
                    </nav>
                </div>

            </div>

            <div class="col-1 border-end-0"></div>
        </div>
    </div>
</template>

<style scoped>

</style>