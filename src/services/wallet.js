import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { ref } from 'vue';
import { ethers } from 'ethers';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import {expErr} from '@/utils/message'

// 创建一个 ref 来存储连接状态
const isConnected = ref(false);

// 创建 ethers.js Provider 对象
// let provider = new ethers.BrowserProvider(window.ethereum);
let provider = undefined;
let address = ref('');
// const chains = [11155111]
const projectId = '85cd042efdd7139347fe2f4b6da3c8bc'
let ethereumProvider = undefined;
let coinbaseWallet = undefined;

// 提供 Provider 对象
// provide('ethersProvider', provider);

// 连接钱包的方法
async function connectWallet(walletType) {
  provider = new ethers.BrowserProvider(window.ethereum);
  console.log("provider = ",provider);
  if (walletType === 'MetaMask' || walletType === 'OKX'){
    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      // 检查是否支持网络
      let chainId = provider._network.chainId;
      
      const invalibal = await checkChain(Number(chainId));
      if(!invalibal){
        console.log("chainId is invalid");
        return
      }
      isConnected.value = true;
      address.value = accounts[0]
      // 进一步的处理...
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  }else if(walletType === 'Coinbase'){
     coinbaseWallet = new CoinbaseWalletSDK({
      appName: 'My Awesome App',
      appLogoUrl: "https://www.playestates.com/img/logo.521986b5.png",
      darkMode: false
    });
    const ethereum = coinbaseWallet.makeWeb3Provider("https://uk.rpc.blxrbdn.com", 1)
    provider =  new ethers.BrowserProvider(ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    isConnected.value = true;
    address.value = accounts[0];
  }
  else if (walletType === 'WalletConnect'){
    try{
      if(!ethereumProvider){
        ethereumProvider = await EthereumProvider.init({
              projectId: projectId,
              chains: chainIds,
              showQrModal: true,
              methods: ["eth_sendTransaction", "personal_sign"],
              events: ["chainChanged", "accountsChanged"],
          });
         
          // console.log("ethereumProvider:",ethereumProvider);
          ethereumProvider.on("connect", () =>
              {
                  console.info("connect");
                  console.info("ethereumProvider.accounts[0] = ",ethereumProvider.accounts[0]);
                  console.info(ethereumProvider.accounts);
                  address.value = ethereumProvider.accounts[0];
                  isConnected.value = true;
                  console.info("address.value = ",address.value);
                  
              }
          );
          ethereumProvider.on('disconnect', (event)=>{
            console.log("Disconnect",event);
             address.value ="";
             isConnected.value=false;
             
            //  walletInfo.value.chainId = chainId;
              alert("连接断开")
          })

          ethereumProvider.on('session_request', (event)=>{
              alert("event",event)
          })
          ethereumProvider.on('session_event', (event)=>{
              alert("session_event ",event)
          })

          ethereumProvider.on('session_request', (event)=>{
            console.info("session_request",event)
          })
          ethereumProvider.on("session_update", (error, payload) => {
              if (error) {
                  throw error;
              }
              // Get updated accounts and chainId
              const {accounts, chainId} = payload.params[0];
              // walletInfo.value.chainId = chainId;
          });
          ethereumProvider.on('session_update', (event)=>{
            console.info("session_update",event)
          })
          ethereumProvider.on('accountsChanged', (event)=>{
            console.info("accountsChanged",event)
            address.value =event[0];
            console.info("address.value = ",address.value);
          })
          // ethereumClient.rejectSession
          
      }
      // console.log("ethereumProvider:",ethereumProvider);
      ethereumProvider.connect();
      // ethers
      provider = new ethers.BrowserProvider(ethereumProvider)
  }catch(error){
      console.error(error);
  }  
  }
  
}

// 断开连接
async function disConnectWallet(walletType) {
  if (walletType === 'WalletConnect'){
    try{
      if(!ethereumProvider){
        await ethereumProvider.disconnect();
      }
      // console.log("ethereumProvider:",ethereumProvider);
     
  }catch(error){
      console.error(error);
  }  
  }else if (walletType === 'Coinbase'){
    coinbaseWallet.disconnect()
    // is the same as the following:
    ethereum.close()
  }
  isConnected.value = false;
  address.value = '';
  
}
// 调用合约方法的示例
async function callContractMethod(contractAddress, abi, methodName, methodArgs = []) {
  if (!isConnected.value) {
    console.error('Wallet not connected');
    return;
  }

  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  try {
    
    const response = await contract[methodName](...methodArgs);
    // console.log('Contract method response:', response);
    return response;
  } catch (error) {
    expErr(error);
    console.error('Error calling contract method:',methodName , error);
  }
}


// 调用合约方法的示例
async function callContract(contractAddr,amount,funStr,params=[]) {
  if (!isConnected.value) {
    console.error('Wallet not connected');
    return;
  }
  const methodName = funStr.split('(')[0].trim();
  // 提取参数部分，并去除空格
  const paramsString = funStr.split('(')[1].split(')')[0].trim();
  // 获取 transfer 函数的 Fragment
  const numberOfParams = paramsString === '' ? 0 : paramsString.split(',').length;

  // console.log("transfer 方法需要的参数个数: ", numberOfParams);
  if (params.length!=numberOfParams){
    console.error("传入的参数和，需要的参数数量不匹配");
    return ;
  }
  
  // ABI 和编码函数调用（这部分代码你已经有了）
  let ABI = [fcStr];
  let iface = new ethers.Interface(ABI);
  let encodedFunctionCall = iface.encodeFunctionData(methodName, params);
  

  const signer = await provider.getSigner();
  // 发送交易
  const tx = await signer.sendTransaction({
    to: contractAddr, // 替换为你要调用的合约地址
    data: encodedFunctionCall, // 编码后的函数调用
    value: ethers.parseEther(amount), // 如果需要发送以太币，设置这个值
    // gasPrice 等其他交易参数（如果需要）
  });

  console.log("Transaction hash:", tx.hash);

  // 等待交易被挖掘
  await tx.wait();
  return tx.hash;

}

let chainList= ref([
  {"id":1,"name":"Ethereum","chainId":1,"icon":"","rpc":"https://uk.rpc.blxrbdn.com","export":"https://etherscan.io/"},
  {"id":2,"name":"Goerli","chainId":5,"icon":"","rpc":"https://eth-goerli.api.onfinality.io/public","export":"https://goerli.etherscan.io/"},
  {"id":3,"name":"Sepolia","chainId":11155111,"icon":"","rpc":"https://eth-sepolia.api.onfinality.io/public","export":"https://sepolia.etherscan.io/"},
  {"id":4,"name":"Manta","chainId":169,"icon":"","rpc":"https://pacific-rpc.manta.network/http","export":"https://testnet.blastscan.io/"},
  {"id":5,"name":"Manta Testnet","chainId":3441005,"icon":"","rpc":"https://manta-testnet.calderachain.xyz/http","export":"https://pacific-explorer.manta.network/"},
  {"id":6,"name":"Blast Testnet","chainId":168587773,"icon":"","rpc":"https://sepolia.blast.io/","export":"https://testnet.blastscan.io/"},
]);
let chainIds = chainList.value.map(item => item.chainId);

async function changeNetwork(chainId) {
  var hex_chainId = ethers.toQuantity(chainId) ;
  console.log(hex_chainId);
  if (!isConnected.value){
    return "请先连接钱包";
    
  }
  try {

    // 请求用户切换到特定网络 (例如: Rinkeby 测试网)
    const res = await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hex_chainId }], // 0x4 是 Rinkeby 测试网的链ID
    });
    //0xAA36A7
    console.log("res = ",res);
    // ethereum.request({
    //   method: 'wallet_switchEthereumChain',
    //   params: [{ chainId: hex_chainId }]
    // }).then(response => console.log(response))
    // const result = await ethereum.send('wallet_switchEthereumChain', [{ chainId: hex_chainId }])
    // onsole.log("result = ",result);
    return "";
    // await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hex_chainId }] })
} catch (switchError) {
    // 处理错误，例如用户拒绝切换网络
    console.error('switchError :', switchError);
    if (switchError.code ==4001){
      return '用户取消操作';
    }
   let chainInfo =  await getChain(chainId);
   if (chainInfo==null){
    return "节点站不支持";
   }
  //  var hex_chainId = ethers.toQuantity(chainId) ;
  try {
    console.log("hex_chainId = ",hex_chainId);
    // 添加网络
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
          {
              chainId:  ethers.toQuantity(chainInfo.chainId), // Matic 主网的链ID
              chainName: chainInfo.name,
              rpcUrls: [chainInfo.rpc],
              nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
              },
              blockExplorerUrls: [chainInfo.export]
          }
      ]
  });
    
  } catch (error) {
    console.error(error);
  }
    
}
}

async function checkChain(chainId){
  for (let i = 0; i < chainIds.length ; i++) {
    if (chainIds[i] == chainId){
      return true;
    }
  }
  return false;
}

async function getChain(chainId){
  for (let i = 0; i < chainIds.length ; i++) {
    if (chainIds[i] == chainId){
      return chainIds[i];
    }
  }
  return null;
}

async function getChainInfo(chainId){
  chainId = Number(chainId);
  for (let i = 0; i < chainList.value.length ; i++) {
    if (chainList.value[i].chainId == chainId){
      return chainList.value[i];
    }
  }
  return null;
}

export { isConnected,callContract, connectWallet,provider,changeNetwork,getChain,address,getChainInfo,chainList,disConnectWallet, callContractMethod };