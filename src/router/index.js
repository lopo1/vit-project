// 1. 定义路由组件.
// 也可以从其他文件导入
import Home from "../views/home.vue"
import Test from "@/views/menu/test.vue"
import Call from "@/views/menu/call.vue"
import ERC20Transfer from "@/views/common/ERC20Transfer.vue"
import Cw20Transfer from "@/views/common/Cw20Transfer.vue"
import Markets from "@/views/common/markets.vue"
import ERC20Stake from "@/views/common/ERC20Stake.vue"
import ERC20Swap from "@/views/common/Erc20Swap.vue"
import ERC721Transfer from "@/views/common/ERC721Transfer.vue"
import {createRouter, createWebHistory} from 'vue-router'

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  { path: '/', 
    component: Home ,
    children:[
      {path: 'test', 
       component: Test ,
      },
      {path: 'erc20Transfer', 
       component: ERC20Transfer ,
      },
      {path: 'erc20Stake', 
       component: ERC20Stake ,
      },
      {path: 'erc20Swap', 
       component: ERC20Swap ,
      },
      {path: 'erc721Transfer', 
       component: ERC721Transfer ,
      },
      {path: 'callContract', 
       component: Call ,
      },
      {path: 'cw20Transfer', 
       component: Cw20Transfer ,
      },
      {path: 'markets', 
       component: Markets ,
      }
    ]
  },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})

export default router