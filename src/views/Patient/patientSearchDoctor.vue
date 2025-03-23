<script setup>
// eslint-disable-next-line no-unused-vars
import {reactive, ref, onMounted} from "vue";
import axios from "axios";
import config from "@/config/config";
import { Modal } from "bootstrap";
import $ from "jquery";


const keyword = ref(
    ''
);

const data1 = reactive({
    doctors: []
});

const message = reactive({
    value: ''
})

const doctor_detail_modal_data = reactive({
    doctor_name: '',
    doctor_title_name: '',
    doctor_description: '',
    dep_name: '',
    doctor_schedule: []
})

const submitRegistrationFormData = reactive({
    schedule_id: 0,
    doctor_id: 0,
    date: '',
    noon_id: ''
});

let messageModal = null;

const searchDoctor = async () => {
    if (keyword.value === '' || keyword.value === undefined) {
        message.value = '请先输入关键词';
        messageModal.show();
        return;
    }

    const resp = await axios({
        url: `${config.spring_cloud_gateway_url}app/patient/searchDoctor/search`,
        method: 'get',
        params: {
            keyword: keyword.value
        }
    });
    data1.doctors = resp.data;
    if (data1.doctors.length === 0) {
        message.value = '没有查找到相关医生';
        messageModal.show();
    }
};

const clickShowRegisterModal = async (ds) => {
    const modal = new Modal($('#submitRegistrationModal'));
    modal.show();

    submitRegistrationFormData.schedule_id = ds.schedule_id;
    submitRegistrationFormData.doctor_id = ds.doctor_id;
    submitRegistrationFormData.date = ds.work_date;
    submitRegistrationFormData.noon_id = ds.noon_id;

    $('#doctor_info').val(`${ds.doctor_name} ${ds.dep_name} ${ds.title_name}`);
    $('#visit_time').val(`${ds.work_date} ${ds.noon_name} ${ds.begin_time_hour}:${complement(ds.begin_time_minute)}-${ds.end_time_hour}:${complement(ds.end_time_minute)}`);
};

const submitRegistration = async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}app/patient/registration/submit`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            schedule_id: submitRegistrationFormData.schedule_id,
            doctor_id: submitRegistrationFormData.doctor_id,
            date: submitRegistrationFormData.date,
            noon_id: submitRegistrationFormData.noon_id
        }
    }).then((response) => {
        alert(response.data.message);
        $('#closeSubmitRegistrationModal').click();
    });
};

const displayDetail = async (obj) => {
    doctor_detail_modal_data.doctor_schedule = [];
    doctor_detail_modal_data.doctor_name = obj.doctor_name;
    doctor_detail_modal_data.doctor_title_name = obj.title_name;
    doctor_detail_modal_data.doctor_description = obj.doctor_description;
    doctor_detail_modal_data.dep_name = obj.dep_name;

    const start_date = new Date();
    const end_date = new Date(new Date().setDate(start_date.getDate() + 7));
    const resp = await axios({
        url: `${config.spring_cloud_gateway_url}app/patient/searchDoctor/getDoctorSchedule`,
        method: 'get',
        params: {
            doctor_id: obj.doctor_id,
            start_date: `${start_date.getFullYear()}-${complement(start_date.getMonth()+1)}-${complement(start_date.getDate())}`,
            end_date: `${end_date.getFullYear()}-${complement(end_date.getMonth()+1)}-${complement(end_date.getDate())}`
        }
    });
    doctor_detail_modal_data.doctor_schedule = resp.data;
};

onMounted(async () => {
    messageModal = new Modal($('#MessageModal'));
});

const complement = (value) => {
    return value < 10 ? `0${value}` : value.toString()
}

</script>

<template>
    <div class="modal fade" id="MessageModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="DescriptionTitle">通知</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>{{ message.value }}</p>
                </div>

                <div class="modal-footer">
                    <input type="button" class="btn btn-danger btn-block" data-bs-dismiss="modal" value="确定"/>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="displayDetail" tabindex="-1">
        <div class="modal-dialog modal-custom">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">医生详情 {{doctor_detail_modal_data.doctor_name}}</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <div class="input-group mb-3">
                        <span class="input-group-text">医生姓名</span>
                        <input type="text" class="form-control" disabled v-model="doctor_detail_modal_data.doctor_name">
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">医生职称</span>
                        <input type="text" class="form-control" disabled v-model="doctor_detail_modal_data.doctor_title_name">
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">出诊科室</span>
                        <input type="text" class="form-control" disabled v-model="doctor_detail_modal_data.dep_name">
                    </div>

                    <div class="input-group mb-3">
                        <textarea class="form-control" rows="3" readonly v-model="doctor_detail_modal_data.doctor_description"></textarea>
                    </div>


                    <span class="input-group-text">近7天出诊计划</span>
                    <ul class="list-group" v-if="doctor_detail_modal_data.doctor_schedule.length > 0">
                        <li v-for="(ds, key) in doctor_detail_modal_data.doctor_schedule" :key="key" class="list-group-item list-group-item-action p-2">
                            {{ds.work_date}} {{ds.noon_name}} {{ds.begin_time_hour}}:{{complement(ds.begin_time_minute)}}-{{ds.end_time_hour}}:{{complement(ds.end_time_minute)}} {{ds.dep_name}} 余号：{{ds.remain_register_count}}
                            <button v-if="ds.remain_register_count > 0" @click="clickShowRegisterModal(ds)" class="btn btn-block btn-primary float-end" data-bs-dismiss="modal">挂号</button>
                            <button v-else class="btn btn-block btn-secondary float-end" disabled>已无余号</button>
                        </li>
                    </ul>
                    <ul class="list-group" v-else>
                        <li class="list-group-item list-group-item-action">该医师近7日没有出诊安排</li>
                    </ul>

                </div>

                <div class="modal-footer">
                    <input type="button" class="btn btn-danger btn-block" id="closeSubmitArrangementModal" data-bs-dismiss="modal" value="关闭"/>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="submitRegistrationModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="DescriptionTitle">提交挂号信息</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitRegistration">
                        <div class="input-group mb-3 visually-hidden">
                            <span class="input-group-text">schedule_id</span>
                            <input type="text" class="form-control" disabled v-model="submitRegistrationFormData.schedule_id" />
                        </div>
                        <div class="input-group mb-3 visually-hidden">
                            <span class="input-group-text">doctor_id</span>
                            <input type="text" class="form-control" disabled v-model="submitRegistrationFormData.doctor_id" />
                        </div>
                        <div class="input-group mb-3 visually-hidden">
                            <span class="input-group-text">date</span>
                            <input type="text" class="form-control" disabled v-model="submitRegistrationFormData.date" />
                        </div>
                        <div class="input-group mb-3 visually-hidden">
                            <span class="input-group-text">noon_id</span>
                            <input type="text" class="form-control" disabled v-model="submitRegistrationFormData.noon_id" />
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">医生信息</span>
                            <input type="text" class="form-control" id="doctor_info" disabled readonly>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">就诊时间</span>
                            <input type="text" class="form-control" id="visit_time" disabled readonly>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" value="确定"/>
                            <input type="button" class="btn btn-danger btn-block" id="closeSubmitRegistrationModal" data-bs-dismiss="modal" value="取消"/>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>



    <div class="container-fluid mt-1">
        <patientHeader></patientHeader>             <!--病人个人信息 -->

        <hr>

        <div class="row">
            <div class="col-2">
                <patientNav></patientNav>             <!--病人导航栏 -->
            </div>

            <div class="col-1 border-start"></div>

            <div class="col-8 justify-content-center">
                <form @submit.prevent="searchDoctor">
                    <div class="input-group mt-3">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control col-8" placeholder="输入医生姓名/医生姓名拼音搜索医师..." v-model="keyword"/>
                        <input type="submit" class="btn btn-outline-success my-2 my-sm-0 col-3" value="搜索"/>
                    </div>
                </form>

                <hr>

                <div class="row justify-content-center">
                    <div class="col-8">
                        <ul class="list-group">
                            <li v-for="(doctor, key) in data1.doctors" :key="key" id="date-frame" class="list-group-item list-group-item-action p-2">
                                {{doctor.doctor_name}} {{doctor.dep_name}} {{doctor.title_name}}
                                <button @click="displayDetail(doctor)" class="btn btn-block btn-primary float-end" data-bs-toggle="modal" data-bs-target="#displayDetail" >查看详情</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="col-auto"></div>
        </div>
    </div>
</template>

<style scoped>
    #date-frame {
        background-color: white;
        opacity: 93%;
        margin: 5px auto;
        border: 1px solid #eee;
        padding: 10px 0 10px 0;
        border-radius: 10px;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
    }
    p {
        font-size: 18px;
    }
    a {
        text-decoration: none;
    }
    .modal-custom {
        --bs-modal-width:550px
    }
</style>