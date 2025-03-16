<script setup>
import { reactive, onMounted } from "vue"
import axios from 'axios'
import config from "@/config/config";

const formData = reactive({
    patient_id: '',
    patient_name: '',
    patient_sex: '',
    patient_birthdate: '',
    patient_phone: '',
    patient_password: '',
});

onMounted(async () => {
    document.querySelector("body").setAttribute("style", "background-color: #20c997");
});

const handleSubmit = async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}app/patient/register/registerHandle`,
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
            window.location.href = '/patient/login';
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

                <h3 class="text-center mb-4">预约挂号系统-病人注册</h3>

                <form @submit.prevent="handleSubmit" style="text-align: center">
                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-person-vcard"></i></span>
                        <input type="text" class="form-control" v-model="formData.patient_id" placeholder="身份证号码"/>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-card-text"></i></span>
                        <input type="text" class="form-control" v-model="formData.patient_name" placeholder="姓名"/>
                    </div>


                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-gender-ambiguous"></i></span>
                        <select v-model="formData.patient_sex" class="form-select form-control">
                            <option value="">请选择性别</option>
                            <option value="男">男</option>
                            <option value="女">女</option>
                        </select>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-calendar-event"></i></span>
                        <input type="date" class="form-control" v-model="formData.patient_birthdate" placeholder="出生日期"/>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-phone"></i></span>
                        <input type="number" class="form-control" v-model="formData.patient_phone" placeholder="电话号码"/>
                    </div>


                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                        <input type="password" class="form-control" v-model="formData.patient_password" placeholder="登录密码"/>
                    </div>

                    <div class="input-group mb-3">
                        <input type="submit" class="btn btn-primary btn-block form-control" value="注册" />
                    </div>

                    <div class="input-group mb-3">
                        <input type="button" class="btn btn-dark btn-block form-control" value="返回" onclick="window.location.href='/patient/login'"/>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<style scoped>

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

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type='number'] {
        -moz-appearance: textfield;
    }
</style>