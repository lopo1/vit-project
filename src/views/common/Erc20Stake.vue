<script setup>
import { ethers } from 'ethers';
import { ElButton } from 'element-plus';
import { ref,reactive,onMounted,onBeforeUnmount } from 'vue';
import { chainList } from '@/services/contract';
import { provider,address,callContractMethod } from '@/services/wallet';
import { stakeAbi,tokenAbi } from '@/utils/sourse';
import { msgErr } from '@/utils/message';



const labelPosition = ref('left');

const formLabelAlign = reactive({
  contract: '',
  token: '',
  amount: 0,
})
let stakingNumber = ref(0);
const submitForm = async ()=>{
  try {
    console.log("开始质押");
    // debug
    // 检查授权额度
    const allowance = await callContractMethod(formLabelAlign.token,tokenAbi,"allowance",[address.value,formLabelAlign.contract])
    console.log("formLabelAlign = ",formLabelAlign);
    // let decimalValue = ethers.toBigInt(allowance);
    // const proved = decimalValue.toString();
      
    if (allowance<formLabelAlign.amount){
      console.log("准备授权");
      // const difAmount = formLabelAlign.amount - proved;
      const allowanceTxn = await callContractMethod(formLabelAlign.token,tokenAbi,"approve",[formLabelAlign.contract,formLabelAlign.amount])
      // 等待矿工打包
      const receipt = await allowanceTxn.wait();
      if (receipt.status === 1) {
        console.log('Transaction was successful');
      } else {
          msgErr('Transaction failed');
          
      }
    }
    const tx = await callContractMethod(formLabelAlign.contract,stakeAbi,"staking",[formLabelAlign.amount]);
    console.log("tx",tx)
  }catch(e) {
    console.log("e = ",e);
    msgErr(e.message)
  }
  
}

    const tokens = ref([]);

    const contractQuery = (queryString, cb) => {
      const results = queryString
        ? tokens.value.filter(createFilter(queryString))
        : tokens.value;
      // call callback function to return filtered token list
      cb(results);
    };

    const tokenQuery = (queryString, cb) => {
      const results = queryString
        ? tokens.value.filter(createFilter(queryString))
        : tokens.value;
      // call callback function to return filtered token list
      cb(results);
    };

    const createFilter = (queryString) => {
      return (token) => {
        return (
          token.name.toLowerCase().includes(queryString.toLowerCase()) ||
          token.address.toLowerCase().includes(queryString.toLowerCase()) ||
          token.ercType.toLowerCase().includes(queryString.toLowerCase())
        );
      };
    };

    const loadAll = () => {
      if(provider==undefined) return [];
      const chainId = provider._network.chainId;
      
      const cons = chainList(chainId);
      if (cons.length==0){
        return [];
      }
      return cons.map(token => ({
    ...token,
    value: `${token.name} (${token.address})`
  }));
    };

    const handleSelect = (item) => {
      formLabelAlign.contract = item.address; // 设置state1为选中项的地址
    };
    const tokenSelect = (item) => {
      formLabelAlign.token = item.address; // 设置state1为选中项的地址
    };
    const refreshData = () => {
      // 实现你的数据刷新逻辑
      stakingNumber.value = new Date().toLocaleTimeString();
      console.log("Data refreshed at " + stakingNumber.value);
    };
    onMounted(() => {
      tokens.value = loadAll();
      // 设置定时器，每5秒刷新一次数据
      const timer = setInterval(refreshData, 5000);

      // 在组件卸载前清除定时器
      onBeforeUnmount(() => {
        clearInterval(timer);
      });
    });

    const handleClick = ()=>{
      tokens.value = loadAll();
    }
    
</script>



<template>
    <el-radio-group v-model="labelPosition" label="label position">
      <el-radio-button label="left">ERC20质押</el-radio-button>
    </el-radio-group>
    <div style="margin: 20px" />
    <el-form
      :label-position="labelPosition"
      label-width="110px"
      :model="formLabelAlign"
      style="max-width: 460px"
    >
        <el-form-item label="质押合约地址">
          <el-autocomplete
        v-model="formLabelAlign.contract"
        :fetch-suggestions="contractQuery"
        clearable
        style="width: 359px;"
        placeholder="ERC20合约地址"
        @select="handleSelect"
        @click="handleClick"
      />
        <!-- <el-input v-model="formLabelAlign.contract" placeholder="ERC20合约地址" /> -->
        </el-form-item>

        <el-form-item label="token合约地址" >
          <el-autocomplete
        v-model="formLabelAlign.token"
        :fetch-suggestions="tokenQuery"
        clearable
        style="width: 359px;"
        placeholder="ERC20合约地址"
        @select="tokenSelect"
        @click="handleClick"
      />

        </el-form-item>

        <el-form-item label="amount" >
        <el-input v-model="formLabelAlign.amount" />
        </el-form-item>


        <!-- 提交按钮 -->
        <el-form-item>
        <el-button type="primary" @click="submitForm">Submit</el-button>
        </el-form-item>
    
    </el-form>
    <el-form-item label="质押金额" ><el-text class="mx-1" type="success">{{stakingNumber}}</el-text></el-form-item>
    
  </template>


<style scoped>
.el-input__inner {
  
}
</style>
