import { useEffect } from "react";
import React from 'react';
import Web3 from 'web3';
import { MetaMaskInpageProvider } from "@metamask/providers";
import { toHex } from "web3-utils";


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
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}
let accountAddr = "";

const goerli: AddEthereumChainParameter = {
  chainId: toHex(5)
}

const Klaytn: AddEthereumChainParameter = {
  chainId: toHex(8217),
  blockExplorerUrls: ["https://scope.klaytn.com"],
  chainName: "Klaytn Mainnet Cypress",
  rpcUrls: ["https://public-node-api.klaytnapi.com/v1/cypress"],
}




async function addNetwork() {

  console.log(Klaytn)
  const res = await window.ethereum?.request({ method: "wallet_addEthereumChain", params: [Klaytn] })

  return res;

}

async function switchNetwork() {
  console.log(goerli)
  const res = await window.ethereum?.request({ method: "wallet_switchEthereumChain", params: [goerli] })
  return res;
}

async function requestAccount() {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    accountAddr = typeof accounts === 'string'
      ? accounts
      : "";
  }
  else {
    console.log("I Need Metamask")
  }
}

function HandleChangeNetworkEvent() {
  if (window.ethereum?.chainId !== goerli.chainId && window.ethereum?.selectedAddress != null) {
    alert(" Need To Change Network to Goerli")
    console.log(switchNetwork());
    window.location.reload();
  }
}




function App() {

  useEffect(() => {
    window.ethereum?.on('connect', () => { console.log("Connect Event"); });
    window.ethereum?.on('disconnect', () => { console.log('Disconnect Event'); })

    window.ethereum?.on('accountsChanged', () => {
      console.log("Account Changed Event");
      HandleChangeNetworkEvent();
    });

    window.ethereum?.on('chainChanged', () => {
      console.log('chainChanged Event');
      HandleChangeNetworkEvent();
    })

    return () => {
      window.ethereum?.removeAllListeners('connect');
      window.ethereum?.removeAllListeners('disconnect');
      window.ethereum?.removeAllListeners('accountsChanged');
      window.ethereum?.removeAllListeners('chainChanged');

    }
  })


  return (
    <div className="App">
      {< button onClick={requestAccount}> Connect </button>}
      {<button onClick={switchNetwork}> Switch To Goerli</button>}
      {<button onClick={addNetwork}> Add Klaytn </button>}
    </div>
  );

}
export default App;