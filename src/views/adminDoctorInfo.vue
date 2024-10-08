<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import $ from 'jquery';
import { Modal } from 'bootstrap';

let requestParam_p = Number(useRoute().query.p);
if (isNaN(requestParam_p)) requestParam_p = 1;            //地址中的p参数
let requestParam_keyword = useRoute().query.keyword;            //地址中的keyword参数

const keyword = reactive({
    content: requestParam_keyword,            //搜索文本框内容
});

const data1 = reactive({
    departments: [],
    doctors: [],
    current: -1,
    pages_count: -1,
    doctors_count: -1
});

const updateModalInfo = reactive({
    id: '',
    name: '',
    sex: '',
    dep_no: '',
    password: '',
    title: '',
    description: ''
});

const insertModalInfo = reactive({
    id: '',
    name: '',
    sex: 'default',
    dep_no: 'default',
    password: '',
    title: '',
    description: ''
});


onMounted(async () => {
    const data1Response = await axios({
        url: 'http://localhost:8080/admin/interface/doctorinfo',
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

    let previous;
    let next;
    if (requestParam_keyword === null || requestParam_keyword === undefined || requestParam_keyword === '') {
        if (requestParam_p ===  1) {
            previous = '<li class="page-item"><a class="page-link" href="" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>';
        }
        else {
            previous = '<li class="page-item"><a class="page-link" href="doctorinfo?p=' + (requestParam_p - 1) + '" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>';
        }
        $('#page_navbtn').append(previous);
        for (var i = 1; i <= data1.pages_count; i++) {
            var navbtn1 = '<li class="page-item"><a class="page-link" href="doctorinfo?p=' + i + '">' + i + '</a></li>';
            $('#page_navbtn').append(navbtn1);
        }
        if (requestParam_p === data1.pages_count) {
            next = '<li class="page-item"><a class="page-link" href="" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>';
        }
        else {
            next = '<li class="page-item"><a class="page-link" href="doctorinfo?p=' + (requestParam_p + 1) + '" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>';
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
            previous = '<li class="page-item"><a class="page-link" href="doctorinfo?p=' + (requestParam_p - 1) + '&keyword=' + requestParam_keyword + '" aria-label="<"><span aria-hidden="true">&laquo;</span></a></li>';
        }
        $('#page_navbtn').append(previous);
        for (var j = 1; j <= data1.pages_count; j++) {
            var navbtn2 = '<li class="page-item"><a class="page-link" href="doctorinfo?p=' + j + '&keyword=' + requestParam_keyword + '">' + j + '</a></li>';
            $('#page_navbtn').append(navbtn2);
        }
        if (requestParam_p === data1.pages_count) {
            next = '<li class="page-item"><a class="page-link" href="" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>';
        }
        else {
            next = '<li class="page-item"><a class="page-link" href="doctorinfo?p=' + (requestParam_p + 1) + '&keyword=' + requestParam_keyword + '" aria-label=">"><span aria-hidden="true">&raquo;</span></a></li>';
        }
        $('#page_navbtn').append(next);
    }

});

function clickUpdate(id) {
    axios({
        url: 'http://localhost:8080/admin/doctorinfo/getDoctor',
        method: 'get',
        params: {
            id: id
        }
    }).then(response => {
        updateModalInfo.id = response.data.id;
        updateModalInfo.name = response.data.name;
        updateModalInfo.sex = response.data.sex;
        updateModalInfo.dep_no = response.data.dep_no;
        updateModalInfo.password = response.data.password;
        updateModalInfo.title = response.data.title;
        updateModalInfo.description = response.data.description;

        const modal = new Modal($('#updateDoctorModal'));
        modal.show();
    }).catch(error => {
        console.log(error);
    });
}

function submitUpdate() {
    axios({
        url: 'http://localhost:8080/admin/doctorinfo/update',
        method: 'get',
        params: {
            id: updateModalInfo.id,
            name: updateModalInfo.name,
            sex: updateModalInfo.sex,
            dep_no: Number(updateModalInfo.dep_no),
            password: updateModalInfo.password,
            title: updateModalInfo.title,
            description: updateModalInfo.description
        }
    }).then(response => {
        alert(response.data.message);
        const modal = new Modal($('#updateDoctorModal'));
        modal.hide();
        window.location.reload();

    }).catch(error => {
        console.log(error);
    });
}

function clickInsert() {
    const modal = new Modal($('#insertDoctorModal'));
    modal.show();
}

function submitInsert() {
    axios({
        url: 'http://localhost:8080/admin/doctorinfo/insert',
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            id: insertModalInfo.id,
            name: insertModalInfo.name,
            sex: insertModalInfo.sex,
            dep_no: Number(insertModalInfo.dep_no),
            password: insertModalInfo.password,
            title: insertModalInfo.title,
            description: insertModalInfo.description
        }
    }).then(response => {
        alert(response.data.message);
        const modal = new Modal($('#insertDoctorModal'));
        modal.hide();
        window.location.reload();

    }).catch(error => {
        console.log(error);
    });
}

function deleteDoctor(id, name) {
    if (confirm("确定要删除工号为" + id + " 的 " +  name + " 医生吗？")) {
        axios({
            url: 'http://localhost:8080/admin/doctorinfo/delete',
            method: 'get',
            params: {
                id: id
            }
        }).then(response => {
            alert(response.data.message);
            window.location.reload();

        }).catch(error => {
            console.log(error);
        });
    }
}

function search() {
    let base = '/admin/doctorinfo?p=1&keyword=';
    window.location.href= base + encodeURIComponent(keyword.content);
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

                    <form @submit.prevent="submitUpdate" id="updateForm" style="text-align: center">
                        <div class="input-group mb-3">
                            <span class="input-group-text">职工号</span>
                            <input type="text" class="form-control" name="id" id="id" placeholder="职工号" v-model="updateModalInfo.id" disabled/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">医生姓名</span>
                            <input type="text" class="form-control" name="name" id="name" placeholder="医生姓名" v-model="updateModalInfo.name"/>
                        </div>


                        <div class="input-group mb-3">
                            <span class="input-group-text">性别</span>
                            <select id="sex" name="sex" class="form-select form-control">
                                <option value="男">男</option>
                                <option value="女">女</option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">所属科室</span>
                            <select id="dep_no" name="dep_no" class="form-select form-control" v-model="updateModalInfo.dep_no">
                                <option v-for="(value, key) in data1.departments" :key="key" :value="value.dep_no" v-text="value.dep_name"></option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">职称</span>
                            <input type="text" class="form-control" name="title" id="title" placeholder="职称"  v-model="updateModalInfo.title"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">登录密码</span>
                            <input type="text" class="form-control" name="password" id="password" placeholder="登录密码"  v-model="updateModalInfo.password"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">简介</span>
                            <textarea id="description" name="new_description" class="form-control" rows="3" v-model="updateModalInfo.description"></textarea>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" name="update" id="update" value="提交修改" />
                            <input type="button" class="btn btn-danger btn-block" name="cancel" data-bs-dismiss="modal" value="取消"/>
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
                            <input type="text" class="form-control" name="new_id" id="new_id" placeholder="职工号" v-model="insertModalInfo.id"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">医生姓名</span>
                            <input type="text" class="form-control" name="new_name" id="new_name" placeholder="医生姓名" v-model="insertModalInfo.name"/>
                        </div>


                        <div class="input-group mb-3">
                            <span class="input-group-text">性别</span>
                            <select id="new_sex" name="new_sex" class="form-select form-control" v-model="insertModalInfo.sex">
                                <option value="default">请选择</option>
                                <option value="男">男</option>
                                <option value="女">女</option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">所属科室</span>
                            <select id="new_dep_no" name="new_dep_no" class="form-select form-control" v-model="insertModalInfo.dep_no">
                                <option value="default">请选择</option>
                                <option v-for="(value, key) in data1.departments" :key="key" :value="value.dep_no" v-text="value.dep_name"></option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">职称</span>
                            <input type="text" class="form-control" name="new_title" id="new_title" placeholder="职称" v-model="insertModalInfo.title"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">登录密码</span>
                            <input type="text" class="form-control" name="new_password" id="new_password" placeholder="登录密码" v-model="insertModalInfo.password"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">简介</span>
                            <textarea id="new_description" name="new_description" class="form-control" rows="3" v-model="insertModalInfo.description"></textarea>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" name="insert" id="insert" value="提交"/>
                            <input type="button" class="btn btn-danger btn-block" name="cancel" data-bs-dismiss="modal" value="取消"/>
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
                <input type="text" class="form-control col-8" name="keywordText" id="keywordText" placeholder="职工号/姓名搜索..." v-model="keyword.content"/>
                <input type="submit" class="btn btn-outline-success my-2 my-sm-0 col-3" name="search" id="search" value="搜索"/>
            </div>
        </form>


        <div class="row mt-3">
            <div class="col-12">
                <ul id="bar" class="list-group list-group-horizontal">
                    <li class="list-group-item">
                        <input type="button" class="btn btn-warning btn-block" name="goMain" style="margin: 0 3px 0 3px" id="goMain" value="查看所有医生" onclick="location.href='/admin/doctorinfo' "/>
                        <input type="button" @click="clickInsert" class="btn btn-primary btn-block" name="insertDoctor" style="margin: 0 3px 0 3px" id="insertDoctor" value="新增一位医生" />
                    </li>
                    <li class="list-group-item">查找到{{data1.doctors_count}}条结果</li>
                </ul>
            </div>
        </div>

        <div class="mt-3" id="content">
            <table class="table table-hover">
                <thead>
                <tr>
                    <th>职工号</th>
                    <th>医生姓名</th>
                    <th>性别</th>
                    <th>所属科室编号</th>
                    <th>所属科室名</th>
                    <th>职称</th>
                    <th>登录密码</th>
                    <th>操作</th>
                </tr>
                </thead>

                <tbody id="list">
                <tr v-for="(doctor, key) in data1.doctors" :key="key">
                    <td>{{doctor.id}}</td>
                    <td>{{doctor.name}}</td>
                    <td>{{doctor.sex}}</td>
                    <td>{{doctor.dep_no}}</td>
                    <td>{{doctor.dep_name}}</td>
                    <td>{{doctor.title}}</td>
                    <td>{{doctor.password}}</td>
                    <td>
                        <input type="button" @click="clickUpdate(doctor.id)" class="btn btn-primary btn-block" name="editDoctor" style="margin: 0 3px 0 3px" value="修改信息" />
                        <input type="button" @click="deleteDoctor(doctor.id, doctor.name)" class="btn btn-danger btn-block" name="deleteDoctor" style="margin: 0 3px 0 3px"  value="删除" />
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