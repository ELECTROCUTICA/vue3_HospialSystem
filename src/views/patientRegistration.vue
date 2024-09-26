<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import $ from 'jquery'
import { Modal } from 'bootstrap';

const data1 = reactive({            //从后端发送过来的日期表，服务器时间，可预约科室
    dates: [],
    now: '',
    departments: []
});


const activeButton = ref(null);
const setButtonActive = (index) => {
    activeButton.value = index;
};

const request = reactive({          //要向后端发送的预约日期，预约科室
    selectedDate: '',
    selectedDep: 'default',
});

const descriptionModalData = reactive({        //简介模态框内容
    title: '',
    description: ''
});

function chooseDate(dateParam, dateText) {
    $('#chosenDate').html('已选择：' + dateText);
    request.selectedDate = dateParam;

    if (request.selectedDep === 'default') {
        $('#platform').removeClass('visually-hidden');
    }
    else {
        flush();
    }
}


function flush() {
    $('#list1').empty();
    if (request.selectedDep === 'default') {
        return;
    }

    axios({
        url: 'http://localhost:8080/patient/registration/getDoctorsWorkAtDate',
        method: 'get',
        params: {
            dep_no: request.selectedDep,
            date: request.selectedDate
        },
    }).then(response => {
        var workDoctors = response.data;
        if (workDoctors.length === 0) {
            $('#list1').append('暂无医生可预约');
        }
        else {
            $.each(workDoctors, function(i, doctor) {
                var row;
                if (doctor.remain > 0) {
                    row = '<li class="list-group-item list-group-item-action">' +
                        doctor.name + " " + doctor.dep_name + " " + doctor.title + " 余号：" + doctor.remain +
                        '<button class="btn btn-primary btn-block float-end m-1" id="showDescription" onclick="clickShowDescription(' + doctor.doctor_id + ',' + '\'' + doctor.name + '\'' + ',' + '\'' + request.selectedDate + '\'' +  ')">查看医生简介</button>' +
                        '<button class="btn btn-primary btn-block float-end m-1" onclick="clickRegister(' + doctor.doctor_id + ',' + '\'' + request.selectedDate + '\'' + ')">预约</button>' +
                        '</li>';
                }
                else {
                    row = '<li class="list-group-item list-group-item-action">' +
                        doctor.name + " " + doctor.dep_name + " " + doctor.title + " 余号：" + doctor.remain +
                        '<button class="btn btn-primary btn-block float-end m-1" id="showDescription" onclick="clickShowDescription(' + doctor.doctor_id + ',' + '\'' + doctor.name + '\'' + ',' + '\'' + request.selectedDate + '\'' +  ')">查看医生简介</button>' +
                        '<button class="btn btn-secondary btn-block float-end m-1" disabled >号源已空</button>' +
                        '</li>';
                }
                $('#list1').append(row);
            });
        }

    }).catch(error => {
        console.log(error);
    });
}

function clickShowDescription(doctor_id, doctor_name, date) {
    axios({
        url: 'http://localhost:8080/patient/registration/getDescription',
        method: 'get',
        params: {
            doctor_id : doctor_id,
            date : date
        },
    }).then(response => {
        $('#DescriptionTitle').html(doctor_name + "医生的简介");
        $('#description').val(response.data);
        const modal = new Modal($('#showDescriptionModal'));
        modal.show();
    }).catch(error => {
        console.log(error);
    });
}
window.clickShowDescription = clickShowDescription;

function clickRegister(doctor_id ,date) {
    axios({
        url: 'http://localhost:8080/patient/registration/submit',
        method: 'post',
        params: {
            date : date,
            doctor_id : doctor_id
        },
    }).then(response => {
        alert(response.data.message);
        flush();

    }).catch(error => {
        console.log(error);
    });
}
window.clickRegister = clickRegister;


onMounted(async () => {
    const response = await axios({
        url: 'http://localhost:8080/patient/interface/getArrangement',
        method: 'get'
    });
    data1.dates = response.data.dates;
    data1.now = response.data.now;
    data1.departments = response.data.departments;
});
</script>

<template>
    <div class="modal fade" id="showDescriptionModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="DescriptionTitle">{{ descriptionModalData.title }}</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <textarea id="description" class="form-control bi-textarea" v-model="descriptionModalData.description" readonly></textarea>
                </div>
                <div class="modal-footer">
                    <input type="button" class="btn btn-primary btn-block" name="cancel" data-bs-dismiss="modal" value="确定"/>
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
                <h1 id="nowTime" class="display-6 mt-3 mb-3">当前时间：{{data1.now}}</h1>

                <div id="date-frame">
                    <ul class="list-group list-group-horizontal" id="dates">
                        <li v-for="(DateJSON, index) in data1.dates" :key="index" class="list-group-item  list-group-item-action p-2">
                            <button @click="chooseDate(DateJSON.dateParam, DateJSON.dateText); setButtonActive(index)" name="dateBtn"
                                    class="btn btn-block" :class="{'btn-primary' : activeButton === index, 'btn-outline-primary': activeButton !== index}" >{{DateJSON.dateText}}</button>
                        </li>
                    </ul>
                </div>
                <hr>

                <div class="row mt-1 mb-1" >
                    <div class="col-4">
                        <p class="h5" id="chosenDate">请在上方选择预约日期</p>
                    </div>

                    <div class="col-8"></div>
                </div>

                <div id="platform" class="visually-hidden">

                    <div class="row mt-3 mb-1" >
                        <div class="col-2">
                            <p class="h5">选择科室</p>
                        </div>

                        <div class="col-1 border-end">
                        </div>

                        <div class="col-5">
                            <p id="workTitle" class="h5">可预约医师</p>
                        </div>

                        <div class="col-4">
                        </div>
                    </div>

                    <div class="row mt-1 mb-1">
                        <div class="col-2">
                            <select @change="flush()" class="form-select" id="selectDepartment" v-model="request.selectedDep">
                                <option value="default">请选择科室...</option>
                                <option v-for="(department, key) in data1.departments" :key="key" :value="department.dep_no">{{department.dep_name}}</option>
                            </select>

                        </div>
                        <div class="col-1 border-end">
                        </div>
                        <div class="col-5">
                            <ul class="list-group" id="list1">

                            </ul>
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