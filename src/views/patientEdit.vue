<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';

const patient = reactive({
    id: '',
    name: '',
    sex: '',
    birthdate: ''
});

onMounted(async () => {
    await axios({
        url: 'http://localhost:8080/patient/interface/getPatient',
        method: 'get'
    }).then(response => {
        patient.id = response.data.id;
        patient.name = response.data.name;
        patient.sex = response.data.sex;
        patient.birthdate = response.data.birthdate;
    }).catch(error => {
        console.log(error);
    });
});

</script>

<template>
    <div class="container-fluid mt-1">
        <patientHeader></patientHeader>             <!--病人个人信息 -->

        <hr>

        <div class="row">
            <div class="col-2">
                <patientNav></patientNav>             <!--病人导航栏 -->
            </div>

            <div class="col-1 border-start"></div>

            <div class="col-7" id="content">
                <form id="editForm" style="text-align: center">
                    <div class="input-group mb-3 justify-content-center">
                        <h4>修改个人信息</h4>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">身份证号码</span>
                        <input type="text" disabled class="form-control" name="id" id="id" v-model="patient.id"/>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">姓名</span>
                        <input type="text" class="form-control" name="name" id="name" v-model="patient.name"/>
                    </div>


                    <div class="input-group mb-3">
                        <span class="input-group-text">性别</span>
                        <select id="sex" name="sex" class="form-select form-control" v-model="patient.sex">
                            <option value="男">男</option>
                            <option value="女">女</option>
                        </select>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text">出生日期</span>
                        <input type="date" class="form-control" name="birthdate" id="birthdate" placeholder="出生日期" v-model="patient.birthdate"/>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">登录密码</span>
                        <input type="password" class="form-control" name="password" id="password" placeholder="修改登录密码"/>
                    </div>


                    <div class="input-group mb-3">
                        <input type="submit" class="btn btn-primary btn-block form-control" name="register" id="register" value="提交修改" />
                    </div>

                </form>
            </div>

            <div class="col-2 border-end"></div>
        </div>

    </div>
</template>

<style scoped>

</style>