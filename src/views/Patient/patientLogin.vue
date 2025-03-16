<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import config from "@/config/config";

const formData = reactive({
    patient_id: '',
    patient_password: '',
});

onMounted(async () => {
    document.querySelector("body").setAttribute("style", "background-color: #20c997");
});

const loginSubmit = async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}app/patient/login/loginHandle`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            patient_id: formData.patient_id,                //不一定是身份证号码，也能是手机号
            patient_password: formData.patient_password
        }
    }).then(response => {
        localStorage.setItem("jwt_patient", response.data.patient_token);

        alert(response.data.message);
        if (response.data.status === 'ok') {
            window.location.href = '/patient/home';
        }
    }).catch(error => {
        console.log(error);
    });
}
</script>

<template>
    <div style="padding: 0">
        <div id="frame">
            <div style="width: 80%; margin: 0 auto">

                <h3 class="text-center mb-4">预约挂号登录</h3>

                <form @submit.prevent="loginSubmit" id="loginForm" style="text-align: center">
                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-person-vcard"></i></span>
                        <input type="text" class="form-control" v-model="formData.patient_id" placeholder="身份证号码/手机号"/>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                        <input type="password" class="form-control" v-model="formData.patient_password" placeholder="密码"/>
                    </div>

                    <div class="input-group mb-4">
                        <input type="submit" class="btn btn-primary btn-block form-control" value="登陆" />
                    </div>

                </form>

                <div class="input-group mb-3">
                    <input type="button" class="btn btn-dark btn-block form-control" value="前往注册" onclick="window.location.href='/patient/register'"/>
                </div>

                <div class="input-group mb-3">
                    <input type="button" class="btn btn-primary btn-block form-control" value="医生登入" onclick="window.location.href='/doctor/login'"/>
                </div>

                <div class="input-group mb-3">
                    <input type="button" class="btn btn-warning btn-block form-control" value="管理系统入口" onclick="window.location.href='/admin/login'"/>
                </div>

            </div>
        </div>
    </div>
</template>



<style scoped>
    :deep(body) {
        background-color: #20c997;
    }

    #frame {
        background-color: white;
        opacity: 93%;
        width: 450px;
        margin: 100px auto;
        text-align: center;
        border: 1px solid #eee;
        padding: 30px 0 50px 0;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
    a {
        text-decoration: none;
    }
    input[type="submit"] {
        margin-top: 5%;
        margin-bottom: 2%;
        width: 80%;
        height: 35px;
        font-size: medium;
    }
</style>