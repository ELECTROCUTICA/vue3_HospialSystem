<script setup>
import { reactive, onMounted } from "vue"
import axios from "axios"
import config from "@/config/config";

const patient = reactive({
    patient_id: '',
    patient_name: '',
    patient_sex: '',
    patient_birthdate: '',
    patient_age: -1
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
        url: `${config.spring_cloud_gateway_url}app/patient/getPatient`,
        method: 'get'
    }).then(response => {
        patient.patient_id = response.data.patient_id;
        patient.patient_name = response.data.patient_name;
        patient.patient_sex = response.data.patient_sex;
        patient.patient_birthdate = response.data.patient_birthdate;
        patient.patient_age = response.data.patient_age;
        
    }).catch(error => {
        console.log(error);
    });

});


</script>

<template>
    <div id="patientHeader">
        <div class="card" id="frame">
            <div class="card-body">
                <div class="row mb-1">
                    <div class="col-4 mt-1">
                        <h3 class="card-title text-white" v-text="patient.patient_name"></h3>
                    </div>
                    <div class="col-8 mt-1">
                        <p> {{patient.patient_name}}  {{patient.patient_age}}岁</p>
                    </div>
                </div>
                <p>身份证号码：{{patient.patient_id}}</p>
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