<script setup>
// eslint-disable-next-line no-unused-vars
import {ref, reactive, onMounted, computed, onBeforeUnmount, onBeforeMount, onUnmounted} from 'vue';
import axios from 'axios';
import $ from 'jquery';
import config from "@/config/config";

const data1 = reactive({
    dates: [],
    departments: [],
    noons: []
});

const activeButton = ref(null);
const setButtonActive = (index) => {
    activeButton.value = index;
};

const submitScheduleFormData = reactive({
    doctor_id: -1,
    doctor_name: '',
    title_name: '',
    dep_text: '',
    work_date: '',
    noon_id: -1,
    noon_text: '',
    init_register_count: ''
});

const request = reactive({          //要向后端发送的日期，科室，午别
    selectedDate: '',
    selectedDep: -1,
    selectedNoon: -1,
});

const response = reactive({
    no_work_doctors: [],            //后端为Doctor类型
    work_doctors: []                //后端为DoctorScheduleMap类型
});

//用于刷新医生列表方法
async function refreshTable() {
    response.no_work_doctors = [];
    response.work_doctors = [];
    if (request.selectedDep !== -1 && request.selectedNoon !== -1) {
        const resp1 = await axios({
            url: `${config.spring_cloud_gateway_url}leader/admin/schedule/getDoctorsNoWork`,
            method: 'get',
            params: {
                dep_no: request.selectedDep,
                date: request.selectedDate,
                noon_id: request.selectedNoon
            },
        });
        response.no_work_doctors = resp1.data;
        const resp2 = await axios({
            url: `${config.spring_cloud_gateway_url}leader/admin/schedule/getDoctorsWork2`,
            method: 'get',
            params: {
                dep_no: request.selectedDep,
                date: request.selectedDate,
                noon_id: request.selectedNoon
            },
        });
        response.work_doctors = resp2.data;

        console.log(resp2.data);
    }
}

function chooseDate(dateParam, dateText) {
    $('#chosenDate').html(`已选择${dateText}`);
    request.selectedDate = dateParam;

    if (request.selectedDep === -1 || request.selectedNoon === -1) {
        $('#platform').removeClass('visually-hidden');
        $('#refreshBtn').removeClass('visually-hidden');
    }
}



//旧代码 用于刷新医生列表
// function flush() {
//     $('#list1').empty();
//     $('#list2').empty();
//     if (request.selectedDep === -1 || request.selectedNoon === -1) {
//         return;
//     }
//
//     axios({
//         url: 'http://localhost:7777/leader/admin/schedule/getDoctorsWork',
//         method: 'get',
//         params: {
//             dep_no: request.selectedDep,
//             date: request.selectedDate,
//             noon_id: request.selectedNoon,
//         },
//     }).then(response => {
//         let workDoctors = response.data;
//         if (workDoctors.length === 0) {
//             $('#list2').append('无医生已被安排工作');
//         }
//         else {
//             $.each(workDoctors, function(i, doctor) {
//                 let row = `<li class="list-group-item list-group-item-action">${doctor.doctor_id} ${doctor.doctor_name} ${doctor.doctor_name} ${doctor.dep_name} ${doctor.title_name}
//                 <button class="btn btn-danger btn-block float-end" onclick="cancelArrangement(${doctor.doctor_id}, '${doctor.doctor_name}', '${request.selectedDate}', ${request.selectedNoon})">取消安排</button></li>`;
//                 $('#list2').append(row);
//             });
//         }
//     }).catch(error => {
//         console.log(error);
//     });
//
//     // 无工作安排医生
//     axios({
//         url: 'http://localhost:7777/leader/admin/schedule/getDoctorsNoWork',
//         method: 'get',
//         params: {
//             dep_no: request.selectedDep,
//             date: request.selectedDate,
//             noon_id: request.selectedNoon
//         },
//     }).then(response => {
//         let noWorkDoctors = response.data;
//         if (noWorkDoctors.length === 0) {
//             $('#list1').append('无医生未被安排工作');
//         }
//         else {
//             $.each(noWorkDoctors, function(i, doctor) {
//                 let row = `<li class="list-group-item list-group-item-action">${doctor.doctor_id} ${doctor.doctor_name} ${doctor.dep_name} ${doctor.title_name}
//                 <button class="btn btn-primary btn-block float-end" onclick="arrangeGoToWork(${doctor.doctor_id}, '${request.selectedDate}', ${request.selectedNoon})" data-bs-toggle="modal" data-bs-target="#arrangeGoToWorkModal">安排工作</button></li>`;
//                 $('#list1').append(row);
//             });
//         }
//     }).catch(error => {
//         console.log(error);
//     });
// }

//点击安排工作后弹出的模态框信息填充方法
async function arrangeGoToWork(doctor_id, work_date, noon_id) {
    await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/doctorinfo/getDoctor`,
        method: 'get',
        params: {
            doctor_id: doctor_id
        },
    }).then((response) => {
        submitScheduleFormData.dep_text = `${response.data.dep_no} ${response.data.dep_name}`;
        submitScheduleFormData.doctor_name = response.data.doctor_name;
        submitScheduleFormData.title_name = response.data.title_name;
    }).catch((error) => {
        console.log(error);
    });
    submitScheduleFormData.doctor_id = doctor_id;
    submitScheduleFormData.work_date = work_date;
    submitScheduleFormData.noon_id = noon_id;
    submitScheduleFormData.noon_text = getNoonTextStringOfNoonID(noon_id);
    submitScheduleFormData.init_register_count = '';
}
window.arrangeGoToWork = arrangeGoToWork;

function getNoonTextStringOfNoonID(noon_id) {
    for (let i = 0; i < data1.noons.length; i++) {
        if (noon_id === data1.noons[i].noon_id) {
            return submitScheduleFormData.noon_text = `${data1.noons[i].noon_name} ${data1.noons[i].begin_time_hour}:${data1.noons[i].begin_time_minute}-${data1.noons[i].end_time_hour}:${data1.noons[i].end_time_minute}`;
        }
    }
}

function submitArrangement() {
    if (Number(submitScheduleFormData.init_register_count) >= 0 && Number(submitScheduleFormData.init_register_count) % 1 === 0) {
        axios({
            url: `${config.spring_cloud_gateway_url}leader/admin/schedule/goToWork`,
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params: {
                doctor_id: submitScheduleFormData.doctor_id,
                work_date: submitScheduleFormData.work_date,
                noon_id: submitScheduleFormData.noon_id,
                init_register_count: Number(submitScheduleFormData.init_register_count)
            },
        }).then(response => {
            alert(response.data.message);
            if (response.data.status === 'ok') {
                refreshTable();
                $("#closeSubmitArrangementModal").click();
            }
        }).catch(error => {
            console.log(error);
        });
    }
    else {
        alert('不正确的输入，号源数量必须为大于零的整数');
    }
}

async function cancelArrangement(ds) {
    if (confirm(`你确定要取消${ds.work_date} ${ds.doctor_id} ${ds.doctor_name} ${getNoonTextStringOfNoonID(ds.noon_id)}的工作安排吗？`)) {
        await axios({
            url: `${config.spring_cloud_gateway_url}leader/admin/schedule/cancel`,
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                schedule_id: ds.schedule_id
            },
        }).then(response => {
            alert(response.data.message);
            if (response.data.status === 'ok') {
                refreshTable();
            }

        }).catch(error => {
            console.log(error);
        });
    }
}
window.cancelArrangement = cancelArrangement;

let current_time = reactive({
    value: ''
});
let current_time_text = reactive({
    value: ''
});

const complement = (value) => {                     //用于当分钟、秒小于10时，补上十位数的0
    return value < 10 ? `0${value}` : value.toString()
}

const updateTime = async () => {
    current_time.value.setSeconds(current_time.value.getSeconds() + 1);
    current_time_text.value = `${current_time.value.getFullYear()}年${complement(current_time.value.getMonth() + 1)}月${complement(current_time.value.getDate())}日 ${current_time.value.getHours()}:${complement(current_time.value.getMinutes())}:${complement(current_time.value.getSeconds())}`;
}

let worker = null;
const initTimeWorker = () => {
    worker = new Worker(new URL("time.worker.js", import.meta.url));
    worker.onmessage = (e) => {
        if (e.data === "tick") {
            updateTime();
        }
    };
    worker.postMessage("start");
};

const destroyTimeWorker = () => {
    if (worker) {
        worker.postMessage("stop");
        worker.terminate();
        worker = null;
    }
};

onMounted(async () => {
    const response = await axios({
        url: `${config.spring_cloud_gateway_url}leader/admin/getSchedule`,
        method: 'get'
    });
    data1.dates = response.data.dates;
    data1.departments = response.data.departments;
    data1.noons = response.data.noons;
    current_time.value = new Date(response.data.now);

    await updateTime();
    initTimeWorker();

});

onBeforeUnmount(() => {
    destroyTimeWorker();
});


</script>


<template>
    <adminNav></adminNav>

    <div class="modal fade" id="arrangeGoToWorkModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">提交排班信息</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitArrangement">
                        <div class="input-group mb-3">
                            <span class="input-group-text">医生工号</span>
                            <input type="text" class="form-control" disabled v-model="submitScheduleFormData.doctor_id">
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">医生姓名</span>
                            <input type="text" class="form-control" disabled v-model="submitScheduleFormData.doctor_name">
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">医生职称</span>
                            <input type="text" class="form-control" disabled v-model="submitScheduleFormData.title_name">
                        </div>


                        <div class="input-group mb-3">
                            <span class="input-group-text">排班科室</span>
                            <input type="text" class="form-control" disabled v-model="submitScheduleFormData.dep_text">
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">工作日期</span>
                            <input type="text" class="form-control" disabled v-model="submitScheduleFormData.work_date">
                        </div>
                        <div class="input-group mb-3 visually-hidden">
                            <span class="input-group-text">工作午别</span>
                            <input type="text" class="form-control" disabled v-model="submitScheduleFormData.noon_id">
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">工作午别</span>
                            <input type="text" class="form-control" disabled :value="submitScheduleFormData.noon_text">
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">号源数量</span>
                            <input type="text" class="form-control" placeholder="请输入号源数量" v-model="submitScheduleFormData.init_register_count">
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" data-bs-dismiss="modal" value="提交" />
                            <input type="button" class="btn btn-danger btn-block" id="closeSubmitArrangementModal" data-bs-dismiss="modal" value="取消"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <h2 class="mt-3 mb-3" style="font-family: 'Microsoft YaHei UI',serif">服务器时间：{{current_time_text.value}}</h2>
        <div id="frame" class="mt-3">
            <ul class="list-group list-group-horizontal">
                <li v-for="(DateJSON, index) in data1.dates" :key="index" class="list-group-item list-group-item-action p-2">
                    <button @click="chooseDate(DateJSON.dateParam, DateJSON.dateText); refreshTable(); setButtonActive(index)"
                            class="btn btn-block" :class="{'btn-primary' : activeButton === index, 'btn-outline-primary': activeButton !== index}">{{DateJSON.dateText}}</button>
                </li>
            </ul>
        </div>

        <hr>

        <div class="row mt-1 mb-1" >
            <div class="col-4">
                <p class="h4" id="chosenDate">请在上方选择工作日期</p>

            </div>
            <div class="col-8">
                <button @click="refreshTable()" class="btn btn-block btn-primary bi-arrow-clockwise float-end visually-hidden" id="refreshBtn">刷新</button>
            </div>
        </div>

        <div id="platform" class="visually-hidden">

            <div class="row mt-3 mb-1" >
                <div class="" style="width: 19%">
                    <p class="h5">选择科室</p>
                    <select @change="refreshTable" class="form-select mb-5" :class="{'fw-bold' : request.selectedDep !== -1}" v-model="request.selectedDep">
                        <option :value="-1">请选择科室...</option>
                        <option v-for="(department, key) in data1.departments" :key="key" :value="department.dep_no">{{department.dep_name}}</option>
                    </select>

                    <p class="h5">选择午别</p>
                    <select @change="refreshTable" class="form-select" :class="{'fw-bold' : request.selectedNoon !== -1}" v-model="request.selectedNoon">
                        <option :value="-1">请选择午别...</option>
                        <option v-for="(noon, key) in data1.noons" :key="key" :value="noon.noon_id">{{noon.noon_name}} {{noon.begin_time_hour}}:{{complement(noon.begin_time_minute)}}-{{noon.end_time_hour}}:{{complement(noon.end_time_minute)}}</option>
                    </select>
                </div>

                <div class="col-auto border-end"></div>

                <div class="col-4">
                    <p id="noWorkTitle" class="h5 mb-3">未安排工作医生列表</p>
                    <div v-if="request.selectedDep === -1 || request.selectedNoon === -1"><p></p></div>
                    <div v-else-if="response.no_work_doctors.length === 0">
                        <p>无医生未被安排工作</p>
                    </div>
                    <div v-else>
                        <ul class="list-group" id="list1">
                            <li v-for="(doctor, key) in response.no_work_doctors" :key="key" class="list-group-item list-group-item-action">{{doctor.doctor_id}} {{doctor.doctor_name}} {{doctor.dep_name}} {{doctor.title_name}}
                                <button class="btn btn-primary btn-block float-end" @click="arrangeGoToWork(doctor.doctor_id, request.selectedDate, request.selectedNoon)" data-bs-toggle="modal" data-bs-target="#arrangeGoToWorkModal">安排工作</button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-auto border-end"></div>

                <div class="col-5">
                    <p id="workTitle" class="h5 mb-3">已安排工作医生列表</p>
                    <div v-if="request.selectedDep === -1 || request.selectedNoon === -1"><p></p></div>
                    <div v-else-if="response.work_doctors.length === 0">
                        <p>无医生已被安排工作</p>
                    </div>
                    <div v-else>
                        <ul class="list-group" id="list2">
                            <li v-for="(ds, key) in response.work_doctors" :key="key" class="list-group-item list-group-item-action">{{ds.doctor_id}} {{ds.doctor_name}} {{ds.dep_name}} {{ds.title_name}} 余号:{{ds.remain_register_count + ds.append_register_count}}
                                <button @click="cancelArrangement(ds)" class="btn btn-danger btn-block float-end"><span class="bi bi-x-lg"></span></button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
    #frame {
        background-color: white;
        opacity: 93%;
        margin: 5px auto;
        text-align: center;
        border: 1px solid #eee;
        padding: 10px 0 10px 0;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
    a {
        text-decoration: none;
    }
</style>