<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import $ from 'jquery';

const data1 = reactive({
    dates: [],
    now: '',
    departments: []
});

const activeButton = ref(null);
const setButtonActive = (index) => {
    activeButton.value = index;
};

const formData = reactive({
    doctor_id: '',
    date: '',
    remain: ''
});

const request = reactive({          //要向后端发送的预约日期，预约科室
    selectedDate: '',
    selectedDep: 'default',
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
    $('#list2').empty();
    if (request.selectedDep === 'default') {
        return;
    }

    axios({
        url: 'http://localhost:8080/admin/schedule/getDoctorsWorkAtDate',
        method: 'get',
        params: {
            dep_no: request.selectedDep,
            date: request.selectedDate
        },
    }).then(response => {
        var workDoctors = response.data;
        if (workDoctors.length === 0) {
            $('#list2').append('无医生已被安排工作');
        }
        else {
            $.each(workDoctors, function(i, doctor) {
                var row = '<li class="list-group-item list-group-item-action">' +
                    doctor.id + " " + doctor.name + " " + doctor.dep_name + " " + doctor.title +
                    '<button class="btn btn-danger btn-block float-end" onclick="cancelArrangement(' + doctor.id + ',' + '\'' + request.selectedDate + '\'' + ',' + '\'' + doctor.name + '\'' + ')">取消安排</button>' +
                    '</li>';
                $('#list2').append(row);
            });
        }
    }).catch(error => {
        console.log(error);
    });

    // 无工作安排医生
    axios({
        url: 'http://localhost:8080/admin/schedule/getDoctorsNoWorkAtDate',
        method: 'get',
        params: {
            dep_no: request.selectedDep,
            date: request.selectedDate
        },
    }).then(response => {
        var noWorkDoctors = response.data;
        if (noWorkDoctors.length === 0) {
            $('#list1').append('无医生未被安排工作');
        }
        else {
            $.each(noWorkDoctors, function(i, doctor) {
                var row = '<li class="list-group-item list-group-item-action">' +
                    doctor.id + " " + doctor.name + " " + doctor.dep_name + " " + doctor.title +
                    '<button class="btn btn-primary btn-block float-end" data-bs-toggle="modal" data-bs-target="#arrangeGoToWorkModal" onclick="arrangeGoToWork(' + doctor.id + ',' + '\'' + request.selectedDate + '\'' + ')">安排工作</button>' +
                    '</li>';
                $('#list1').append(row);
            });
        }
    }).catch(error => {
        console.log(error);
    });
}

function arrangeGoToWork(doctor_id, date) {
    formData.doctor_id = doctor_id;
    formData.date = date;
    formData.remain = ''
}
window.arrangeGoToWork = arrangeGoToWork;

function submitArrangement() {
    if (Number(formData.remain) >= 0) {
        axios({
            url: 'http://localhost:8080/admin/schedule/goToWork',
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params: {
                date: formData.date,
                doctor_id: formData.doctor_id,
                remain: Number(formData.remain)
            },
        }).then(response => {
            alert(response.data.message);
            if (response.data.state === 'ok') {
                flush();
            }
        }).catch(error => {
            console.log(error);
        });
    }
    else {
        alert('不合法的输入，号源数量必须为大于零的整数');
    }
}

function cancelArrangement(doctor_id, date, doctor_name) {
    if (confirm('你确定要取消' + date + ' ' + doctor_id + ' ' + doctor_name + '的工作安排吗？')) {
        axios({
            url: 'http://localhost:8080/admin/schedule/cancel',
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params: {
                date: date,
                doctor_id: doctor_id,
            },
        }).then(response => {
            alert(response.data.message);
            if (response.data.state === 'ok') {
                flush();
            }

        }).catch(error => {
            console.log(error);
        });
    }
}
window.cancelArrangement = cancelArrangement;

onMounted(async () => {
    const response = await axios({
        url: 'http://localhost:8080/admin/interface/getSchedule',
        method: 'get'
    });
    data1.dates = response.data.dates;
    data1.now = response.data.now;
    data1.departments = response.data.departments;
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
                            <input type="text" class="form-control" name="doctor_id" id="doctor_id" disabled v-model="formData.doctor_id">
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">上班日期</span>
                            <input type="text" class="form-control" name="date" id="date" disabled v-model="formData.date">
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">号源数量</span>
                            <input type="text" class="form-control" name="remain" id="remain" placeholder="请输入号源数量" v-model="formData.remain">
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" name="arrange" id="arrange" data-bs-dismiss="modal" value="提交" />
                            <input type="button" class="btn btn-danger btn-block" name="cancel" data-bs-dismiss="modal" value="取消"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <h1 id="nowTime" class="display-6 mt-3 mb-3">当前时间：{{data1.now}}</h1>
        <div id="frame">
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
                <p class="h4" id="chosenDate">请在上方选择工作日期</p>
            </div>

            <div class="col-8">
            </div>
        </div>

        <div id="platform" class="visually-hidden">

            <div class="row mt-3 mb-1" >
                <div class="col-2">
                    <p class="h5">选择科室</p>
                </div>

                <div class="col-1">
                </div>

                <div class="col-4">
                    <p id="noWorkTitle" class="h5">未安排工作</p>
                </div>

                <div class="col-1">
                </div>

                <div class="col-4">
                    <p id="workTitle" class="h5">已安排工作</p>
                </div>
            </div>

            <div class="row mt-1 mb-1">
                <div class="col-2">
                    <select @change="flush" class="form-select" id="selectDepartment" v-model="request.selectedDep">
                        <option value="default">请选择科室...</option>
                        <option v-for="(department, key) in data1.departments" :key="key" :value="department.dep_no">{{department.dep_name}}</option>
                    </select>

                </div>
                <div class="col-1">
                </div>
                <div class="col-4">
                    <ul class="list-group" id="list1">
                    </ul>
                </div>


                <div class="col-1">
                </div>

                <div class="col-4">
                    <ul class="list-group" id="list2">
                    </ul>
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