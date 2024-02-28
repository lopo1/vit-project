<template>
    <el-menu
      :default-active="activeIndexChain || activeIndexWallet"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <el-menu-item index="0">
        <img
          style="width: 100px"
          src="/src/assets/public/images/element-plus-logo.svg"
          alt="Element logo"
        />
      </el-menu-item>
      <div class="flex-grow" />
      <el-sub-menu index="1">
        <template #title>{{ chainName }}</template>
        <el-menu-item :index="`1-${item.chainId}`" v-for="item in chainList" :key="item.id"  @click="handleClick(item)">{{ item.name }}</el-menu-item>
        
      </el-sub-menu>
      
      
      <p @click="showDrawer" v-if="userInfo.isConnected">{{ formattedString() }}</p>
      
      
      <div class="connectCl">
        <el-button type="warning" round @click="showDrawer" v-if="!isConnected" style="margin-top: 10px;">
        连接
      </el-button>
      <div v-if="visible" class="drawer-container">
        
        
        <el-drawer
        v-model="drawerVisible" 
          :show-close="false" 
        title="Connect a wallet"
        :visible="false"
        direction="rtl"
        :size="400"
        :before-close="handleBeforeClose"
        class="wallet-list"
      >
      <el-icon><DArrowRight /></el-icon>
      <template #header="{ titleId, titleClass }" v-if="!isConnected">
            <h4 :id="titleId" :class="titleClass">Connect a wallet</h4>
            <el-button type="danger" @click="closeDrawer">
              <el-icon><SwitchButton /></el-icon>
              Close
            </el-button>
            
      </template>
      <template #header="{ titleId, titleClass }" v-if="isConnected">
        <div class="title-container" @mouseover="showIcon = true" @mouseleave="showIcon = false" @click="performAction">
            <h4 :id="titleId" :class="titleClass">{{ formattedString() }}</h4>
            <el-icon v-if="showIcon" >
              <copy-document />
            </el-icon>
        </div>
            <el-button type="danger" @click="closeDrawer">
              <el-icon><SwitchButton /></el-icon>
              Close
            </el-button>
            <el-button type="danger" @click="disConnect">
              <el-icon><SwitchButton /></el-icon>
              Disconnect
            </el-button>
            
      </template>
    <div
      class="wallet-item"
      v-for="wallet in wallets"
      :key="wallet.name"
      @click="connectWallet(wallet.name)" v-if="!isConnected"
    >
      <el-avatar :src="wallet.icon"><img :src="wallet.icon" alt="Wallet Icon" /></el-avatar>
      {{ wallet.name }}
    </div>
    <div v-if="isConnected">
      balance:{{ balance }}
    </div>
  </el-drawer>
      </div>
        
      </div>
      
    </el-menu>
    
    
  </template>
  
  <script setup>
  import { ref  } from 'vue'
  import { ElButton, ElDrawer } from 'element-plus'
  import { SwitchButton,CopyDocument,DArrowRight } from '@element-plus/icons-vue'
  import { msgErr } from '@/utils/message.js'
  import { connectWallet as wallet,isConnected,chainList,provider,getChainId,getBalance,getChainInfo,changeNetwork,disConnectWallet,address } from '../services/wallet.js';
  import metamask from '@/assets/public/images/metamask-icon.svg';
  import Okx from '@/assets/public/images/okx.png';
  import Walletconnect from '@/assets/public/images/walletconnect-icon.svg';
  import Coinbase from '@/assets/public/images/coinbase-icon.svg';
  import Keplr from '@/assets/public/images/keplr-logo.svg';
import { ethers } from 'ethers';
  const wallets = ref([
      { name: 'MetaMask', icon: metamask },
      { name: 'OKX', icon: Okx},
      { name: 'WalletConnect', icon: Walletconnect },
      { name: 'Coinbase', icon: Coinbase },
      { name: 'Keplr', icon: Keplr },
      // 其他钱包
    ]);
  const visible = ref(false)
  const showIcon = ref(false)
  const drawerVisible = ref(false)
  const balance = ref(0)
  
  const handleBeforeClose  = (done) =>{
      // 这里可以决定在什么情况下允许关闭drawer
      // 例如，这里可以完全禁止关闭
      // done();
    };
    const showDrawer = ()=> {
      visible.value = true;
      drawerVisible.value = true;
    };
    const closeDrawer = ()=> {
      drawerVisible.value = false;
    }
  let chainName = ref("网络");
  let activeIndexChain = ref('1')
  let activeIndexWallet = ref('')
  let userInfo = ref({
    "address":"",
    "isConnected":false,
    "walletType":'',
  });
  const handleSelect = (key, keyPath) => {
    if (key.startsWith("1-")) {
      activeIndexChain.value = key;
      
    }
     // 判断是否以 "2-" 开头
     if (key.startsWith("3-")) {
      activeIndexWallet.value =key;
      // 这里可以添加更多的逻辑
    }
    
  }
  const handleClick = async (item) => {
    chainName.value = item.name;
    try{
      const msg = await changeNetwork(item.chainId);
      msgErr(msg)
    } catch (e) {
      msgErr(e)
    }
   
  }
  // 复制
  const  performAction = ()=> {
      // 这里实现点击图标后的逻辑
      if (navigator.clipboard && window.isSecureContext) {
        // 使用navigator.clipboard API复制文本
        navigator.clipboard.writeText(address.value).then(() => {
          console.log("内容已复制到剪贴板");
        }).catch((err) => {
          console.error("复制失败", err);
        });
      } else {
        // 备选方案：老旧浏览器可能不支持navigator.clipboard
        console.error("浏览器不支持复制功能");
      }
    }

// 方法来连接钱包
const connectWallet = async (walletType) => {

   await wallet(walletType);
   const id = await getChainId();
   console.info("chainId = ",id);
  //  return;
   userInfo.value.address = address;
   userInfo.value.isConnected = true;
   userInfo.value.walletType = walletType;
   const chainId = await getChainId();
   const chainInfo = await getChainInfo(chainId);
   console.log("chainInfo ",chainInfo);
   console.log("chainInfo.name ",chainInfo.name);
   chainName.value = chainInfo.name;
   activeIndexChain.value = '1-'+Number(chainId);
   console.log("address.value",address.value);
   const chainBalance = await getBalance(address.value)
   
   balance.value =  chainBalance;
  //  console.log("userInfo",userInfo.value);
  };
  const formattedString = () =>{
    const length = userInfo.value.address.length;
      if (length > 10) {
        const start = userInfo.value.address.substring(0, 6);
        const end = userInfo.value.address.substring(length - 4);
        return `${start}...${end}`;
      } else {
        return userInfo.value.address;
      }
    }
    // const showDrawer = ()=>{

    // }
    const disConnect = async ()=>{
      await disConnectWallet(userInfo.value.walletType);
      userInfo.value.address = "";
      userInfo.value.isConnected = false;
      userInfo.value.walletType = "";
    }
    
  </script>
  
  <style>
  .flex-grow {
    flex-grow: 1;
  }
  
  /* 使得点击事件可以穿透遮罩层 */
/* .el-drawer__wrapper {
  pointer-events: none;
} */

/* 确保在el-drawer内的点击事件依然有效 */
/* .el-drawer {
  pointer-events: auto;
} */
 
  .el-drawer.ltr, .el-drawer.rtl {
    height: auto !important;
    
}
.el-overlay {
    background-color: transparent !important;
}

.drawer-container {
  position: relative;
}


/* yangs */
.wallet-list {
  background-color: #333; /* 深灰色背景 */
  padding: 2px 0; /* 加入上下padding来允许第一个和最后一个item有间隔 */
  margin: 10px;
  border-radius: 10px !important;
}

.wallet-item {
  background-color: #F9F9F9; /* 每个列表项的背景色，稍浅于列表背景色 */
  margin: 2px 0; /* 列表项之间的间隔 */
  padding: 10px; /* 列表项内边距 */
  color: #979797; /* 文字颜色 */
  display: flex;
  align-items: center;
  
}

.wallet-item:not(:last-child) {
  margin-bottom: 2px; /* 为除最后一个列表项之外的每个列表项底部添加间隔 */
}

.el-avatar {
  margin-right: 10px;
}

.wallet-item:hover {
  background-color: #f0eeee; /* 你的高亮颜色 */
}
.wallet-item:first-of-type {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.wallet-item:last-of-type {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.title-container {
  display: flex;
  align-items: center;
}
.title-container h4 {
  margin-right: 4px; /* 或根据需要调整 */
}
.el-icon {
  margin-left: 4px;
  cursor: pointer;
}
  </style>
  