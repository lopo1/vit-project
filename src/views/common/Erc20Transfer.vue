<script setup>
import { ethers } from 'ethers';
import { ElButton } from 'element-plus';
import { ref,reactive,onMounted } from 'vue';
import { contracts,chainList } from '@/services/contract';
import { isConnected,provider,address,connectWallet,callContractMethod } from '@/services/wallet';

const contractABI = [ { "inputs": [ { "internalType": "address", "name": "vesting", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" } ]; // 你的合约ABI数组


const labelPosition = ref('left');

const formLabelAlign = reactive({
  contract: '',
  to: '',
  amount: '',
  function: '',
  arg: '',
})

const submitForm = async ()=>{
    if (labelPosition.value =="left"){
        const tx = await callContractMethod(formLabelAlign.contract,contractABI,"transfer",[formLabelAlign.to, formLabelAlign.amount])
        console.log("tx",tx)
    }else{
        console.log("TODO")
    }
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
      // console.log("provider111 =",provider);
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
      <el-radio-button label="left">ERC20转账</el-radio-button>
    </el-radio-group>
    <div style="margin: 20px" />
    <el-form
      :label-position="labelPosition"
      label-width="100px"
      :model="formLabelAlign"
      style="max-width: 460px"
    >
        <el-form-item label="合约地址">
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
