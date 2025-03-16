<script setup>
import {reactive} from 'vue'

const error = reactive({
    code: '',
})

</script>

<template>
    <div>{{error.code}}</div>
</template>

<style scoped>

</style>