<script setup>
import { ethers } from 'ethers';
import { ElButton } from 'element-plus';
import { ref,reactive,onMounted } from 'vue';
import { coins } from '@/services/cosmos';
// import { markets } from '@/services/wallet';
import { 
  Msg} from "@cosmjs/launchpad";
import { cosmosSendToken,address,markets,CosmWasmClient } from '@/services/wallet';
import { coin } from "@cosmjs/proto-signing"
import { GasPrice,calculateFee } from "@cosmjs/stargate";


const labelPosition = ref('left');

const formLabelAlign = reactive({
  denom: '11',
  to: 'nibi17dz4cdw5fmm2cxd4ht9xvjmpw3ycmpkpcc6js9',
  amount: '',
 
})

const submitForm = async ()=>{
//   const rpc = "https://rpc.testnet-1.nibiru.fi";
// const signer = await newSignerFromMnemonic("west,roof,vast,cabbage,isolate,major,insect,spy,drift,swallow,marine,upset")
// signer.getAccounts()
// const txClient = await NibiruTxClient.connectWithSigner(
//   rpc,
//   signer,
// )
// const [{ address: fromAddr }] = await signer.getAccounts()
// const pair = "ubtc:unusd"

// // ------------------------------------
// // Construct tx msgs
// // ------------------------------------
// const msgs = [
//   Msg.perp.openPosition({
//     sender: fromAddr,
//     pair: pair,
//     quoteAssetAmount: 10,
//     leverage: 1,
//     goLong: true,
//     baseAssetAmountLimit: 0,
//   }),
//   Msg.perp.addMargin({
//     sender: fromAddr,
//     pair: pair,
//     margin: coin("20", "unusd"),
//   }),
//   Msg.perp.removeMargin({
//     sender: fromAddr,
//     pair: pair,
//     margin: coin("5", "unusd"),
//   }),
//   // final margin value of 10 (open) + 20 (add) - 5 (remove) = 25
// ]
// const txResp = await txClient.signAndBroadcast(fromAddr, msgs,"auto")
// console.log("txResp = ",txResp);

//////////===============================///////////
    const pair = "ubtc:unusd"
    const msg1 = {
    "sender": address.value,
    "pair": pair,
    "quoteAssetAmount": 10,
    "leverage": 1,
    "goLong": true,
    "baseAssetAmountLimit": 0,
  };
    const msg2 = {
    "sender": address.value,
    "pair": pair,
    "margin": coin("20", "unusd"),
  };
    const msg3 = {
    "sender": address.value,
    "pair": pair,
    "margin": coin("5", "unusd"),
  };
//     const msgs = [
//   Msg.perp.openPosition({
//     sender: address.value,
//     pair: pair,
//     quoteAssetAmount: 10,
//     leverage: 1,
//     goLong: true,
//     baseAssetAmountLimit: 0,
//   }),
//   Msg.perp.addMargin({
//     sender: address.value,
//     pair: pair,
//     margin: coin("20", "unusd"),
//   }),
//   Msg.perp.removeMargin({
//     sender: address.value,
//     pair: pair,
//     margin: coin("5", "unusd"),
//   }),
//   // final margin value of 10 (open) + 20 (add) - 5 (remove) = 25
// ]
console.log(msg1,msg2,msg3);
const gas = "0.025unibi";
  const fee = calculateFee(100_000, gas);
  console.log("fee: " + fee);
// let signed = await CosmWasmClient.sign([msg1,msg2,msg3], fee);
  //  const txResp = await CosmWasmClient.signAndBroadcast([msg1,msg2,msg3], fee);
   const queryHandler = await CosmWasmClient.queryClient.wasm.queryContractSmart;
   console.log("queryHandler = ",queryHandler);
   console.log(txResp)
    const tx = await markets()
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
      <el-radio-button label="left">market</el-radio-button>
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
