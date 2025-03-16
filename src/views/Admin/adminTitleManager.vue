<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import $ from 'jquery';
import config from "@/config/config";

const data1 = reactive({
    titles: []
});

const insertTitleFormData = reactive({
    title_name: '',
    valid_flag: 1
});

const updateTitleFormData = reactive({
    title_no: -1,
    title_name: '',
    valid_flag: -1
});

const submitInsert = async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/titleManager/insert`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            title_no: 0,
            title_name: insertTitleFormData.title_name,
            valid_flag: insertTitleFormData.valid_flag
        }
    }).then((response) => {
        alert(response.data.message);
        if (response.data.status === 'ok') {
            $('#closeInsertTitleModal').click();
            window.location.reload();
        }
    }).catch((error) => {
        console.log(error);
    });
}

function clickUpdate(title_no) {
    axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/titleManager/getTitle`,
        method: 'get',
        params: {
            title_no: title_no,
        }
    }).then((response) => {
        updateTitleFormData.title_no = title_no;
        updateTitleFormData.title_name = response.data.title_name;
        updateTitleFormData.valid_flag = response.data.valid_flag;
        console.log(updateTitleFormData);
    }).catch((error) => {
        console.log(error);
    });
}

function submitUpdate() {
    axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/titleManager/update`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            title_no: updateTitleFormData.title_no,
            title_name: updateTitleFormData.title_name,
            valid_flag: updateTitleFormData.valid_flag
        }
    }).then((response) => {
        alert(response.data.message);
        if (response.data.status === 'ok') {
            $('#closeUpdateTitleModal').click();
            window.location.reload();
        }
    }).catch((error) => {
        console.log(error);
    });
}



onMounted(async () => {
    const data1Response = await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/titleManager`,
        method: 'get'
    });
    data1.titles = data1Response.data;
});



</script>

<template>

    <div class="modal fade" id="insertTitleModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">新增职称</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitInsert">
                        <div class="input-group mb-3">
                            <span class="input-group-text">职称编号</span>
                            <input type="text" class="form-control" value="职称编号自动生成" readonly disabled style="font-style: italic"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">职称名称</span>
                            <input type="text" class="form-control" placeholder="职称名称" v-model="insertTitleFormData.title_name" />
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">职称有效性</span>
                            <select class="form-select form-control" v-model="insertTitleFormData.valid_flag">
                                <option value="1">有效</option>
                                <option value="0">无效</option>
                            </select>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" value="提交" />
                            <input type="button" class="btn btn-danger btn-block" id="closeInsertTitleModal" data-bs-dismiss="modal" value="取消"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade" id="updateTitleModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">修改职称 {{updateTitleFormData.title_name}}</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitUpdate">
                        <div class="input-group mb-3">
                            <span class="input-group-text">职称编号</span>
                            <input type="text" class="form-control" readonly disabled v-model="updateTitleFormData.title_no" />
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">职称名称</span>
                            <input type="text" class="form-control" placeholder="职称名称" v-model="updateTitleFormData.title_name" />
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">职称有效性</span>
                            <select class="form-select form-control" v-model="updateTitleFormData.valid_flag">
                                <option :value="1">有效</option>
                                <option :value="0">无效</option>
                            </select>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" id="update" name="update" value="提交" />
                            <input type="button" class="btn btn-danger btn-block" id="closeUpdateTitleModal" data-bs-dismiss="modal" value="取消"/>
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
                        <input type="button" class="btn btn-primary btn-block" data-bs-toggle="modal" data-bs-target="#insertTitleModal" style="margin: 0 3px 0 3px" value="新增职称"/>
                    </li>
                </ul>
            </div>
        </div>

        <div class="mt-3" id="content">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>职称ID</th>
                    <th>职称名</th>
                    <th>有效性</th>
                    <th>操作</th>
                </tr>
                </thead>

                <tbody id="list">
                <tr v-for="(title, key) in data1.titles" :key="key">
                    <td class="align-content-center">{{title.title_no}}</td>
                    <td class="align-content-center">{{title.title_name}}</td>
                    <td class="align-content-center" v-if="title.valid_flag === 1">是</td>
                    <td class="align-content-center" v-else>否</td>
                    <td>
                        <input type="button" @click="clickUpdate(title.title_no)" data-bs-toggle="modal" data-bs-target="#updateTitleModal" class="btn btn-primary btn-block" style="margin: 0 3px 0 3px" value="修改" />
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