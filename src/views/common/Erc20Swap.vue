<script setup>
import { ref,onMounted } from 'vue'
import {chainList} from '@/services/contract'
import { isConnected,provider,address,connectWallet,callContractMethod } from '@/services/wallet';
const input1 = ref()
const input2 = ref()
const select1 = ref('')
const select2 = ref('')
const token1 = ref(0)
const token2 = ref(0)
let options = ref([]);
const submitExchange = async () => {
      // 提交兑换的逻辑
    }
// 获取兑换地址
const contracts =  ()=>{
  if (provider!=undefined){
    const chainId = provider._network.chainId;
    options = chainList(chainId);
  }else{
    options = chainList(1);
  }
  
};
onMounted(() => {
   contracts();
  console.log("options =",options);
  if (options.length > 0) {
    select1.value = options[0].name; // 设置为options数组中第一个元素的value
  }
});
</script>



<template>
<div class="exchange-form">
    <div class="title">兑换</div>
    
    <div class="input-group">
    <div class="input-wrapper">
    <div class="description">你支付</div>
      <el-input
        v-model="input1"
        placeholder="0"
        class="input-with-select"
      >
        
        <template #append>
          <el-select v-model="select1" placeholder="Select" style="width: 115px">
            <el-option
            v-for="option in options"
            :key="option.address"
            :label="option.name"
            :value="option.address">
          </el-option>
            <!-- <el-option label="ETH" value="eth" />
            <el-option label="BTC" value="btc" /> -->
          </el-select>
        </template>
      </el-input>
      <div class="balance">余额:{{ token1 }}</div>
    </div>
    <!-- 箭头容器 -->
    <div class="arrow-container" @click="swapValues">
      <div class="arrow-icon">↓</div>
    </div>
    </div>
    <div class="input-group">
        <div class="input-wrapper">
        <div class="description">你收款</div>
      <el-input
        v-model="input2"
        placeholder="0"
        class="input-with-select"
      >
        
        <template #append>
          <el-select v-model="select2" placeholder="Select" style="width: 115px">
            <el-option label="UNI" value="uni" />
            <el-option label="DAI" value="dai" />
          </el-select>
        </template>
      </el-input>
      <div class="balance">余额：{{ token2 }}</div>
    </div>
    </div>
    <!-- 这里可以添加更多的表单元素 -->
    <el-button type="primary" @click="submitExchange" style="width: 500px ;">兑换</el-button>
</div>
  </template>


<style scoped>
.exchange-form {
  position: relative; /* 父容器设置为相对定位 */
  max-width: 500px; /* 根据图片调整宽度 */
  margin: auto;
  padding: 20px;
  background-color: #FFFFFF; /* 轻灰色背景 */
  border-radius: 10px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影 */
}
.title {
  text-align: center;
  font-size: 1.5rem; /* 标题大小 */
  margin-bottom: 20px; /* 标题和输入框之间的距离 */
}
.input-group{
  background-color: #f8f8f8; /* 轻灰色背景 */
  margin-bottom: 5px; /* 输入框之间的间隔 */
  border-radius: 8px; /* 设置圆角 */
}

.input-wrapper {
    border-radius: 30%; /* 设置圆角 */
    padding: 30px 10px 10px; /* 调整padding，为顶部文本腾出空间 */
    position: relative; /* 设置为相对定位 */
    height: 60px;
  }

.input-container {
  margin-top: 1rem; /* 输入框顶部外边距 */
}



.select-append {
  border-left: none; /* 去掉select左侧边框 */
  border-radius: 0 5px 5px 0; /* 右侧圆角 */
  background-color: white; /* 背景色 */
  width: auto; /* 宽度自动 */
}
.balance{
    position: absolute; /* 设置为绝对定位 */
    margin-top: 8px; /* 在余额和输入框之间添加间距 */
    right: 20px; /* 距离右边5px */
    font-size: 16px; /* 文本大小 */
    color: #999; /* 文本颜色 */
}
.description{
    position: absolute; /* 设置为绝对定位 */
    top: 4px; /* 向上偏移，根据实际情况调整 */
    left: 10px; /* 与左侧边框对齐，根据实际情况调整 */
    padding: 0 5px; /* 增加一点内边距 */
    color: #999; /* 文本颜色 */
    font-size: 16px; /* 字体大小 */
}

.el-select .el-input__inner {
  border-radius: 0 5px 5px 0; /* 右侧圆角 */
}

/* 兑换图标 */
.arrow-container {
  position: absolute; /* 箭头容器使用绝对定位 */
  top: 50%; /* 垂直居中，根据需要调整 */
  left: 50%; /* 水平居中，根据需要调整 */
  transform: translate(-50%, -30%); /* 确保箭头完全居中 */
  width: 30px; /* 设置箭头容器的宽度 */
  height: 30px; /* 设置箭头容器的高度 */
  display: flex; /* 使用Flex布局 */
  justify-content: center; /* 水平居中箭头图标 */
  align-items: center; /* 垂直居中箭头图标 */
  cursor: pointer; /* 可选，如果箭头是可点击的 */
  background-color: #F8F8F8; /* 设置灰色背景 */
  border-radius: 30%; /* 圆角边框，创建圆形效果 */
  border: 4px solid white; /* 2px宽的白色边框 */
  }

  .arrow-icon {
    cursor: pointer; /* 鼠标悬停时显示手型光标 */
    font-size: 24px; /* 简单图标的大小 */
    color: #0e0d0d; /* 图标颜色 */
    pointer-events: auto; /* 使箭头图标可以接收点击事件 */
  }

/* 去除边框 */
.input-group .input-with-select .el-input__inner {
    border: none !important;
    box-shadow: none !important;
  }
  
  .input-with-select .el-input__inner:focus {
    border-color: transparent !important;
    outline: none !important;
  }
  
  .el-select .el-input__inner {
    border: none !important;
  }
  
  .el-select-dropdown {
    border: none !important;
  }
</style>
