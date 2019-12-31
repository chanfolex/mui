export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    // authority: [11, 12, 13, 14, 21, 22, 31, 32, 41, 42, 43],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/Workplace' },

      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          // {
          //   path: '/dashboard/monitor',
          //   name: 'monitor',
          //   component: './Dashboard/Monitor',
          // },
          // {
          //   path: '/dashboard/notify',
          //   name: 'notify',
          //   component: './Account/Center/Center',
          // },
          // {
          //   path: '/account/notify/articles',
          //   component: './Account/Center/Articles',
          //  },
          // {
          //   path: '/dashboard/notifydetail',
          //   name: 'notifydetail',
          //   component: './Account/Center/Center',
          // },
        ],
      },

      {
        name: 'notify',
        icon: 'user',
        path: '/notify',
        routes: [
          {
            path: '/notify/index',
            name: 'index',
            component: './Notify/Center/Index',
          },
          // {
          //   path: '/notify/center',
          //   name: 'center',
          //   component: './Notify/Center/Center',
          //   routes: [
          //     {
          //       path: '/notify/center',
          //       redirect: '/notify/center/articles',
          //     },
          //     {
          //       path: '/notify/center/articles',
          //       component: './Notify/Center/Articles',
          //     },
          //     {
          //       path: '/notify/center/applications',
          //       component: './Notify/Center/Applications',
          //     },
          //     {
          //       path: '/notify/center/projects',
          //       component: './Notify/Center/Projects',
          //     },
          //   ],
          // },
          // {
          //   path: '/notify/detail',
          //   name: 'detail',
          //   component: './Notify/Detail/Index',
          // },
        ],
      },

      {
        path: '/resource',
        name: 'resource',
        icon: 'appstore',
        authority: [11, 12, 13, 14],
        routes: [
          {
            path: '/resource/category',
            name: 'category',
            authority: 11,
            component: './Resource/Category',
          },
          {
            path: '/resource/type',
            name: 'types',
            authority: 12,
            component: './Resource/Types',
          },
          {
            path: '/resource/storage',
            name: 'storage',
            component: './Resource/Storage',
          },
          {
            path: '/resource/product',
            name: 'product',
            authority: 13,
            component: './Resource/Product/Index',
          },
          // {
          //   path: '/resource/grade',
          //   name: 'grade',
          //   authority: 14,
          //   component: './Resource/Grade',
          // },
          {
            path: '/resource/client',
            name: 'client',
            component: './Purchase/Client/index',
          },
          {
            path: '/resource/supporter',
            name: 'supporter',
            component: './Purchase/Supporter/index',
          },
        ],
      },

      {
        path: '/sales',
        name: 'sales',
        icon: 'book',
        authority: [31, 32, 33, 34, 35, 36],
        routes: [
          {
            path: '/sales/storage',
            name: 'storage',
            component: './Sales/Storage/Index',
          },
          {
            path: '/sales/insert',
            name: 'insert',
            component: './Sales/Contract/Insert',
          },
          {
            path: '/sales/export',
            name: 'export',
            component: './Sales/Contract/Export',
          },
          // {
          //   path: '/sales/return',
          //   name: 'return',
          //   component: './Sales/Contract/Insert',
          // },
          // {
          //   path: '/sales/exchange',
          //   name: 'exchange',
          //   component: './Sales/Contract/Insert',
          // },
          {
            path: '/sales/insert_recorder',
            name: 'insert_recorder',
            component: './Sales/Process/Insert',
          },
          {
            path: '/sales/export_recorder',
            name: 'export_recorder',
            component: './Sales/Process/Export',
          },
        ],
      },

      {
        path: '/system',
        name: 'system',
        icon: 'setting',
        authority: [41, 42, 43],
        routes: [
          {
            path: '/system/user',
            name: 'user',
            authority: 41,
            component: './System/User/User',
          },
          {
            path: '/system/role',
            name: 'role',
            authority: 42,
            component: './System/Role/Role',
          },
          {
            path: '/system/info',
            name: 'info',
            authority: 43,
            component: './System/System',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu: true,
        // authority: [41, 42],
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/mail',
                component: './Account/Settings/MailView',
              },
            ],
          },
        ],
      },
      // // forms
      // {
      //   path: '/form',
      //   icon: 'form',
      //   name: 'form',
      //   routes: [
      //     {
      //       path: '/form/basic-form',
      //       name: 'basicform',
      //       component: './Forms/BasicForm',
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'stepform',
      //       component: './Forms/StepForm',
      //       hideChildrenInMenu: true,
      //       routes: [
      //         {
      //           path: '/form/step-form',
      //           redirect: '/form/step-form/info',
      //         },
      //         {
      //           path: '/form/step-form/info',
      //           name: 'info',
      //           component: './Forms/StepForm/Step1',
      //         },
      //         {
      //           path: '/form/step-form/confirm',
      //           name: 'confirm',
      //           component: './Forms/StepForm/Step2',
      //         },
      //         {
      //           path: '/form/step-form/result',
      //           name: 'result',
      //           component: './Forms/StepForm/Step3',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'advancedform',
      //       authority: ['admin'],
      //       component: './Forms/AdvancedForm',
      //     },
      //   ],
      // },
      // // list
      // {
      //   path: '/list',
      //   icon: 'table',
      //   name: 'list',
      //   routes: [
      //     {
      //       path: '/list/table-list',
      //       name: 'searchtable',
      //       component: './List/TableList',
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'basiclist',
      //       component: './List/BasicList',
      //     },
      //     {
      //       path: '/list/card-list',
      //       name: 'cardlist',
      //       component: './List/CardList',
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'searchlist',
      //       component: './List/List',
      //       routes: [
      //         {
      //           path: '/list/search',
      //           redirect: '/list/search/articles',
      //         },
      //         {
      //           path: '/list/search/articles',
      //           name: 'articles',
      //           component: './List/Articles',
      //         },
      //         {
      //           path: '/list/search/projects',
      //           name: 'projects',
      //           component: './List/Projects',
      //         },
      //         {
      //           path: '/list/search/applications',
      //           name: 'applications',
      //           component: './List/Applications',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   icon: 'profile',
      //   routes: [
      //     // profile
      //     {
      //       path: '/profile/basic',
      //       name: 'basic',
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'advanced',
      //       authority: ['admin'],
      //       component: './Profile/AdvancedProfile',
      //     },
      //   ],
      // },
      // {
      //   name: 'result',
      //   icon: 'check-circle-o',
      //   path: '/result',
      //   routes: [
      //     // result
      //     {
      //       path: '/result/success',
      //       name: 'success',
      //       component: './Result/Success',
      //     },
      //     { path: '/result/fail', name: 'fail', component: './Result/Error' },
      //   ],
      // },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      // {
      //   name: 'account',
      //   icon: 'user',
      //   path: '/account',
      //   routes: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: './Account/Center/Center',
      //       routes: [
      //         {
      //           path: '/account/center',
      //           redirect: '/account/center/articles',
      //         },
      //         {
      //           path: '/account/center/articles',
      //           component: './Account/Center/Articles',
      //         },
      //         {
      //           path: '/account/center/applications',
      //           component: './Account/Center/Applications',
      //         },
      //         {
      //           path: '/account/center/projects',
      //           component: './Account/Center/Projects',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: './Account/Settings/Info',
      //       routes: [
      //         {
      //           path: '/account/settings',
      //           redirect: '/account/settings/base',
      //         },
      //         {
      //           path: '/account/settings/base',
      //           component: './Account/Settings/BaseView',
      //         },
      //         {
      //           path: '/account/settings/security',
      //           component: './Account/Settings/SecurityView',
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           component: './Account/Settings/BindingView',
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           component: './Account/Settings/NotificationView',
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        component: '404',
      },
    ],
  },
];
