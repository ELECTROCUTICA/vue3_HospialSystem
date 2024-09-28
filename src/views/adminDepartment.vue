<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';

const data1 = reactive({
    department: []
});

const updateModalInfo = reactive({
    dep_no: '',
    dep_name: ''
});


const insertModalInfo = reactive({
    dep_no: '',
    dep_name: ''
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
        url: 'http://localhost:8080/admin/department/insert',
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            dep_no: Number(insertModalInfo.dep_no),
            dep_name: insertModalInfo.dep_name

        }
    }).then(response => {
        alert(response.data.message);
        if (response.data.state === 'ok') {
            window.location.reload();
        }

    }).catch(error => {
        console.log(error);
    });
}

function submitTransfer() {
    axios({
        url: 'http://localhost:8080/admin/department/transfer',
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
        if (response.data.state === 'ok') {
            window.location.reload();
        }
    }).catch(error => {
        console.log(error);
    });
}

function submitUpdate() {
    axios({
        url: 'http://localhost:8080/admin/department/update',
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            dep_no: Number(updateModalInfo.dep_no),
            dep_name: updateModalInfo.dep_name
        }
    }).then(response => {
        alert(response.data.message)
        if (response.data.state === 'ok') {
            window.location.reload();
        }
    }).catch(error => {
        console.log(error);
    });

}

function clickUpdate(dep_no, dep_name) {
    updateModalInfo.dep_no = dep_no;
    updateModalInfo.dep_name = dep_name;
}

function clickDisplayDoctorsOfDepartment(dep_no, dep_name) {
    departmentDoctorsInfo.title = dep_name
    axios({
        url: 'http://localhost:8080/admin/department/getDoctors',
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
        url: 'http://localhost:8080/admin/interface/getDepartments',
        method: 'get',
    });
    data1.departments = data1Response.data;
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
                            <input type="text" class="form-control" name="dep_no" placeholder="科室编号" v-model="updateModalInfo.dep_no"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">科室名称</span>
                            <input type="text" class="form-control" name="dep_name" placeholder="科室名称" v-model="updateModalInfo.dep_name"/>
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
                            <input type="text" class="form-control" name="dep_no" placeholder="科室编号" v-model="insertModalInfo.dep_no"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">科室名称</span>
                            <input type="text" class="form-control" name="dep_name" placeholder="科室名称" v-model="insertModalInfo.dep_name"/>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" name="insert" id="insert" value="提交" />
                            <input type="button" class="btn btn-danger btn-block" name="cancel" data-bs-dismiss="modal" value="取消"/>
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
                    <h4 class="modal-title" id="modalTitle2">{{departmentDoctorsInfo.title}}</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <div v-if="departmentDoctorsInfo.doctors.length > 0">
                        <ul class="list-group" id="doctorsList">
                            <li v-for="(doctor, key) in departmentDoctorsInfo.doctors" :key="key" class="list-group-item">
                                {{doctor.id}}  {{doctor.name}}  {{doctor.title}}
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
                            <select class="form-select" id="source" v-model="transferModalSubmit.source">
                                <option value="-1">请选择...</option>
                                <option v-for="(department, key) in data1.departments" :key="key" :value="department.dep_no">{{department.dep_name}}</option>
                            </select>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">目标科室</span>
                            <select class="form-select" id="target" v-model="transferModalSubmit.target">
                                <option value="-1">请选择...</option>
                                <option v-for="(department, key) in data1.departments" :key="key" :value="department.dep_no">{{department.dep_name}}</option>
                            </select>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" name="gotransfer" id="gotransfer" value="迁移" />
                            <input type="button" class="btn btn-danger btn-block" name="cancel" data-bs-dismiss="modal" value="取消"/>
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
                <ul id="bar" class="list-group list-group-horizontal">
                    <li class="list-group-item">
                        <input type="button" class="btn btn-primary btn-block" style="margin: 0 3px 0 3px" data-bs-toggle="modal" data-bs-target="#insertDepartmentModal" name="insertDepartment" id="insertDepartment" value="新增科室" />
                        <input type="button" class="btn btn-danger btn-block" data-bs-toggle="modal" data-bs-target="#transferDoctorsModal" style="margin: 0 3px 0 3px" name="transfer" id="transfer" value="迁移一个科室的所有医生" />
                    </li>
                </ul>
            </div>

        </div>

        <div class="mt-3" id="content">
            <table class="table table-hover">
                <thead>
                <tr>
                    <th>科室编号</th>
                    <th>科室名称</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody id="list">
                    <tr v-for="(department, key) in data1.departments" :key="key">
                        <td>{{department.dep_no}}</td>
                        <td>{{department.dep_name}}</td>
                        <td>
                            <input type="button" @click="clickUpdate(department.dep_no, department.dep_name)" data-bs-toggle="modal" data-bs-target="#updateDepartmentModal" class="btn btn-primary btn-block" style="margin: 0 3px 0 3px" name="editDepartment" value="修改科室信息" />
                            <input type="button" @click="clickDisplayDoctorsOfDepartment(department.dep_no, department.dep_name)"  data-bs-toggle="modal" data-bs-target="#DepartmentDoctorsModal" class="btn btn-secondary btn-block" style="margin: 0 3px 0 3px" name="displayDepartmentDoctors" value="查看该科室所有医生" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>

<style scoped>

</style>