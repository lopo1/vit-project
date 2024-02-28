<script setup>
import { ethers } from 'ethers';
import { ElButton } from 'element-plus';
import { ref,reactive,onMounted } from 'vue';
import { coins } from '@/services/cosmos';
import { cosmosSendToken,address } from '@/services/wallet';



const labelPosition = ref('left');

const formLabelAlign = reactive({
  denom: '',
  to: 'nibi17dz4cdw5fmm2cxd4ht9xvjmpw3ycmpkpcc6js9',
  amount: '',
 
})

const submitForm = async ()=>{
    if (labelPosition.value =="left"){
        
    }else{
        console.log("TODO")
    }
    const tx = await cosmosSendToken(address.value,formLabelAlign.to,formLabelAlign.amount,formLabelAlign.denom)
    console.log("tx",tx)
}

    const tokens = ref([]);

    const querySearch = (queryString, cb) => {
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
     
      
      
      const cons = coins;
      
      return cons.map(token => ({
    ...token,
    value: `${token.denom}`
  }));
    };

    const handleSelect = (item) => {
      formLabelAlign.denom = item.denom; // 设置state1为选中项的地址
      console.log('Item selected:', item);
    };

    onMounted(() => {
      tokens.value = loadAll();
    });
    const handleClick = ()=>{
      tokens.value = loadAll();
    }
</script>



<template>
    <el-radio-group v-model="labelPosition" label="label position">
      <el-radio-button label="left">CW20转账</el-radio-button>
    </el-radio-group>
    <div style="margin: 20px" />
    <el-form
      :label-position="labelPosition"
      label-width="100px"
      :model="formLabelAlign"
      style="max-width: 460px"
    >
        <el-form-item label="代币名称">
          <el-autocomplete
        v-model="formLabelAlign.contract"
        :fetch-suggestions="querySearch"
        clearable
        style="width: 359px;"
        placeholder="ERC20合约地址"
        @select="handleSelect"
        @click="handleClick"
      />
        <!-- <el-input v-model="formLabelAlign.contract" placeholder="ERC20合约地址" /> -->
        </el-form-item>

        <el-form-item label="to" >
        <el-input v-model="formLabelAlign.to" />
        </el-form-item>

        <el-form-item label="amount" >
        <el-input v-model="formLabelAlign.amount" />
        </el-form-item>


        <!-- 提交按钮 -->
        <el-form-item>
        <el-button type="primary" @click="submitForm">Submit</el-button>
        </el-form-item>
    
    </el-form>
    
  </template>


<style scoped>
.el-input__inner {
  
}
</style>
