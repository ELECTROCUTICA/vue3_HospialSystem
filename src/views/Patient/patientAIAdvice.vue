<script setup>
import {onMounted, onUnmounted, reactive, ref} from 'vue';
import axios from 'axios';
import config from "@/config/config";
// eslint-disable-next-line no-unused-vars
import $ from 'jquery';

const formData = reactive({
    message: ''
});

const recommendation = reactive({
    schedule_id: '',
    doctor_id: 0,
    doctor_name: '',
    dep_name: '',
    title_name: '',
    remain_register_count: 0,
    work_date: '',
    noon_id: 0,
    noon_name: '',
    begin_time_hour: 0,
    begin_time_minute: 0,
    end_time_hour: 0,
    end_time_minute: 0,
    data_count: 0
});

const submitRegistrationFormData = reactive({
    doctor_id: 0,
    date: '',
    noon_id: ''
});

const complement = (value) => {
    return value < 10 ? `0${value}` : value.toString()
}

const reply = ref('');
const display_text = ref('');
const currentIndex = ref(0);  //字符索引
let intervalId = null;

const submitMessage = async () => {
    display_text.value = '请稍等，AI正在思考';
    $('#rec').addClass('visually-hidden');
    $('#rec').removeClass('show');
    const response = await axios({
        url: `${config.spring_cloud_gateway_url}app/patient/requestAI`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            message: formData.message,
        }
    });
    reply.value = response.data.message;
    //console.log(response.data);
    recommendation.data_count = response.data.data_count;
    if (recommendation.data_count > 0) {
        recommendation.schedule_id = response.data.recommendation.schedule_id;
        recommendation.doctor_id = response.data.recommendation.doctor_id;
        recommendation.doctor_name = response.data.recommendation.doctor_name;
        recommendation.dep_name = response.data.recommendation.dep_name;
        recommendation.title_name = response.data.recommendation.title_name;
        recommendation.remain_register_count = response.data.recommendation.remain_register_count;
        recommendation.work_date = response.data.recommendation.work_date;
        recommendation.noon_id = response.data.recommendation.noon_id;
        recommendation.noon_name = response.data.recommendation.noon_name;
        recommendation.begin_time_hour = response.data.recommendation.begin_time_hour;
        recommendation.begin_time_minute = response.data.recommendation.begin_time_minute;
        recommendation.end_time_hour = response.data.recommendation.end_time_hour;
        recommendation.end_time_minute = response.data.recommendation.end_time_minute;
    }
    startTypingEffect();
};

const startTypingEffect = () => {
    clearInterval(intervalId); // 清除已有定时器
    currentIndex.value = 0;    // 重置索引
    display_text.value = '';    // 清空显示

    intervalId = setInterval(() => {
        if (currentIndex.value < reply.value.length) {
            display_text.value += reply.value[currentIndex.value];
            currentIndex.value++;
        }
        else {
            clearInterval(intervalId);
            if (recommendation.data_count > 0) {
                $('#rec').removeClass('visually-hidden');

                $('#rec').addClass('show');
            }
        }
    }, 30); // 调整这个数字改变显示速度

};

const showConfirmRegisterModal = (r) => {
    submitRegistrationFormData.doctor_id = r.doctor_id;
    submitRegistrationFormData.date = r.work_date;
    submitRegistrationFormData.noon_id = r.noon_id;
    $('#doctor_info').val(`${r.doctor_name} ${r.dep_name} ${r.title_name}`);
    $('#visit_time').val(`${r.work_date} ${r.noon_name} ${r.begin_time_hour}:${complement(r.begin_time_minute)}-${r.end_time_hour}:${complement(r.end_time_minute)}`);
};

const submitRegistration = async () => {
    await axios({
        url: `${config.spring_cloud_gateway_url}app/patient/registration/submit`,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            doctor_id: submitRegistrationFormData.doctor_id,
            date: submitRegistrationFormData.date,
            noon_id: submitRegistrationFormData.noon_id
        }
    }).then((response) => {
        if (response.data.status === 'ok') {
            alert(response.data.message);
            $('#closeConfirmRegisterModal').click();
        }
        else {
            alert(response.data.message);
        }
    });
};


onMounted(async () => {
    document.getElementById('rec').style.animation = 'none';
});

onUnmounted(() => {
    clearInterval(intervalId);
});


</script>

<template>
    <div class="modal fade" id="confirmRegisterModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">确认挂号预约信息</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitRegistration">
                        <div class="input-group mb-3 visually-hidden">
                            <span class="input-group-text">doctor_id</span>
                            <input type="text" class="form-control" disabled v-model="submitRegistrationFormData.doctor_id">
                        </div>

                        <div class="input-group mb-3 visually-hidden">
                            <span class="input-group-text">date</span>
                            <input type="text" class="form-control" disabled v-model="submitRegistrationFormData.date">
                        </div>

                        <div class="input-group mb-3 visually-hidden">
                            <span class="input-group-text">noon_id</span>
                            <input type="text" class="form-control" disabled v-model="submitRegistrationFormData.noon_id">
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">医生信息</span>
                            <input type="text" class="form-control" id="doctor_info" disabled readonly>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">就诊时间</span>
                            <input type="text" class="form-control" id="visit_time" disabled readonly>
                        </div>

                        <div class="modal-footer">
                            <input type="submit" class="btn btn-primary btn-block" value="确定" />
                            <input type="button" class="btn btn-danger btn-block" id="closeConfirmRegisterModal" data-bs-dismiss="modal" value="取消"/>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>

    <div class="container-fluid mt-1">
        <patientHeader></patientHeader>             <!--病人个人信息 -->

        <hr>

        <div class="row">
            <div class="col-2">
                <patientNav></patientNav>             <!--病人导航栏 -->
            </div>

            <div class="col-1 border-start"></div>

            <div class="col-8" id="content">          <!--实际内容 -->
                <form @submit.prevent="submitMessage" class="mb-3">
                    <div class="input-group mb-4">
                        <input type="text" class="form-control" name="message" v-model="formData.message" placeholder="请输入您的就医疑问，AI会给您精确的就诊建议"/>
                    </div>

                    <div class="input-group mb-3 justify-content-center">
                        <input type="submit" class="btn btn-primary btn-block form-control" :class="{disabled : formData.message === ''}" name="requestAI" value="提交"/>
                    </div>
                </form>

                <!--回复内容 -->
                <textarea class="form-control mb-3" v-model="display_text" placeholder="DeepSeek 会在此回复您的疑问" rows="12" readonly></textarea>

                <ul id="rec" class="list-group list-group-horizontal justify-content-center visually-hidden" >
                    <li class="list-group-item justify-content-center">为您推荐以下可挂号医师：
                        <p class="fw-bold">{{recommendation.doctor_name}} {{recommendation.dep_name}} {{recommendation.title_name}}<br>
                            {{recommendation.work_date}} {{recommendation.noon_name}} {{recommendation.begin_time_hour}}:{{complement(recommendation.begin_time_minute)}}-{{recommendation.end_time_hour}}:{{complement(recommendation.end_time_minute)}}<br>
                            余号：{{recommendation.remain_register_count}}</p>
                        <button @click="showConfirmRegisterModal(recommendation)" class="btn btn-primary btn-block" data-bs-toggle="modal" data-bs-target="#confirmRegisterModal">立即挂号</button>
                    </li>
                </ul>

                <div class="mt-2 input-group mb-3 justify-content-center">
                    <img src="https://s21.ax1x.com/2025/02/14/pEK9UHg.png" alt="pEK9UHg.png" class="m-2"/>
<!--                    <img src="https://s21.ax1x.com/2025/02/14/pEK9fUJ.png" alt="pEK9fUJ.png" class="m-2"/>-->
                </div>
            </div>


            <div class="col-1 border-end-0"></div>
        </div>

    </div>
</template>

<style scoped>
@keyframes fadeOut {
    from { opacity: 0; }
    to { opacity: 1; }
}

#rec {
    opacity: 0;  /* 初始状态 */
    transition: opacity 1.5s ease;
}

#rec.show {
    opacity: 1; /* 最终不透明 */
}
#rec.hide1 {
    opacity: 0; /* 最终不透明 */
}
</style>