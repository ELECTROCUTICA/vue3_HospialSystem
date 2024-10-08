<script setup>
import { reactive} from 'vue';
import axios from 'axios';

const formData = reactive({
    message: ''
});

const reply = reactive({
    response: ''
});

function submitMessage() {
    reply.response = '请稍等，AI正在组织语言...';
    axios({
        url: 'http://localhost:8080/patient/interface/requestAI',
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            message: formData.message,
        }
    }).then(response => {
        reply.response = response.data;

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

            <div class="col-8" id="content">          <!--实际内容 -->
                <form @submit.prevent="submitMessage" class="mb-5">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" name="message" v-model="formData.message" placeholder="请输入您的就医疑问，AI会给您精确的就诊建议"/>
                    </div>

                    <div class="input-group mb-3 justify-content-center">
                        <input type="submit" class="btn btn-primary btn-block form-control" name="requestAI" value="提交" />
                    </div>
                </form>

                <!--回复内容 -->
                <textarea class="form-control" v-model="reply.response" placeholder="AI会在此回复" rows="15" readonly></textarea>
            </div>

            <div class="col-1 border-end-0"></div>
        </div>
    </div>
</template>

<style scoped>

</style>