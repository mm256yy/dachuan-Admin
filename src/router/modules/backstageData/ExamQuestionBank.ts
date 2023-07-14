import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/backstageData/ExamQuestionBank',
  component: Layout,
  redirect: '/backstageData/ExamQuestionBank/grade',
  name: 'ExamQuestionBank',
  meta: {
    title: '考试题库',
    i18n: 'route.multimenu.root',
    icon: 'heroicons-solid:menu-alt-3',
    sidebar:false
  },
  children: [
    {
      path: 'grade',
      name: 'grade',
      component: () => import('@/views/backstageData/ExamQuestionBank/grade/grade.vue'),
      meta: {
        title: '年级管理',sidebar: false,
      },
    },
    {
      path: 'class',
      name: 'class',
      component: () => import('@/views/backstageData/ExamQuestionBank/class/class.vue'),
      meta: {
        title: '班级管理',sidebar: false,
      },
    },
    {
      path: 'subject',
      name: 'subject',
      component: () => import('@/views/backstageData/ExamQuestionBank/subject/subject.vue'),
      meta: {
        title: '科目管理',sidebar: false,
      },
    },



    {
      path: 'questionbank',
      name: 'questionbank',
      component: () => import('@/views/backstageData/ExamQuestionBank/questionbank/questionbank.vue'),
      meta: {
        title: '题库管理',sidebar:false
      },
    },
    {
      path: 'practivelist/:id',
      name: 'practivelist',
      component: () => import('@/views/backstageData/ExamQuestionBank/questionbank/practivelist.vue'),
      meta: {
        title: '题库练习记录',sidebar: false,
      },
    },
    {
      path: 'testquestions',
      name: 'testquestions',
      component: () => import('@/views/backstageData/ExamQuestionBank/testquestions/testquestions.vue'),
      meta: {
        title: '试题管理',sidebar: false,
      },
    },


    {
      path: 'addTestquestions/:id',
      name: 'addTestquestions',
      component: () => import('@/views/backstageData/ExamQuestionBank/testquestions/addTestquestions.vue'),
      meta: {
        title: '新增试题',sidebar:false
      },
    },
    {
      path: 'examinationpaper',
      name: 'examinationpaper',
      component: () => import('@/views/backstageData/ExamQuestionBank/examinationpaper/examinationpaper.vue'),
      meta: {
        title: '考卷管理',sidebar: false,
      },
    },
    {
      path: 'testList',
      name: 'testList',
      component: () => import('@/views/backstageData/ExamQuestionBank/examinationpaper/testList.vue'),
      meta: {
        title: '考试列表',sidebar: false,
      },
    },
    {
      path: 'configuration/:id',
      name: 'configuration',
      component: () => import('@/views/backstageData/ExamQuestionBank/examinationpaper/configuration.vue'),
      meta: {
        title: '考卷详情',sidebar: false,
      },
    },

    {
      path: 'student',
      name: 'student',
      component: () => import('@/views/backstageData/ExamQuestionBank/student/student.vue'),
      meta: {
        title: '学员管理',sidebar: false,
      },
    },


  ],
}

export default routes
