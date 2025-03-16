<script setup>
// eslint-disable-next-line no-unused-vars
import {reactive, ref} from "vue";
import axios from "axios";
import config from "@/config/config";


const keyword = ref(
    ''
);

const data1 = reactive({
    doctors: []
});

const doctor_detail_modal_data = reactive({
    doctor_name: '',
    doctor_title_name: '',
    doctor_description: '',
    doctor_schedule: []
})

const searchDoctor = async () => {
    if (keyword.value === '' || keyword.value === undefined) {
        alert('请先输入关键词');
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
};

const displayDetail = async (obj) => {
    doctor_detail_modal_data.doctor_schedule = [];
    doctor_detail_modal_data.doctor_name = obj.doctor_name;
    doctor_detail_modal_data.doctor_title_name = obj.title_name;
    doctor_detail_modal_data.doctor_description = obj.doctor_description;

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

const complement = (value) => {
    return value < 10 ? `0${value}` : value.toString()
}

</script>

<template>
    <div class="modal fade" id="displayDetail" tabindex="-1">
        <div class="modal-dialog">
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
                        <textarea class="form-control" rows="3" readonly v-model="doctor_detail_modal_data.doctor_description"></textarea>
                    </div>


                    <span class="input-group-text">近7天出诊计划</span>
                    <ul class="list-group" v-if="doctor_detail_modal_data.doctor_schedule.length > 0">
                        <li v-for="(ds, key) in doctor_detail_modal_data.doctor_schedule" :key="key" class="list-group-item list-group-item-action p-2">
                            {{ds.work_date}} {{ds.begin_time_hour}}:{{complement(ds.begin_time_minute)}}-{{ds.end_time_hour}}:{{complement(ds.end_time_minute)}} {{ds.dep_name}} 余号:{{ds.remain_register_count}}
                            <button class="btn btn-block btn-primary float-end">挂号</button>
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

    <div class="container-fluid mt-1">
        <patientHeader></patientHeader>             <!--病人个人信息 -->

        <hr>

        <div class="row">
            <div class="col-2">
                <patientNav></patientNav>             <!--病人导航栏 -->
            </div>

            <div class="col-1 border-start"></div>

            <div class="col-8">
                <form @submit.prevent="searchDoctor">
                    <div class="input-group mt-3">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control col-8" placeholder="输入姓名/医生姓名拼音搜索医师..." v-model="keyword"/>
                        <input type="submit" class="btn btn-outline-success my-2 my-sm-0 col-3" value="搜索"/>
                    </div>
                </form>

                <hr>

                <ul class="list-group">
                    <li v-for="(doctor, key) in data1.doctors" :key="key" id="date-frame" class="list-group-item list-group-item-action p-2">
                        {{doctor.doctor_name}} {{doctor.dep_name}} {{doctor.title_name}}
                        <button @click="displayDetail(doctor)" class="btn btn-block btn-primary float-end" data-bs-toggle="modal" data-bs-target="#displayDetail" >查看详情</button>
                    </li>
                </ul>



            </div>

            <div class="col-1 border-end"></div>
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
</style>