<script setup>
import { reactive, onMounted } from "vue"
import axios from 'axios'

const formData = reactive({
    id: '',
    name: '',
    sex: '',
    birthdate: '',
    password: '',
});

onMounted(async () => {
    document.querySelector("body").setAttribute("style", "background-color: #20c997");
});

const handleSubmit = async () => {
    await axios({
        url: 'http://localhost:8080/patient/register/registerHandle',
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            id: formData.id,
            name: formData.name,
            sex: formData.sex,
            birthdate: formData.birthdate,
            password: formData.password
        }
    }).then(response => {
        alert(response.data.message);
        if (response.data.state === 'ok') {
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

                <h3 class="text-center mb-4">预约挂号系统病人注册</h3>

                <form @submit.prevent="handleSubmit" style="text-align: center">
                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-person-vcard"></i></span>
                        <input type="text" class="form-control" name="id" v-model="formData.id" placeholder="身份证号码"/>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-card-text"></i></span>
                        <input type="text" class="form-control" name="name" v-model="formData.name" placeholder="姓名"/>
                    </div>


                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-gender-ambiguous"></i></span>
                        <select v-model="formData.sex" name="sex" class="form-select form-control">
                            <option value="">请选择</option>
                            <option value="男">男</option>
                            <option value="女">女</option>
                        </select>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-calendar-event"></i></span>
                        <input type="date" class="form-control" name="birthdate" v-model="formData.birthdate" placeholder="出生日期"/>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                        <input type="password" class="form-control" name="password" v-model="formData.password" placeholder="登录密码"/>
                    </div>

                    <div class="input-group mb-3">
                        <input type="submit" class="btn btn-primary btn-block form-control" name="register" id="register" value="注册" />
                    </div>

                    <div class="input-group mb-3">
                        <input type="button" class="btn btn-dark btn-block form-control" name="back" id="back" value="返回" onclick="window.location.href='/patient/login'"/>
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
</style>