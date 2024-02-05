<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<template>
    <el-row class="tac">
      <el-col :span="12">
        <!-- <h5 class="mb-2">Default colors</h5> -->
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><icon-menu /></el-icon>
              <span>ERC20</span>
            </template>
            <el-menu-item index="1-1">
              <el-icon><location /></el-icon>
                <router-link to="/erc20Transfer" class="custom-router-link"> transfer</router-link>
            </el-menu-item>
            
            <el-menu-item index="1-2">
              <router-link to="/erc20Stake" class="custom-router-link"> 质押</router-link>
            </el-menu-item>
            <el-menu-item index="1-3">
              <router-link to="/erc20Swap" class="custom-router-link"> swap</router-link>
            </el-menu-item>
           
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><document /></el-icon>
              <span>ERC721</span>
            </template>
            <!-- <el-sub-menu index="1-4">
              <template #title>item four</template>
              <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-sub-menu> -->
            <el-menu-item index="2-1">
              <el-icon><location /></el-icon>
                <router-link to="/erc721Transfer" class="custom-router-link"> transfer</router-link>
            </el-menu-item>
              <el-menu-item index="2-2">质押</el-menu-item>
           
          </el-sub-menu>
          
          <el-menu-item index="3" >
            <router-link to="/callContract" class="custom-router-link">
              <el-icon><setting /></el-icon>
              <span>合约调用</span>
            </router-link>
            
          </el-menu-item>

          <!-- <el-menu-item index="3" >
            <a href="https://widget.swapin.com/?apiKey=<YOUR_API_KEY>&<QUERY_PARAMETERS>" target="_blank">
              <el-icon><setting /></el-icon>
              <span>Sell your Crypto with Swapin</span>
              
          </a>
            
          </el-menu-item> -->
        </el-menu>
      </el-col>
      
    </el-row>
    
 
  </template>


<style scoped>
.tac{
  width: 400px;
}
.custom-router-link {
    text-decoration: none; /* 去除下划线 */
    color: inherit; /* 继承父元素的文字颜色 */
    /* 其他样式 */
}
.el-menu-vertical-demo{
  height: 100vh; /* 设置线的高度为视口的100% */
  
}
</style>
