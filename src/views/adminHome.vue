<script setup>

</script>

<template>
    <adminNav></adminNav>
    <div class="container">

        <div class="row mt-ex mb-5">

            <div class="col-3 d-flex p-0">
                <button class="btn btn-xl btn-outline-primary btn-block"><a href="/admin/schedule" class="list-group-item list-group-item-action"><i class="bi bi-calendar-range"></i>  医院排班管理</a></button>
            </div>

            <div class="col"></div>

            <div class="col-3 d-flex p-0">
                <button class="btn btn-xl btn-outline-primary btn-block"><a href="/admin/doctorinfo" class="list-group-item list-group-item-action"><i class="bi bi-person-gear"></i>  医生信息管理</a></button>
            </div>

            <div class="col"></div>

            <div class="col-3 d-flex p-0">
                <button class="btn btn-xl btn-outline-primary btn-block"><a href="/admin/department" class="list-group-item list-group-item-action"><i class="bi bi-diagram-3"></i>  科室部门管理</a></button>
            </div>

        </div>

    </div>

</template>

<style scoped>
.btn-xl {
    padding: 1rem 2rem;
    font-size: 1.5rem;
    border-radius: 0.6rem;
    width: 100%;
}
.mt-ex {
    margin-top:5rem;
}
</style>