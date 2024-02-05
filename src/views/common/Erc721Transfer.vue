<script setup>
import { ethers } from 'ethers';
import { ElButton } from 'element-plus';
import { ref,reactive,onMounted } from 'vue';
import { chainList } from '@/services/contract';
import { isConnected,provider,address,connectWallet,callContractMethod } from '@/services/wallet';
// import { AlertComponent  } from '@/views/common/AlertComponent.vue';


const contractABI = [ { "inputs": [ { "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "getApproved", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "tokenByIndex", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "tokenOfOwnerByIndex", "outputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ]


const labelPosition = ref('left');

const formLabelAlign = reactive({
  contract: '',
  from: address,
  to: '',
  tokenId: '',
})
// formLabelAlign.from = address;

const submitForm = async ()=>{
    if (labelPosition.value =="left"){
        const tx = await callContractMethod(formLabelAlign.contract,contractABI,"safeTransferFrom",[formLabelAlign.from,formLabelAlign.to, formLabelAlign.amount])
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
      if(provider==undefined) {
        console.log("provider111 =",provider);
        return [];
      };
      const chainId = provider._network.chainId;
      // console.log("chainId = ",chainId);
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
      <el-radio-button label="left">ERC721转账</el-radio-button>
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
        
        </el-form-item>
        <el-form-item label="from">
        <el-input v-model="formLabelAlign.from" />
        </el-form-item>

        <el-form-item label="to">
        <el-input v-model="formLabelAlign.to" />
        </el-form-item>

        <el-form-item label="amount" >
        <el-input v-model="formLabelAlign.tokenId" />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
        <el-button type="primary" @click="submitForm">Submit</el-button>
        </el-form-item>
    
    </el-form>
    
  </template>


<style scoped>

</style>
