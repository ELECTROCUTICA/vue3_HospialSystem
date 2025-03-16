<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import $ from 'jquery';
import { Modal } from 'bootstrap';
import config from "@/config/config";

let requestParam_p = Number(useRoute().query.p);
if (isNaN(requestParam_p)) requestParam_p = 1;            //地址中的p参数
let requestParam_keyword = useRoute().query.keyword;            //地址中的keyword参数

const keyword = reactive({
    content: requestParam_keyword,            //搜索文本框内容
});

const data1 = reactive({
    patients: [],
    patients_count: -1,
    pages_count: -1,
    current: -1,
});

function search() {
    window.location.href = `/admin/patientManager?p=1&keyword=${encodeURIComponent(keyword.content)}`;
}

function resetPassword(patient_id, patient_name) {
    if (confirm(`你确定要重置用户${patient_id} ${patient_name}的登录密码吗？`)) {
        axios({
            url: `${config.spring_cloud_gateway_url}leader/admin/patientManager/resetPassword`,
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                patient_id: patient_id
            }
        }).then(response => {
            alert(response.data.message);
            window.location.reload();
        }).catch(error => {
            console.log(error);
        });
    }
}

onMounted(async () => {
    const data1Response = await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/patientManager`,
        method: 'get',
        params: {
            p: requestParam_p,
            keyword: requestParam_keyword
        },
    });
    data1.patients = data1Response.data.patients;
    data1.current = data1Response.data.current;
    data1.pages_count = data1Response.data.pages_count;
    data1.doctors_count = data1Response.data.patients_count

    let previous;
    let next;
    if (requestParam_keyword === null || requestParam_keyword === undefined || requestParam_keyword === '') {
        if (requestParam_p ===  1) {
            previous = '<li class="page-item"><a class="page-link" href="" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>';
        }
        else {
            previous = `<li class="page-item"><a class="page-link" href="patientManager?p=${requestParam_p - 1}" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>`;
        }
        $('#page_navbtn').append(previous);
        for (let i = 1; i <= data1.pages_count; i++) {
            let navbtn1 = `<li class="page-item"><a class="page-link" href="patientManager?p=${i}">${i}</a></li>`;
            $('#page_navbtn').append(navbtn1);
        }
        if (requestParam_p === data1.pages_count) {
            next = '<li class="page-item"><a class="page-link" href="" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>';
        }
        else {
            next = `<li class="page-item"><a class="page-link" href="patientManager?p=${requestParam_p + 1}" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>`;
        }
        $('#page_navbtn').append(next);
    }
    else {
        if (data1.doctors_count === 0) {
            const modal = new Modal($('#noticeModal'));
            modal.show();
        }
        if (requestParam_p ===  1) {
            previous = '<li class="page-item"><a class="page-link" href="" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>';
        }
        else {
            previous = `<li class="page-item"><a class="page-link" href="patientManager?p=${requestParam_p - 1}&keyword=${requestParam_keyword}" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>`
        }
        $('#page_navbtn').append(previous);
        for (let j = 1; j <= data1.pages_count; j++) {
            let navbtn2 = `<li class="page-item"><a class="page-link" href="patientManager?p=${j}&keyword=${requestParam_keyword}">${j}</a></li>`;
            $('#page_navbtn').append(navbtn2);
        }
        if (requestParam_p === data1.pages_count) {
            next = '<li class="page-item"><a class="page-link" href="" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>';
        }
        else {
            next = `<li class="page-item"><a class="page-link" href="patientManager?p=${requestParam_p + 1}&keyword=${requestParam_keyword}" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>`;
        }
        $('#page_navbtn').append(next);
    }
});
</script>

<template>
    <adminNav></adminNav>

    <div class="modal fade" id="noticeModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">通知</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p id="msg">没有查找到数据</p>
                </div>
                <div class="modal-footer">
                    <input type="button" class="btn btn-primary" name="cancel" data-bs-dismiss="modal" value="确定"/>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <form @submit.prevent="search">
            <div class="input-group mt-3">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control col-8" name="keyword" id="keyword" placeholder="身份证号码/姓名/拼音码搜索..." v-model="keyword.content"/>
                <input type="submit" class="btn btn-outline-success my-2 my-sm-0 col-3" name="search" id="search" value="搜索" />
            </div>
        </form>


        <div class="row mt-3">
            <div class="col-12">
                <ul id="bar" class="list-group list-group-horizontal">
                    <li class="list-group-item">
                        <a href="/admin/patientManager"><input type="button" class="btn btn-warning btn-block" value="查看所有用户"/></a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="mt-3" id="content">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>身份证号码</th>
                    <th>姓名</th>
                    <th>性别</th>
                    <th>出生日期</th>
                    <th>登录密码</th>
                    <th>操作</th>
                </tr>
                </thead>

                <tbody id="list">
                <tr v-for="(patient, key) in data1.patients" :key="key">
                    <td>{{patient.patient_id}}</td>
                    <td>{{patient.patient_name}}</td>
                    <td>{{patient.patient_sex}}</td>
                    <td>{{patient.patient_birthdate}}</td>
                    <td>{{patient.patient_password}}</td>
                    <td>
                        <input type="button" @click="resetPassword(patient.patient_id, patient.patient_name)" class="btn btn-primary btn-block" style="margin: 0 3px 0 3px" value="重置登录密码" />
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
    </div>
</template>

<style scoped>

</style>