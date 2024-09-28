import { createRouter, createWebHistory } from 'vue-router'
import PatientLogin from "@/views/patientLogin.vue";
import PatientRegister from "@/views/patientRegister.vue";
import PatientHeader from "@/components/patientHeader.vue";
import PatientNav from "@/components/patientNav.vue";
import PatientHome from "@/views/patientHome.vue";
import PatientRecord from "@/views/patientRecord.vue";
import PatientEdit from "@/views/patientEdit.vue";
import PatientLogout from "@/views/patientLogout.vue";
import PatientRegistration from "@/views/patientRegistration.vue";
import AdminLogin from "@/views/adminLogin.vue";
import AdminNav from "@/components/adminNav.vue";
import AdminLogout from "@/views/adminLogout.vue";
import AdminHome from "@/views/adminHome.vue";
import AdminDoctorInfo from "@/views/adminDoctorInfo.vue";
import AdminDepartment from "@/views/adminDepartment.vue";
import AdminSchedule from "@/views/adminSchedule.vue";
import AdminPatientManager from "@/views/adminPatientManager.vue";

const routes = [
  {
    path: '/patient/login',
    name: 'PatientLogin',
    meta: {
      title: '预约挂号系统-登录页'
    },
    component: PatientLogin
  },
  {
    path: '/patient/register',
    name: 'PatientRegister',
    meta: {
      title: '预约挂号系统-注册页'
    },
    component: PatientRegister
  },
  {
    path: '/patient/patientHeader',
    name: 'PatientHeader',
    meta: {
      title: 'patientHeader'
    },
    component: PatientHeader
  },
  {
    path: '/patient/patientNav',
    name: 'PatientNav',
    meta: {
      title: 'patientNav'
    },
    component: PatientNav
  },
  {
    path: '/patient/home',
    name: 'PatientHome',
    meta: {
      title: '挂号预约-主页'
    },
    component: PatientHome
  },
  {
    path: '/patient/registration',
    name: 'PatientRegistration',
    meta: {
      title: '挂号预约-按科室挂号'
    },
    component: PatientRegistration
  },
  {
    path: '/patient/record',
    name: 'PatientRecord',
    meta: {
      title: '挂号预约-个人挂号预约记录'
    },
    component: PatientRecord
  },
  {
    path: '/patient/edit',
    name: 'PatientEdit',
    meta: {
      title: '挂号预约-修改个人信息'
    },
    component: PatientEdit
  },
  {
    path: '/patient/logout',
    name: 'PatientLogout',
    meta: {
      title: '登出系统'
    },
    component: PatientLogout
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    meta: {
      title: '医院管理系统-登录页'
    },
    component: AdminLogin
  },
  {
    path: '/admin/adminNav',
    name: 'AdminNav',
    meta: {
      title: 'adminNav'
    },
    component: AdminNav
  },
  {
    path: '/admin',
    name: 'AdminHome',
    meta: {
      title: '医院管理系统-主页'
    },
    component: AdminHome
  },
  {
    path: '/admin/schedule',
    name: 'AdminSchedule',
    meta: {
      title: '医院管理系统-医生排班管理'
    },
    component: AdminSchedule
  },
  {
    path: '/admin/doctorinfo',
    name: 'AdminDoctorInfo',
    meta: {
      title: '医院管理系统-医生信息管理'
    },
    component: AdminDoctorInfo
  },
  {
    path: '/admin/department',
    name: 'AdminDepartment',
    meta: {
      title: '医院管理系统-科室管理'
    },
    component: AdminDepartment
  },
  {
    path: '/admin/patientManager',
    name: 'AdminPatientManager',
    meta: {
      title: '医院管理系统-用户信息管理'
    },
    component: AdminPatientManager
  },
  {
    path: '/admin/logout',
    name: 'AdminLogout',
    meta: {
      title: '登出系统'
    },
    component: AdminLogout
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

router.beforeEach(async (to) => {
  document.title = to.meta.title;
});
