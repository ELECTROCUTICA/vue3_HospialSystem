<script setup>
import { reactive, onMounted } from 'vue'
import axios from 'axios'

const formData = reactive({
    id: '',
    password: '',
});

onMounted(async () => {
    document.querySelector("body").setAttribute("style", "background-color: #20c997");
});

const handleSubmit = async () => {
    await axios({
        url: 'http://localhost:8080/patient/login/loginHandle',
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            id: formData.id,
            password: formData.password
        }
    }).then(response => {
        alert(response.data.message);
        if (response.data.state === 'ok') {
            window.location.href = 'http://localhost:8081/patient/home';
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

                <form @submit.prevent="handleSubmit" id="loginForm" style="text-align: center">
                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-person-vcard"></i></span>
                        <input type="text" class="form-control" name="id" v-model="formData.id" placeholder="身份证号码"/>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                        <input type="password" class="form-control" name="password" v-model="formData.password" placeholder="密码"/>
                    </div>

                    <div class="input-group mb-3">
                        <input type="submit" class="btn btn-primary btn-block form-control" name="login" id="login" value="登陆" />
                    </div>

                </form>

                <div class="input-group mb-3">
                    <input type="button" class="btn btn-dark btn-block form-control" name="goRegister" id="goRegister" value="前往注册" onclick="window.location.href='/patient/register'"/>
                </div>

                <div class="input-group mb-3">
                    <input type="button" class="btn btn-primary btn-block form-control" name="goDoctor" id="goDoctor" value="医生登入" onclick="window.location.href='/doctor/login'"/>
                </div>

                <div class="input-group mb-3">
                    <input type="button" class="btn btn-warning btn-block form-control" name="goAdmin" id="goAdmin" value="管理系统入口" onclick="window.location.href='/admin/login'"/>
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