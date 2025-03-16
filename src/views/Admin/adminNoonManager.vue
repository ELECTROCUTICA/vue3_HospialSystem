<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import $ from "jquery";
import config from "@/config/config";

const data1 = reactive({
    noons: [],
    begin_time_str: [],
    end_time_str: []
});

const insertNoonModalFormData = reactive({
    noon_name: '',
    begin_time_hour: 0,
    begin_time_minute: 0,
    end_time_hour: 0,
    end_time_minute: 0,
    noon_memo: '',
    valid_flag: 1
});

const updateNoonModalFormData = reactive({
    noon_id: -1,
    noon_name: '',
    begin_time_hour: -1,
    begin_time_minute: -1,
    end_time_hour: -1,
    end_time_minute: -1,
    noon_memo: '',
    valid_flag: 1
});

onMounted(async () => {
    const data1Response = await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/noonManager`,
        method: 'get'
    });
    data1.noons = data1Response.data.noons;
    data1.begin_time_str = data1Response.data.begin_time_str;
    data1.end_time_str = data1Response.data.end_time_str;
});

async function submitInsert() {
    await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/noonManager/insert`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            noon_id: 0,
            noon_name: insertNoonModalFormData.noon_name,
            begin_time_hour: insertNoonModalFormData.begin_time_hour,
            begin_time_minute: insertNoonModalFormData.begin_time_minute,
            end_time_hour: insertNoonModalFormData.end_time_hour,
            end_time_minute: insertNoonModalFormData.end_time_minute,
            noon_memo: insertNoonModalFormData.noon_memo,
            valid_flag: insertNoonModalFormData.valid_flag
        }
    }).then((response) => {
        alert(response.data.message);
        if (response.data.status === 'ok') {
            $('#closeInsertNoonModal').click();
            window.location.reload();
        }
    });
}

async function clickUpdate(noon_id) {
    await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/noonManager/getNoon`,
        method: 'get',
        params: {
            noon_id: noon_id,
        }
    }).then((response) => {
        updateNoonModalFormData.noon_id = response.data.noon_id;
        updateNoonModalFormData.noon_name = response.data.noon_name;
        updateNoonModalFormData.begin_time_hour = response.data.begin_time_hour;
        updateNoonModalFormData.begin_time_minute = response.data.begin_time_minute;
        updateNoonModalFormData.end_time_hour = response.data.end_time_hour;
        updateNoonModalFormData.end_time_minute = response.data.end_time_minute;
        updateNoonModalFormData.noon_memo = response.data.noon_memo;
        updateNoonModalFormData.valid_flag = response.data.valid_flag;
    });
}

async function submitUpdate() {
    await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/noonManager/update`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            noon_id: updateNoonModalFormData.noon_id,
            noon_name: updateNoonModalFormData.noon_name,
            begin_time_hour: updateNoonModalFormData.begin_time_hour,
            begin_time_minute: updateNoonModalFormData.begin_time_minute,
            end_time_hour: updateNoonModalFormData.end_time_hour,
            end_time_minute: updateNoonModalFormData.end_time_minute,
            noon_memo: updateNoonModalFormData.noon_memo,
            valid_flag: updateNoonModalFormData.valid_flag
        }
    }).then((response) => {
        alert(response.data.message);
        if (response.data.status === 'ok') {
            $('#closeInsertNoonModal').click();
            window.location.reload();
        }
    });
}


</script>

<template>
    <div class="modal fade" id="insertNoonModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">新增午别</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitInsert">
                        <div class="input-group mb-3">
                            <span class="input-group-text">午别ID</span>
                            <input type="text" class="form-control" value="午别ID自动生成" readonly disabled style="font-style: italic"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">午别名称</span>
                            <input type="text" class="form-control" placeholder="午别名称" v-model="insertNoonModalFormData.noon_name" />
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">开始时间</span>
                            <select class="form-select form-control" v-model="insertNoonModalFormData.begin_time_hour">
                                <option v-for="num in 24" :key="num - 1" :value="num - 1">{{num - 1}}</option>
                            </select>
                            <span class="form-control">时</span>
                            <select class="form-select form-control" v-model="insertNoonModalFormData.begin_time_minute">
                                <option v-for="num in 60" :key="num - 1" :value="num - 1">{{num - 1}}</option>
                            </select>
                            <span class="form-control">分</span>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">结束时间</span>
                            <select class="form-select form-control" v-model="insertNoonModalFormData.end_time_hour">
                                <option v-for="num in 24" :key="num - 1" :value="num - 1">{{num - 1}}</option>
                            </select>
                            <span class="form-control">时</span>
                            <select class="form-select form-control" v-model="insertNoonModalFormData.end_time_minute">
                                <option v-for="num in 60" :key="num - 1" :value="num - 1">{{num - 1}}</option>
                            </select>
                            <span class="form-control">分</span>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">备注</span>
                            <input type="text" class="form-control" placeholder="午别备注" v-model="insertNoonModalFormData.noon_memo" />
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">午别有效性</span>
                            <select class="form-select form-control" v-model="insertNoonModalFormData.valid_flag">
                                <option :value="1">有效</option>
                                <option :value="0">无效</option>
                            </select>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" value="提交" />
                            <input type="button" class="btn btn-danger btn-block" id="closeInsertNoonModal" data-bs-dismiss="modal" value="取消"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="updateNoonModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">修改午别</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitUpdate">
                        <div class="input-group mb-3">
                            <span class="input-group-text">午别ID</span>
                            <input type="text" class="form-control" readonly disabled v-model="updateNoonModalFormData.noon_id"/>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">午别名称</span>
                            <input type="text" class="form-control" placeholder="午别名称" v-model="updateNoonModalFormData.noon_name" />
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">开始时间</span>
                            <select class="form-select form-control" v-model="updateNoonModalFormData.begin_time_hour">
                                <option v-for="num in 24" :key="num - 1" :value="num - 1">{{num - 1}}</option>
                            </select>
                            <span class="form-control">时</span>
                            <select class="form-select form-control" v-model="updateNoonModalFormData.begin_time_minute">
                                <option v-for="num in 60" :key="num - 1" :value="num - 1">{{num - 1}}</option>
                            </select>
                            <span class="form-control">分</span>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">结束时间</span>
                            <select class="form-select form-control" v-model="updateNoonModalFormData.end_time_hour">
                                <option v-for="num in 24" :key="num - 1" :value="num - 1">{{num - 1}}</option>
                            </select>
                            <span class="form-control">时</span>
                            <select class="form-select form-control" v-model="updateNoonModalFormData.end_time_minute">
                                <option v-for="num in 60" :key="num - 1" :value="num - 1">{{num - 1}}</option>
                            </select>
                            <span class="form-control">分</span>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">备注</span>
                            <input type="text" class="form-control" placeholder="午别备注" v-model="updateNoonModalFormData.noon_memo" />
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">午别有效性</span>
                            <select class="form-select form-control" v-model="updateNoonModalFormData.valid_flag">
                                <option value="1">有效</option>
                                <option value="0">无效</option>
                            </select>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" value="提交" />
                            <input type="button" class="btn btn-danger btn-block" id="closeUpdateNoonModal" data-bs-dismiss="modal" value="取消"/>
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
                        <input type="button" class="btn btn-primary btn-block" data-bs-toggle="modal" data-bs-target="#insertNoonModal" style="margin: 0 3px 0 3px" value="新增午别"/>
                    </li>
                </ul>
            </div>
        </div>

        <div class="mt-3" id="content">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>午别ID</th>
                    <th>午别名称</th>
                    <th>开始时间</th>
                    <th>结束时间</th>
                    <th>备注</th>
                    <th>有效性</th>
                    <th>操作</th>
                </tr>
                </thead>

                <tbody id="list">
                <tr v-for="(noon, key) in data1.noons" :key="key">
                    <td class="align-content-center">{{noon.noon_id}}</td>
                    <td class="align-content-center">{{noon.noon_name}}</td>
                    <td class="align-content-center">{{data1.begin_time_str[key]}}</td>
                    <td class="align-content-center">{{data1.end_time_str[key]}}</td>
                    <td class="align-content-center">{{noon.noon_memo}}</td>
                    <td class="align-content-center" v-if="noon.valid_flag === 1">是</td>
                    <td class="align-content-center" v-else>否</td>
                    <td>
                        <input type="button" @click="clickUpdate(noon.noon_id)" data-bs-toggle="modal" data-bs-target="#updateNoonModal" class="btn btn-primary btn-block" style="margin: 0 3px 0 3px" value="修改" />
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