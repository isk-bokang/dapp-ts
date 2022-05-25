import { useEffect } from "react";
import React from 'react';
import Web3 from 'web3';
import { MetaMaskInpageProvider } from "@metamask/providers";


interface AddEthereumChainParameter {
  chainId: string,
  blockExplorerUrls?: string[],
  chainName?: string,
  iconUrls?: string[],
  nativeCurrency?: {
    name: string,
    symbol: string,
    decimals: number,
  },
  rpcUrls?: string[],
}


declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}





async function addNetwork(accountAddr : string) {
  const goerli : AddEthereumChainParameter ={
    chainId: "5",
    blockExplorerUrls : ["https://goerli.etherscan.io"],
    chainName: "Goerli 테스트 네트워크",
    rpcUrls: ["https://goerli.infura.io/v3/"],
  }

   const res = await window.ethereum?.request({ method : "wallet_addEthereumChain", params : [goerli, accountAddr ]})
  return res;

}



async function requestAccount(){
  if(window.ethereum){
    const accounts  = await window.ethereum.request({method : 'eth_requestAccounts'});
    const accountAddr : string = typeof accounts === 'string'
        ? accounts
        : "";
    console.log(addNetwork(accountAddr));
  }
  else{
    console.log("I Need Metamask")
  }
}






function App() {



  return (
    <div className="App">
      <button onClick={requestAccount}> Connect </button>
    </div>
  );

}
export default App;