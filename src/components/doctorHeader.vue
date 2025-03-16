<script setup>
import { reactive, onMounted } from "vue"
import axios from "axios"
import config from "@/config/config";

const doctor = reactive({
    doctor_id: null,
    doctor_name: '',
    dep_no: null,
    dep_name: '',
    title_no: -1,
    title_name: ''
});

onMounted(async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}worker/doctor/getDoctor`,
        method: 'get'
    }).then(response => {
        doctor.doctor_id = response.data.doctor_id;
        doctor.doctor_name = response.data.doctor_name;
        doctor.dep_no = response.data.dep_no;
        doctor.dep_name = response.data.dep_name;
        doctor.title_no = response.data.title_no;
        doctor.title_name = response.data.title_name;
    }).catch(error => {
        console.log(error);
    });
});

</script>

<template>
    <div id="doctorHeader">
        <div class="card" id="frame">
            <div class="card-body">
                <div class="row mb-1">
                    <div class="col-4 mt-1">
                        <h3 class="card-title text-white" >{{doctor.doctor_name}}</h3>
                    </div>
                    <div class="col-8 mt-1">
                        <p>{{doctor.dep_name}} {{doctor.title_name}}</p>
                    </div>
                </div>
                <p class="card-text mt2">职工号：{{doctor.doctor_id}}</p>
            </div>
        </div>

    </div>
</template>

<style scoped>
    #frame {
        background-color: #10adc2;
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