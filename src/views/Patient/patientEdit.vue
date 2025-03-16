<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import config from "@/config/config";


const formData = reactive({
    patient_id: '',
    patient_name: '',
    patient_sex: '',
    patient_birthdate: '',
    patient_phone: '',
    patient_password: '',
    create_time: ''
});

onMounted(async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}app/patient/getPatient`,
        method: 'get'
    }).then(response => {
        formData.patient_id = response.data.patient_id;
        formData.patient_name = response.data.patient_name;
        formData.patient_sex = response.data.patient_sex;
        formData.patient_birthdate = response.data.patient_birthdate;
        formData.patient_phone = response.data.patient_phone
        formData.patient_password = response.data.patient_password;
        formData.create_time = response.data.create_time;
    }).catch(error => {
        console.log(error);
    });
});

function submitEdit() {
    axios({
        url: `${config.spring_cloud_gateway_url}app/patient/edit/editHandle`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            patient_id: formData.patient_id,
            patient_name: formData.patient_name,
            patient_sex: formData.patient_sex,
            patient_birthdate: formData.patient_birthdate,
            patient_phone: formData.patient_phone,
            patient_password: formData.patient_password
        }
    }).then(response => {
        alert(response.data.message);
        if (response.data.status === 'ok') {
            localStorage.removeItem("jwt_patient");
            window.location.href = "/patient/login";
        }
    }).catch(error => {
        console.log(error);
    });

}

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
                <form @submit.prevent="submitEdit" id="editForm" style="text-align: center">
                    <div class="input-group mb-3 justify-content-center">
                        <h4>修改个人信息</h4>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text">身份证号码</span>
                        <input type="text" class="form-control" readonly disabled v-model="formData.patient_id"/>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">姓名</span>
                        <input type="text" class="form-control" v-model="formData.patient_name"/>
                    </div>


                    <div class="input-group mb-3">
                        <span class="input-group-text">性别</span>
                        <select id="sex" name="sex" class="form-select form-control" v-model="formData.patient_sex">
                            <option value="男">男</option>
                            <option value="女">女</option>
                        </select>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">出生日期</span>
                        <input type="date" class="form-control" placeholder="出生日期" v-model="formData.patient_birthdate"/>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">电话号码</span>
                        <input type="number" class="form-control" placeholder="电话号码" v-model="formData.patient_phone"/>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">登录密码</span>
                        <input type="password" class="form-control" placeholder="修改登录密码" v-model="formData.patient_password"/>
                    </div>


                    <div class="input-group mb-3">
                        <input type="submit" class="btn btn-primary btn-block form-control" value="提交修改" />
                    </div>

                </form>
            </div>

            <div class="col-2 border-end"></div>
        </div>

    </div>
</template>

<style scoped>

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type='number'] {
    -moz-appearance: textfield;
}
</style>