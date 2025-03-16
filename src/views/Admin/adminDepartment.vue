<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import {useRoute} from 'vue-router';
import $ from 'jquery'
import config from "@/config/config";

let requestParam_p = Number(useRoute().query.p);
if (isNaN(requestParam_p)) requestParam_p = 1;            //地址中的p参数

const data1 = reactive({
    all_departments: [],
    departments: [],
    departments_count: -1,
    pages_count: -1,
    current: -1,
});

const updateDepartmentModalFormData = reactive({
    dep_no: -1,
    dep_name: '',
    dep_description: '',
    valid_flag: -1,
    create_time: '',
    create_user: ''
});

const insertDepartmentModalFormData = reactive({
    dep_name: '',
    dep_description: '',
    valid_flag: Number(1),
});

const transferModalSubmit = reactive({
    source: -1,
    target: -1
});

const departmentDoctorsInfo = reactive({
    title: '',
    doctors: []
});

function submitInsert() {
    axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/departments/insert`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            dep_no: Number(0),
            dep_name: insertDepartmentModalFormData.dep_name,
            dep_description: insertDepartmentModalFormData.dep_description,
            valid_flag: insertDepartmentModalFormData.valid_flag
        }
    }).then(response => {
        alert(response.data.message);
        if (response.data.status === 'ok') {
            $('#closeInsertDepartmentModal').click();
            window.location.reload();
        }

    }).catch(error => {
        console.log(error);
    });
}

async function submitTransfer() {
    const source_dep_resp = await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/departments/getDepartment`,
        method: 'get',
        params: {
            dep_no: transferModalSubmit.source
        }
    });
    const target_dep_resp = await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/departments/getDepartment`,
        method: 'get',
        params: {
            dep_no: transferModalSubmit.target
        }
    });
    console.log(source_dep_resp);

    if (!confirm(`确定要迁移${source_dep_resp.data.dep_no} ${source_dep_resp.data.dep_name}的所有医生到${source_dep_resp.data.dep_no} ${target_dep_resp.data.dep_name}吗？`)) {
        return;
    }

    axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/departments/transfer`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            source: transferModalSubmit.source,
            target: transferModalSubmit.target
        }
    }).then(response => {
        alert(response.data.message);
        if (response.data.status === 'ok') {
            $('#closeTransferDoctorsModal').click();
            window.location.reload();
        }
    }).catch(error => {
        console.log(error);
    });
}

function submitUpdate() {
    axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/departments/update`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            dep_no: Number(updateDepartmentModalFormData.dep_no),
            dep_name: updateDepartmentModalFormData.dep_name,
            dep_description: updateDepartmentModalFormData.dep_description,
            valid_flag: updateDepartmentModalFormData.valid_flag
        }
    }).then(response => {
        alert(response.data.message)
        if (response.data.status === 'ok') {
            $('#closeUpdateDepartmentModal').click();
            window.location.reload();
        }
    }).catch(error => {
        console.log(error);
    });

}

function clickUpdate(dep_no) {
    axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/departments/getDepartment`,
        method: 'get',
        params: {
            dep_no : Number(dep_no)
        }
    }).then(response => {
        updateDepartmentModalFormData.dep_no = dep_no;
        updateDepartmentModalFormData.dep_name = response.data.dep_name;
        updateDepartmentModalFormData.dep_description = response.data.dep_description;
        updateDepartmentModalFormData.valid_flag = response.data.valid_flag;
        updateDepartmentModalFormData.create_time = response.data.create_time;
        updateDepartmentModalFormData.create_user = response.data.create_user;
    }).catch(error => {
        console.log(error);
    });
}

function clickDisplayDoctorsOfDepartment(dep_no, dep_name) {
    departmentDoctorsInfo.title = `${dep_name}医生列表`;
    axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/departments/getDoctors`,
        method: 'get',
        params: {
            dep_no : Number(dep_no)
        }
    }).then(response => {
        departmentDoctorsInfo.doctors = response.data;
    }).catch(error => {
        console.log(error);
    });

}

onMounted(async () => {
    const data1Response = await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/departments`,
        method: 'get',
        params: {
            p: requestParam_p
        }
    });
    data1.all_departments = data1Response.data.all_departments;
    data1.departments = data1Response.data.departments;
    data1.departments_count = data1Response.data.departments_count;
    data1.pages_count = data1Response.data.pages_count;
    data1.current = data1Response.data.current;


    let previous;
    let next;
    if (requestParam_p ===  1) {
        previous = '<li class="page-item"><a class="page-link" href="" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>';
    }
    else {
        previous = `<li class="page-item"><a class="page-link" href="departments?p=${requestParam_p - 1}" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>`;
    }
    $('#page_navbtn').append(previous);
    for (let i = 1; i <= data1.pages_count; i++) {
        let navbtn1 = `<li class="page-item"><a class="page-link" href="departments?p=${i}">${i}</a></li>`;
        $('#page_navbtn').append(navbtn1);
    }
    if (requestParam_p === data1.pages_count) {
        next = '<li class="page-item"><a class="page-link" href="" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>';
    }
    else {
        next = `<li class="page-item"><a class="page-link" href="departments?p=${requestParam_p + 1}" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>`;
    }
    $('#page_navbtn').append(next);
});

</script>

<template>
    <div class="modal fade" id="updateDepartmentModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">修改科室信息</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitUpdate" >
                        <div class="input-group mb-3">
                            <span class="input-group-text">科室编号</span>
                            <input type="text" class="form-control" placeholder="科室编号" v-model="updateDepartmentModalFormData.dep_no"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">科室名称</span>
                            <input type="text" class="form-control" placeholder="科室名称" v-model="updateDepartmentModalFormData.dep_name"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">科室简介</span>
                            <input type="text" class="form-control" placeholder="科室简介" v-model="updateDepartmentModalFormData.dep_description"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">科室有效性</span>
                            <select class="form-select form-control" v-model="updateDepartmentModalFormData.valid_flag">
                                <option value="1">有效</option>
                                <option value="0">无效</option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">科室创建时间</span>
                            <input type="text" class="form-control" name="update_create_time" disabled readonly v-model="updateDepartmentModalFormData.create_time"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">科室创建者</span>
                            <input type="text" class="form-control" name="update_create_user" disabled readonly v-model="updateDepartmentModalFormData.create_user"/>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" value="提交修改" />
                            <input type="button" class="btn btn-danger btn-block" id="closeUpdateDepartmentModal" data-bs-dismiss="modal" value="取消"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!--模态框，点击新增一个科室信息 -->
    <div class="modal fade" id="insertDepartmentModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">新增科室</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitInsert">
                        <div class="input-group mb-3">
                            <span class="input-group-text">科室编号</span>
                            <input type="text" class="form-control" value="科室编号自动生成" disabled readonly style="font-style: italic"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">科室名称</span>
                            <input type="text" class="form-control" placeholder="科室名称" v-model="insertDepartmentModalFormData.dep_name"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">科室简介</span>
                            <input type="text" class="form-control" placeholder="科室简介" v-model="insertDepartmentModalFormData.dep_description"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">科室有效性</span>
                            <select class="form-select form-control" v-model="insertDepartmentModalFormData.valid_flag">
                                <option value="1">有效</option>
                                <option value="0">无效</option>
                            </select>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" value="提交" />
                            <input type="button" class="btn btn-danger btn-block" id="closeInsertDepartmentModal" data-bs-dismiss="modal" value="取消"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!--模态框，显示一个科室下的所有医生 -->
    <div class="modal fade" id="DepartmentDoctorsModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">{{departmentDoctorsInfo.title}}</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <div v-if="departmentDoctorsInfo.doctors.length > 0">
                        <ul class="list-group">
                            <li v-for="(doctor, key) in departmentDoctorsInfo.doctors" :key="key" class="list-group-item">
                                {{doctor.doctor_id}}  {{doctor.doctor_name}}  {{doctor.title_name}}
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        暂无医生
                    </div>
                </div>

                <div class="modal-footer">
                    <input type="button" class="btn btn-danger btn-block" name="cancel" data-bs-dismiss="modal" value="关闭"/>
                </div>
            </div>
        </div>
    </div>

    <!-- 模态框，迁移医生 -->
    <div class="modal fade" id="transferDoctorsModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">迁移一个科室的所有医生</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitTransfer">
                        <div class="input-group mb-3">
                            <span class="input-group-text">源科室</span>
                            <select class="form-select" v-model="transferModalSubmit.source">
                                <option value="-1">请选择...</option>
                                <option v-for="(department, key) in data1.all_departments" :key="key" :value="department.dep_no">{{department.dep_no}} {{department.dep_name}} </option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">目标科室</span>
                            <select class="form-select" v-model="transferModalSubmit.target">
                                <option value="-1">请选择...</option>
                                <option v-for="(department, key) in data1.all_departments" :key="key" :value="department.dep_no">{{department.dep_no}} {{department.dep_name}}</option>
                            </select>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" value="迁移" />
                            <input type="button" class="btn btn-danger btn-block" id="closeTransferDoctorsModal" data-bs-dismiss="modal" value="取消"/>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>

    <adminNav></adminNav>



    <div class="container">
        <div class="row mt-3">
            <div class="col-12">
                <ul class="list-group list-group-horizontal">
                    <li class="list-group-item">
                        <input type="button" class="btn btn-primary btn-block" style="margin: 0 3px 0 3px" data-bs-toggle="modal" data-bs-target="#insertDepartmentModal" value="新增科室" />
                        <input type="button" class="btn btn-danger btn-block" data-bs-toggle="modal" data-bs-target="#transferDoctorsModal" style="margin: 0 3px 0 3px" value="迁移一个科室的所有医生" />
                    </li>
                </ul>
            </div>
        </div>

        <div class="mt-3" id="content">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>科室编号</th>
                    <th>科室名称</th>
                    <th>科室创建日期</th>
                    <th>科室有效性</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="list">
                    <tr v-for="(department, key) in data1.departments" :key="key">
                        <td class="align-content-center">{{(requestParam_p - 1) * 10 + key + 1}}</td>
                        <td class="align-content-center">{{department.dep_no}}</td>
                        <td class="align-content-center">{{department.dep_name}}</td>
                        <td class="align-content-center">{{department.create_time}}</td>
                        <td class="align-content-center" v-if="department.valid_flag === 1">是</td>
                        <td class="align-content-center" v-else>否</td>
                        <td class="align-content-center">
                            <input type="button" @click="clickUpdate(department.dep_no)" data-bs-toggle="modal" data-bs-target="#updateDepartmentModal" class="btn btn-primary btn-block" style="margin: 0 3px 0 3px" value="修改" />
                            <input type="button" @click="clickDisplayDoctorsOfDepartment(department.dep_no, department.dep_name)" data-bs-toggle="modal" data-bs-target="#DepartmentDoctorsModal" class="btn btn-secondary btn-block" style="margin: 0 3px 0 3px" value="查看该科室所有医生" />
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