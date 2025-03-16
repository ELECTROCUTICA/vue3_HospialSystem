import { createRouter, createWebHistory } from 'vue-router'
import PatientLogin from "@/views/Patient/patientLogin.vue";
import PatientRegister from "@/views/Patient/patientRegister.vue";
import PatientHeader from "@/components/patientHeader.vue";
import PatientNav from "@/components/patientNav.vue";
import PatientHome from "@/views/Patient/patientHome.vue";
import PatientRecord from "@/views/Patient/patientRecord.vue";
import PatientEdit from "@/views/Patient/patientEdit.vue";
import PatientLogout from "@/views/Patient/patientLogout.vue";
import PatientRegistration from "@/views/Patient/patientRegistration.vue";
import AdminLogin from "@/views/Admin/adminLogin.vue";
import AdminNav from "@/components/adminNav.vue";
import AdminLogout from "@/views/Admin/adminLogout.vue";
import AdminHome from "@/views/Admin/adminHome.vue";
import AdminDoctorInfo from "@/views/Admin/adminDoctorInfo.vue";
import AdminDepartment from "@/views/Admin/adminDepartment.vue";
import AdminSchedule from "@/views/Admin/adminSchedule.vue";
import AdminPatientManager from "@/views/Admin/adminPatientManager.vue";
import errorPage from "@/views/Common/errorPage.vue";
import doctorHeader from "@/components/doctorHeader.vue";
import doctorNav from "@/components/doctorNav.vue";
import doctorPatientsList from "@/views/Doctor/doctorPatientsList.vue";
import doctorLogin from "@/views/Doctor/doctorLogin.vue";
import doctorLogout from "@/views/Doctor/doctorLogout.vue";
import PatientAIAdvice from "@/views/Patient/patientAIAdvice.vue";
import AdminTitleManager from "@/views/Admin/adminTitleManager.vue";
import AdminNoonManager from "@/views/Admin/adminNoonManager.vue";
import PatientSearchDoctor from "@/views/Patient/patientSearchDoctor.vue";

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
      title: 'patientHeader',
      requiresAuth: true
    },
    component: PatientHeader
  },
  {
    path: '/patient/patientNav',
    name: 'PatientNav',
    meta: {
      title: 'patientNav',
      requiresAuth: true
    },
    component: PatientNav
  },
  {
    path: '/patient/home',
    name: 'PatientHome',
    meta: {
      title: '挂号预约-主页',
      requiresAuth: true
    },
    component: PatientHome
  },
  {
    path: '/patient/ai',
    name: 'AIAdvice',
    meta: {
      title: '挂号预约-DeepSeek智能导诊',
      requiresAuth: true
    },
    component: PatientAIAdvice
  },
  {
    path: '/patient/registration',
    name: 'PatientRegistration',
    meta: {
      title: '挂号预约-按科室挂号',
      requiresAuth: true
    },
    component: PatientRegistration
  },
  {
    path: '/patient/searchDoctor',
    name: 'PatientSearchDoctor',
    meta: {
      title: '挂号预约-搜索医生挂号',
      requiresAuth: true
    },
    component: PatientSearchDoctor
  },
  {
    path: '/patient/record',
    name: 'PatientRecord',
    meta: {
      title: '挂号预约-个人挂号预约记录',
      requiresAuth: true
    },
    component: PatientRecord
  },
  {
    path: '/patient/edit',
    name: 'PatientEdit',
    meta: {
      title: '挂号预约-修改个人信息',
      requiresAuth: true
    },
    component: PatientEdit
  },
  {
    path: '/patient/logout',
    name: 'PatientLogout',
    meta: {
      title: '登出系统',
      requiresAuth: true
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
    path: '/admin/departments',
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
  },
  {
    path: '/admin/noonManager',
    name: 'AdminNoonManager',
    meta: {
      title: '医院管理系统-午别时间管理'
    },
    component: AdminNoonManager
  },
  {
    path: '/admin/titleManager',
    name: 'AdminTitleManager',
    meta: {
      title: '医院管理系统-职称信息管理'
    },
    component: AdminTitleManager
  },
  {
    path: '/doctor/login',
    name: 'DoctorLogin',
    meta: {
      title: '医生就诊系统-登录页'
    },
    component: AdminLogout
  },
  {
    path: '/doctor/login',
    name: 'DoctorLogin',
    meta: {
      title: '医生就诊系统-登录页'
    },
    component: doctorLogin
  },
  {
    path: '/doctor/doctorHeader',
    name: 'DoctorHeader',
    meta: {
      title: 'doctorHeader'
    },
    component: doctorHeader
  },
  {
    path: '/doctor/doctorNav',
    name: 'DoctorNav',
    meta: {
      title: 'doctorNav'
    },
    component: doctorNav
  },
  {
    path: '/doctor/list',
    name: 'doctorPatientsList',
    meta: {
      title: '患者就诊列表'
    },
    component: doctorPatientsList
  },
  {
    path: '/doctor/logout',
    name: 'doctorLogout',
    meta: {
      title: '医生登出'
    },
    component: doctorLogout
  },
  {
    path: '/error',
    name: 'Error',
    meta: {
      title: '错误页'
    },
    component: errorPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem("jwt_patient");
    if (!token) {
      next({name: 'PatientLogin'});
    }
    else {
      next();
    }
  }
  else {
    next();
  }
});
