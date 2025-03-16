<script setup>
import { reactive, onMounted } from "vue";
import axios from 'axios';
import config from "@/config/config";

onMounted(async () => {
    document.querySelector("body").setAttribute("style", "background-color: #0dcaf0");
});

const formData = reactive({
    doctor_id: '',
    doctor_password: '',
});

const loginSubmit = async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}worker/doctor/login/loginHandle`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          doctor_id: formData.doctor_id,
          doctor_password: formData.doctor_password
        }
    }).then(response => {
        alert(response.data.message);
        if (response.data.status === 'ok') {
            window.location.href = '/doctor/list';
        }
    }).catch(error => {
        console.log(error);
    });
};



</script>

<template>
    <div style="padding: 0">

        <div id="frame">
            <div style="width: 80%; margin: 0 auto">

                <h3 class="text-center mb-4">医师就诊系统登录</h3>

                <form @submit.prevent="loginSubmit" style="text-align: center">
                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-person-vcard"></i></span>
                        <input type="number" class="form-control" placeholder="职工号" v-model="formData.doctor_id"/>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                        <input type="password" class="form-control" placeholder="密码" v-model="formData.doctor_password"/>
                    </div>

                    <div class="input-group mb-3">
                        <input type="submit" class="btn btn-primary btn-block form-control" value="登陆"/>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<style scoped>
    #frame {
        background-color: white;
        opacity: 92%;
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

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type='number'] {
        -moz-appearance: textfield;
    }
</style>