<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import $ from 'jquery'
import config from "@/config/config";


const data1 = reactive({
    dates: [],
    noons: [],
    departments: []
});

const submitRegistrationFormData = reactive({
    doctor_id: 0,
    date: '',
    noon_id: 0
});

const activeButton = ref(null);
const setButtonActive = (index) => {
    activeButton.value = index;
};

const request = reactive({          //要向后端发送的预约日期，预约科室
    selectedDate: '',
    selectedDep: -1,
    selectedNoon: -1
});

const descriptionModalData = reactive({        //简介
    description_text: ''
});

const response = reactive({
    work_doctors: []
});

async function refreshTable() {
    response.work_doctors = [];
    if (request.selectedDep !== -1 && request.selectedNoon !== -1) {
        const resp = await axios({
            url: `${config.spring_cloud_gateway_url}app/patient/registration/getDoctorsWorkAtDateAndNoon`,
            method: 'get',
            params: {
                date: request.selectedDate,
                noon_id: request.selectedNoon,
                dep_no: request.selectedDep
            },
        });
        response.work_doctors = resp.data;
    }


}

async function refreshTableThenDisable() {
    let countdown = 3;
    await refreshTable();
    const button = $('#refreshBtn');
    button.addClass('disabled');
    button.removeClass('btn-primary').addClass('btn-secondary');
    button.html(`等待${countdown}秒`);
    const timer = setInterval(() => {
        button.html(`等待${countdown - 1}秒`);
        if (--countdown <= 0) {
            button.html(`刷新`);
            button.removeClass('disabled');
            button.removeClass('btn-secondary').addClass('btn-primary');
            clearInterval(timer);
        }
    }, 1000);

}

function chooseDate(dateParam, dateText, index) {
    $('#chosenDate').html(`已选择：${dateText}`);
    request.selectedDate = dateParam;

    let contain = false;
    if (request.selectedNoon !== -1) {
        if (data1.noons[index].length === 0) {
            contain = false;
        }
        else {
            for (let i = 0; i < data1.noons[index].length; i++) {
                if (data1.noons[index][i].noon_id === request.selectedNoon) {
                    contain = true;
                    break;
                }
            }
        }
    }
    if (!contain) {
        request.selectedNoon = -1;
    }

    if (request.selectedDep === -1 || request.selectedNoon === -1) {
        $('#platform').removeClass('visually-hidden');
        $('#refreshBtn').removeClass('visually-hidden');
    }
}

async function clickShowDescription(doctor_id, doctor_name) {
    await axios({
        url: `${config.spring_cloud_gateway_url}app/patient/registration/getDescription`,
        method: 'get',
        params: {
            doctor_id : doctor_id
        },
    }).then(response => {
        $('#DescriptionTitle').html(`${doctor_name} 医生的简介`);
        descriptionModalData.description_text = response.data;
    }).catch(error => {
        console.log(error);
    });
}
window.clickShowDescription = clickShowDescription;

const showConfirmRegisterModal = (r) => {
    submitRegistrationFormData.doctor_id = r.doctor_id;
    submitRegistrationFormData.date = r.work_date;
    submitRegistrationFormData.noon_id = r.noon_id;
    $('#doctor_info').val(`${r.doctor_name} ${r.dep_name} ${r.title_name}`);
    $('#visit_time').val(`${r.work_date} ${r.noon_name} ${r.begin_time_hour}:${complement(r.begin_time_minute)}-${r.end_time_hour}:${complement(r.end_time_minute)}`);

};


const submitRegistration = async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}app/patient/registration/submit`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            doctor_id: submitRegistrationFormData.doctor_id,
            date: submitRegistrationFormData.date,
            noon_id: submitRegistrationFormData.noon_id
        }
    }).then((response) => {
        if (response.data.status === 'ok') {
            alert(response.data.message);
            $('#closeSubmitRegistrationModal').click();
            refreshTable();
        }
        else {
            alert(response.data.message);
        }
    });
}

const complement = (value) => {                     //用于当分钟、秒小于10时，补上十位数的0
    return value < 10 ? `0${value}` : value.toString()
}

onMounted(async () => {
    const response = await axios({
        url: `${config.spring_cloud_gateway_url}app/patient/getSchedule`,
        method: 'get'
    });

    for (let i = 0; i < response.data.date_and_noons.length; i++) {
        data1.dates.push(response.data.date_and_noons[i].date);
        data1.noons.push(response.data.date_and_noons[i].valid_noons);
    }
    data1.departments = response.data.departments;

});

</script>

<template>
    <div class="modal fade" id="doctorDescriptionModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="DescriptionTitle">null 医生的简介</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <textarea id="description" class="form-control bi-textarea" v-model="descriptionModalData.description_text" readonly></textarea>
                </div>
                <div class="modal-footer">
                    <input type="button" class="btn btn-primary btn-block" data-bs-dismiss="modal" value="确定"/>
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

            <div class="col-8" id="content">
<!--                <h1 class="display-6 mt-3 mb-3">当前时间：</h1>-->

                <div id="date-frame">
                    <ul class="list-group list-group-horizontal" id="dates">
                        <li v-for="(date, index) in data1.dates" :key="index" class="list-group-item  list-group-item-action p-2">
                            <button @click="chooseDate(date.dateParam, date.dateText, index); refreshTable(); setButtonActive(index);" name="dateBtn"
                                    class="btn btn-block" :class="{'btn-primary' : activeButton === index, 'btn-outline-primary': activeButton !== index}" >{{date.dateText}}</button>
                        </li>
                    </ul>
                </div>
                <hr>

                <div class="row mt-1 mb-1" >
                    <div class="col-4">
                        <p class="h5" id="chosenDate">请在上方选择预约日期</p>
                    </div>


                    <div class="col-8">
                        <button @click="refreshTableThenDisable" class="btn btn-block btn-primary bi-arrow-clockwise float-end visually-hidden" id="refreshBtn">刷新</button>
                    </div>
                </div>

                <div id="platform" class="visually-hidden">

                    <div class="row mt-3 mb-1" >
                        <div class="" style="width: 19%">
                            <p class="h5">选择科室</p>
                            <select @change="refreshTable" class="form-select mb-5" v-model="request.selectedDep">
                                <option :value="-1">请选择科室...</option>
                                <option v-for="(department, key) in data1.departments" :key="key" :value="department.dep_no">{{department.dep_name}}</option>
                            </select>

                            <p class="h5">选择午别</p>
                            <select @change="refreshTable" class="form-select" v-model="request.selectedNoon">
                                <option :value="-1">请选择午别...</option>
                                <option v-for="(noon, key) in data1.noons[activeButton]" :key="key" :value="noon.noon_id">{{noon.noon_name}} {{noon.begin_time_hour}}:{{complement(noon.begin_time_minute)}}-{{noon.end_time_hour}}:{{complement(noon.end_time_minute)}}</option>
                            </select>

                        </div>


                        <div class="border-end" style="width: 3%"></div>

                        <div class="col-6">
                            <p id="workTitle" class="h5 mb-3">可预约医师</p>
                            <div v-if="request.selectedDep === -1 || request.selectedNoon === -1"><p></p></div>
                            <div v-else-if="response.work_doctors.length === 0">
                                <p>暂无可预约挂号的医师</p>
                            </div>
                            <div v-else>
                                <ul class="list-group" id="list2">
                                    <li v-for="(ds, key) in response.work_doctors" :key="key" class="list-group-item list-group-item-action">{{ds.doctor_name}} {{ds.dep_name}} {{ds.title_name}}
                                                余号：{{ds.remain_register_count + ds.append_register_count}}
                                        <button @click="showConfirmRegisterModal(ds)" class="btn btn-primary btn-block float-end m-1" data-bs-toggle="modal" data-bs-target="#submitRegistrationModal">挂号</button>
                                        <button @click="clickShowDescription(ds.doctor_id, ds.doctor_name)" class="btn btn-secondary btn-block float-end m-1" data-bs-toggle="modal" data-bs-target="#doctorDescriptionModal">医生简介</button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="col-4">
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-1"></div>
        </div>
    </div>
</template>

<style scoped>
    #date-frame {
        background-color: white;
        opacity: 93%;
        margin: 5px auto;
        text-align: center;
        border: 1px solid #eee;
        padding: 10px 0 10px 0;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
    p {
        font-size: 18px;
    }
    a {
        text-decoration: none;
    }
</style>