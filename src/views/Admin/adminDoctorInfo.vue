<script setup>
import {reactive, onMounted} from 'vue';
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
    doctors: [],
    valid_departments: [],
    departments: [],
    titles: [],
    valid_titles: [],
    current: -1,
    pages_count: -1,
    doctors_count: -1
});

const updateDoctorModalFormData = reactive({
    doctor_id: -1,
    doctor_name: '',
    doctor_sex: '',
    dep_no: -1,
    doctor_password: '',
    title_no: -1,
    valid_flag : -1,
    doctor_description: ''
});

const insertDoctorModalFormData = reactive({
    doctor_name: '',
    doctor_sex: 'default',
    dep_no: -1,
    doctor_password: '',
    title_no: -1,
    valid_flag: 1,
    doctor_description: ''
});

onMounted(async () => {
    const data1Response = await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/doctorinfo`,
        method: 'get',
        params: {
            p: requestParam_p,
            keyword: requestParam_keyword
        },
    });
    data1.current = data1Response.data.current;
    data1.pages_count = data1Response.data.pages_count;
    data1.doctors_count = data1Response.data.doctors_count
    data1.doctors = data1Response.data.doctors;
    data1.departments = data1Response.data.departments;
    data1.valid_departments = data1Response.data.valid_departments;
    data1.titles = data1Response.data.titles;
    data1.valid_titles = data1Response.data.valid_titles;

    let previous;
    let next;
    if (requestParam_keyword === null || requestParam_keyword === undefined || requestParam_keyword === '') {
        if (requestParam_p ===  1) {
            previous = '<li class="page-item"><a class="page-link" href="" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>';
        }
        else {
            previous = `<li class="page-item"><a class="page-link" href="doctorinfo?p=${requestParam_p - 1}" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>`;
        }
        $('#page_navbtn').append(previous);
        for (let i = 1; i <= data1.pages_count; i++) {
            let navbtn1 = `<li class="page-item"><a class="page-link" href="doctorinfo?p=${i}">${i}</a></li>`;
            $('#page_navbtn').append(navbtn1);
        }
        if (requestParam_p === data1.pages_count) {
            next = '<li class="page-item"><a class="page-link" href="" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>';
        }
        else {
            next = `<li class="page-item"><a class="page-link" href="doctorinfo?p=${requestParam_p + 1}" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>`;
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
            previous = `<li class="page-item"><a class="page-link" href="doctorinfo?p=${requestParam_p - 1}&keyword=${requestParam_keyword}" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>`;
        }
        $('#page_navbtn').append(previous);
        for (let j = 1; j <= data1.pages_count; j++) {
            let navbtn2 = `<li class="page-item"><a class="page-link" href="doctorinfo?p=${j}&keyword=${requestParam_keyword}">${j}</a></li>`;
            $('#page_navbtn').append(navbtn2);
        }
        if (requestParam_p === data1.pages_count) {
            next = '<li class="page-item"><a class="page-link" href="" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>';
        }
        else {
            next = `<li class="page-item"><a class="page-link" href="doctorinfo?p=${requestParam_p + 1}&keyword=${requestParam_keyword}" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>`;
        }
        $('#page_navbtn').append(next);
    }

});

//点击更新某个医生的信息按钮时，修改模态框中的信息
function clickUpdate(doctor_id) {
    axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/doctorinfo/getDoctor`,
        method: 'get',
        params: {
            doctor_id: doctor_id
        }
    }).then(response => {
        updateDoctorModalFormData.doctor_id = response.data.doctor_id;
        updateDoctorModalFormData.doctor_name = response.data.doctor_name;
        updateDoctorModalFormData.doctor_sex = response.data.doctor_sex;
        updateDoctorModalFormData.dep_no = response.data.dep_no;
        updateDoctorModalFormData.doctor_password = response.data.doctor_password;
        updateDoctorModalFormData.title_no = response.data.title_no;
        updateDoctorModalFormData.valid_flag = response.data.valid_flag;
        updateDoctorModalFormData.doctor_description = response.data.doctor_description;

    }).catch(error => {
        console.log(error);
    });
}

//更新医生信息模态框中，点击提交更新
function submitUpdate() {
    axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/doctorinfo/update`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            doctor_id: updateDoctorModalFormData.doctor_id,
            doctor_name: updateDoctorModalFormData.doctor_name,
            doctor_sex: updateDoctorModalFormData.doctor_sex,
            dep_no: Number(updateDoctorModalFormData.dep_no),
            title_no: updateDoctorModalFormData.title_no,
            doctor_password: updateDoctorModalFormData.doctor_password,
            valid_flag: updateDoctorModalFormData.valid_flag,
            doctor_description: updateDoctorModalFormData.doctor_description
        }
    }).then(response => {
        alert(response.data.message);
        $('#closeUpdateDoctorModal').click();
        window.location.reload();
    }).catch(error => {
        console.log(error);
    });
}


function submitInsert() {
    axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/doctorinfo/insert`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            doctor_id: Number(0),
            doctor_name: insertDoctorModalFormData.doctor_name,
            doctor_sex: insertDoctorModalFormData.doctor_sex,
            dep_no: Number(insertDoctorModalFormData.dep_no),
            doctor_password: insertDoctorModalFormData.doctor_password,
            title_no: Number(insertDoctorModalFormData.title_no),
            valid_flag: Number(insertDoctorModalFormData.valid_flag),
            doctor_description: insertDoctorModalFormData.doctor_description
        }
    }).then(response => {
        alert(response.data.message);
        $('#closeInsertDoctorModal').click();
        window.location.reload();

    }).catch(error => {
        console.log(error);
    });
}

function search() {
    window.location.href = `/admin/doctorinfo?p=1&keyword=${encodeURIComponent(keyword.content)}`
}

</script>

<template>
    <!-- 通知模态框 -->
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

    <!-- 修改医生信息模态框 -->
    <div class="modal fade" id="updateDoctorModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">修改医生信息</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitUpdate" style="text-align: center">
                        <div class="input-group mb-3">
                            <span class="input-group-text">职工号</span>
                            <input type="text" class="form-control" placeholder="职工号" v-model="updateDoctorModalFormData.doctor_id" disabled/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">医生姓名</span>
                            <input type="text" class="form-control" placeholder="医生姓名" v-model="updateDoctorModalFormData.doctor_name"/>
                        </div>


                        <div class="input-group mb-3">
                            <span class="input-group-text">性别</span>
                            <select class="form-select form-control" v-model="updateDoctorModalFormData.doctor_sex">
                                <option value="男">男</option>
                                <option value="女">女</option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">所属科室</span>
                            <select class="form-select form-control" v-model="updateDoctorModalFormData.dep_no">
                                <option v-for="(value, key) in data1.departments" :key="key" :value="value.dep_no" v-text="`${value.dep_no} ${value.dep_name}`"></option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">职称</span>
                            <select class="form-select form-control" v-model="updateDoctorModalFormData.title_no">
                                <option v-for="(value, key) in data1.titles" :key="key" :value="value.title_no" v-text="`${value.title_no} ${value.title_name}`"></option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">有效性</span>
                            <select class="form-select form-control" v-model="updateDoctorModalFormData.valid_flag">
                                <option :value="0">无效</option>
                                <option :value="1">有效</option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">登录密码</span>
                            <input type="text" class="form-control" placeholder="登录密码" v-model="updateDoctorModalFormData.doctor_password"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">简介</span>
                            <textarea class="form-control" rows="3" v-model="updateDoctorModalFormData.doctor_description"></textarea>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" value="提交修改" />
                            <input type="button" class="btn btn-danger btn-block" id="closeUpdateDoctorModal" name="cancel" data-bs-dismiss="modal" value="取消"/>
                        </div>

                    </form>
                </div>

            </div>

        </div>
    </div>



    <!--    插入新的医生信息    -->
    <div class="modal fade" id="insertDoctorModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">新增一位医生</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitInsert" id="insertDoctorForm" style="text-align: center">
                        <div class="input-group mb-3">
                            <span class="input-group-text">职工号</span>
                            <input type="text" class="form-control" value="职工号自动生成" readonly disabled style="font-style: italic"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">医生姓名</span>
                            <input type="text" class="form-control" placeholder="医生姓名" v-model="insertDoctorModalFormData.doctor_name"/>
                        </div>


                        <div class="input-group mb-3">
                            <span class="input-group-text">性别</span>
                            <select class="form-select form-control" v-model="insertDoctorModalFormData.doctor_sex">
                                <option value="default">请选择</option>
                                <option value="男">男</option>
                                <option value="女">女</option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">所属科室</span>
                            <select class="form-select form-control" v-model="insertDoctorModalFormData.dep_no">
                                <option :value="-1">请选择</option>
                                <option v-for="(value, key) in data1.valid_departments" :key="key" :value="value.dep_no" v-text="`${value.dep_no} ${value.dep_name}`"></option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">职称</span>
                            <select class="form-select form-control" v-model="insertDoctorModalFormData.title_no">
                                <option :value="-1">请选择</option>
                                <option v-for="(value, key) in data1.valid_titles" :key="key" :value="value.title_no" v-text="`${value.title_no} ${value.title_name}`"></option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">有效性</span>
                            <select class="form-select form-control" v-model="insertDoctorModalFormData.valid_flag">
                                <option :value="1">有效</option>
                                <option :value="0">无效</option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">登录密码</span>
                            <input type="text" class="form-control" placeholder="登录密码" v-model="insertDoctorModalFormData.doctor_password"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">简介</span>
                            <textarea class="form-control" rows="3" v-model="insertDoctorModalFormData.doctor_description"></textarea>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary" value="提交"/>
                            <input type="button" class="btn btn-danger btn-block" id="closeInsertDoctorModal" data-bs-dismiss="modal" value="取消"/>
                        </div>
                    </form>
                </div>

            </div>

        </div>
    </div>

    <adminNav></adminNav>
    <div class="container">
        <form @submit.prevent="search">
            <div class="input-group mt-3">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control col-8" placeholder="职工号/姓名/拼音码搜索..." v-model="keyword.content"/>
                <input type="submit" class="btn btn-outline-success my-2 my-sm-0 col-3" value="搜索"/>
            </div>
        </form>


        <div class="row mt-3">
            <div class="col-12">
                <ul id="bar" class="list-group list-group-horizontal">
                    <li class="list-group-item">
                        <a href="/admin/doctorinfo"><input type="button" class="btn btn-warning btn-block" style="margin: 0 3px 0 3px" value="查看所有医生" /></a>
                        <input type="button" class="btn btn-primary btn-block" style="margin: 0 3px 0 3px" data-bs-toggle="modal" data-bs-target="#insertDoctorModal" value="新增一位医生" />
                    </li>
                    <li class="list-group-item">查找到{{data1.doctors_count}}条结果</li>
                </ul>
            </div>
        </div>

        <div class="mt-3" id="content">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>职工号</th>
                    <th>医生姓名</th>
                    <th>性别</th>
                    <th>所属科室</th>
                    <th>职称</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
                </thead>

                <tbody id="list">
                <tr v-for="(doctor, key) in data1.doctors" :key="key">
                    <td class="align-content-center">{{doctor.doctor_id}}</td>
                    <td class="align-content-center">{{doctor.doctor_name}}</td>
                    <td class="align-content-center">{{doctor.doctor_sex}}</td>
                    <td class="align-content-center">{{doctor.dep_no}} {{doctor.dep_name}}</td>
                    <td class="align-content-center">{{doctor.title_name}}</td>
                    <td class="align-content-center" v-if="doctor.valid_flag === 1">启用</td>
                    <td class="align-content-center" v-else>停用</td>
                    <td class="align-content-center">
                        <input type="button" @click="clickUpdate(doctor.doctor_id)" class="btn btn-primary btn-block" style="margin: 0 3px 0 3px" data-bs-toggle="modal" data-bs-target="#updateDoctorModal" value="修改" />
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