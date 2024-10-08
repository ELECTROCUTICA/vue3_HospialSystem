<script setup>
import { reactive, onMounted } from "vue"
import axios from "axios"

const patient = reactive({
    id: '',
    name: '',
    sex: '',
    age: ''
});

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_patient');
        config.headers['Authorization'] = `${token}`;
        return config;
    },
);


onMounted(async () => {
    await axios({
        url: 'http://localhost:8080/patient/interface/getPatient',
        method: 'get'
    }).then(response => {
        patient.id = response.data.id;
        patient.name = response.data.name;
        patient.sex = response.data.sex;
        patient.age = response.data.age;
    }).catch(error => {
        console.log(error);
    });


    // await axios({
    //     url: 'http://localhost:5000/patient/api/getPatient',
    //     method: 'get'
    // }).then(response => {
    //     patient.id = response.data.id;
    //     patient.name = response.data.name;
    //     patient.sex = response.data.sex;
    //     patient.age = response.data.age;
    // }).catch(error => {
    //     console.log(error);
    // });
});


</script>

<template>
    <div id="patientHeader">
        <div class="card" id="frame">
            <div class="card-body">
                <div class="row mb-1">
                    <div class="col-4 mt-1">
                        <h3 class="card-title text-white" v-text="patient.name"></h3>
                    </div>
                    <div class="col-8 mt-1">
                        <p> {{patient.sex}}  {{patient.age}}岁</p>
                    </div>
                </div>
                <p>身份证号码：{{patient.id}}</p>
            </div>
        </div>
    </div>
</template>



<style scoped>

    #frame {
        background-color: #13c08b;
        opacity: 87%;
        width: 350px;
        margin: 5px;
        border: 1px solid #eee;
        padding: 5px 0 5px 0;
        border-radius: 10px;
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
    }
    p {
        font-size: 18px;
        color: white;
    }
</style>