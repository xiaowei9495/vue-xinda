import Vue from 'vue';
import Router from 'vue-router';

import main from '../view/main.vue'; // 商品展示、会员中心展示页
import user from '../view/user.vue'; // 登录、注册、忘记密码展示页
import storeList from '../view/store/storeList.vue'
import storeIndex from '../view/store/storeIndex.vue'


import services from '../view/list/services.vue'
import sifco from '../view/list/sifco.vue'

import us from '../view/us/us.vue';
import cart from '../view/cart/cart.vue'

import index from '../view/index/index'

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      name: 'Main',
      component: main,
      children: [{
          path: '/index',
          name: 'index',
          alias: '/',
          component: index,
        },
        {

          path: '/services',
          name: 'services',
          component: services
        },
        {
          path: '/sifco',
          name: 'sifco',
          component: sifco
        },
        {

          path: '/storeList',
          name: 'storeList',
          component: storeList
        },
        {

          path: '/storeIndex',
          name: 'storeIndex',
          component: storeIndex
        },
        // 加盟我们{
        {
          path: '/us',
          name: 'us',
          component: us
        }
      ]
    },
    {
      path: '/user',
      name: 'User',
      component: user
    }
  ]
})
