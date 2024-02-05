<script setup>
import { ethers } from 'ethers';
import { ElButton } from 'element-plus';
import { ref,reactive,onMounted } from 'vue';
import { provider,callContract} from '@/services/wallet';
import { chainList } from '@/services/contract';

const labelPosition = ref('left');

const formLabelAlign = reactive({
  contract: '',
  amount: '',
  function: '',
  arg: '',
})
const tokens = ref([]);
const submitForm = async ()=>{
  const arr = formLabelAlign.arg.trim().split(',').map(item => item.trim());
  console.log("arr",arr);
  const tx = await callContract(formLabelAlign.contract,formLabelAlign.amount,formLabelAlign.function,arr);
        console.log("tx",tx);
}
const contractQuery = (queryString, cb) => {
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
    onMounted(() => {
      tokens.value = loadAll();
    });

    const handleClick = ()=>{
      tokens.value = loadAll();
    }
    
</script>



<template>
    <el-radio-group v-model="labelPosition" label="label position">
      <el-radio-button label="left">调用合约方法</el-radio-button>
    </el-radio-group>
    <div style="margin: 20px" />
    <el-form
      :label-position="labelPosition"
      label-width="100px"
      :model="formLabelAlign"
      style="max-width: 460px"
    >
        <el-form-item label="合约地址">
        <!-- <el-input v-model="formLabelAlign.contract" placeholder="要执行的合约地址" /> -->
        <el-autocomplete
        v-model="formLabelAlign.contract"
        :fetch-suggestions="contractQuery"
        clearable
        style="width: 359px;"
        placeholder="要执行的合约地址"
        @select="handleSelect"
        @click="handleClick"
      />
        </el-form-item>

        <el-form-item label="amount" >
        <el-input v-model="formLabelAlign.amount"  placeholder="需要支付ETh数量,如:0.02" />
        </el-form-item>

        <el-form-item label="function" >
        <el-input v-model="formLabelAlign.function" placeholder="合约方法，如: transfer(address to, uint256 value)"/>
        </el-form-item>

        <el-form-item label="参数" >
        <el-input v-model="formLabelAlign.arg" placeholder="多个参数逗号隔开，如: 0x0000,100" />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
        <el-button type="primary" @click="submitForm">Submit</el-button>
        </el-form-item>
    
    </el-form>
    
  </template>


<style scoped>

</style>
