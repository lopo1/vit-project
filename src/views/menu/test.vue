<script setup>
import { ethers } from 'ethers';
import { ElButton } from 'element-plus';
import { ref,reactive } from 'vue';
import { isConnected,provider,address,connectWallet,callContractMethod } from '@/services/wallet';

const contractABI = [ { "inputs": [ { "internalType": "address", "name": "vesting", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" } ]; // 你的合约ABI数组
const callContract= async () =>{
    // Manta test
    // const tx = await callContractMethod("0x7218850acd6656e820491d4d404bc5e3458d2fb9",contractABI,"transfer",["0xD7D771d3024A3d6C7CaEaF669048D54cD1a0C3c4", "100000000000000000"])
    // Blast test
    const tx = await callContractMethod("0x85A04646499b612b480587769C3a05EFe849BA83",contractABI,"transfer",["0xD7D771d3024A3d6C7CaEaF669048D54cD1a0C3c4", "100000000000000000"])
    console.log("tx",tx)
}

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
</script>

<!-- <template>
    <h1>test</h1>
    <h2>222222222222</h2>
 <el-button type="primary" @click="connectWallet" v-if="!isConnected">连接钱包</el-button>
    <div v-if="isConnected">钱包地址: {{ address }}</div>
 <el-button @click="callContract" :disabled="!isConnected">调用合约方法</el-button>
</template> -->

<template>
    <el-radio-group v-model="labelPosition" label="label position">
      <el-radio-button label="left">ERC20转账</el-radio-button>
      <el-radio-button label="right">调用合约方法</el-radio-button>
    </el-radio-group>
    <div style="margin: 20px" />
    <el-form
      :label-position="labelPosition"
      label-width="100px"
      :model="formLabelAlign"
      style="max-width: 460px"
    >
        <el-form-item label="合约地址">
        <el-input v-model="formLabelAlign.contract" :placeholder="labelPosition === 'right' ? 'ERC20合约地址' : ''" />
        </el-form-item>

        <el-form-item label="to" v-if="labelPosition === 'left'">
        <el-input v-model="formLabelAlign.to" />
        </el-form-item>

        <el-form-item label="amount" v-if="labelPosition === 'left'">
        <el-input v-model="formLabelAlign.amount" />
        </el-form-item>

        <el-form-item label="function" v-if="labelPosition === 'right'">
        <el-input v-model="formLabelAlign.function" />
        </el-form-item>

        <el-form-item label="参数" v-if="labelPosition === 'right'">
        <el-input v-model="formLabelAlign.arg" placeholder="多个参数逗号隔开，如: 100,0x0000" />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
        <el-button type="primary" @click="submitForm">Submit</el-button>
        </el-form-item>
    
    </el-form>
    
  </template>


<style scoped>

</style>
