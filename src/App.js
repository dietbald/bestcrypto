import "./App.css";
import React, { useEffect, useState } from "react";
import bcvContract from "./contracts/bcv.json";
import Web3 from "web3";

import getWeb3 from "./getWeb3";
import NavBar from "./NavBar";
import NameForm from "./NameForm";
import LoadingSpinner from "./LoadingSpinner";

//init web3

function App() {
  const [refresh, setrefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isElecting, setIsElecting] = useState(false);

  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [currentContract, setCurrentContract] = useState();
  const [currentBestCrypto, setCurrentBestCrypto] = useState(
    "Not loaded yet ... "
  );
  const [balance, setBalance] = useState("?");

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
    //esl
  }, [refresh]);

  const loadWeb3 = async () => {
    const web3 = await getWeb3();
    console.log(web3);
  };

  const loadBlockchainData = async () => {
    console.log("loadBlockchainData");
    setLoading(true);
    if (typeof window.ethereum == "undefined") {
      return;
    }
    const web3 = new Web3(window.ethereum);

    let url = window.location.href;
    console.log(url);

    const accounts = await web3.eth.getAccounts();
    console.log("Got accounts");
    if (accounts.length === 0) {
      setAccount(null);
      return;
    }
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();

    console.log(account);
    console.log(networkId);

    //const networkData = bcvContract.networks[networkId];

    // if(networkData) {

    const c = new web3.eth.Contract(
      bcvContract.abi,
      "0x722cF3Bc003f5B19e5a36dB1099B37399E4eD917"
    );

    if (!c) {
      alert("Couldn't load contract");
      return;
    }
    console.log("Contract", c);
    setCurrentContract(c);
    console.log(currentContract);

    if (networkId === 1666600000) {
      setNetwork("Harmony Main Net");
    } else if (networkId === 1666700000) {
      setNetwork("Harmony Test Net");
    } else if (networkId === 5777) {
      setNetwork("Truffle Test Net");
    } else {
      setNetwork("Unknown");
      window.alert("the contract not deployed to detected network." + networkId);
    }
    console.log("set loading to false");
    setLoading(false);
  };

  const updateCurrentBestCryptoName = async () => {
    if (currentContract) {
      const name = await currentContract.methods.getBestCryptoName().call();
      setCurrentBestCrypto(name);
      const newBalance = await currentContract.methods.getBalance().call();
      console.log(newBalance);
      setBalance(newBalance);
      console.log("Loaded", name);
    } else {
      console.log("Error no current contract");
    }
  };

  useEffect(() => {
    updateCurrentBestCryptoName();
  }, [currentContract]);

  const electNewCrypto = async (newName) => {
    console.log("update");
    setIsElecting(true);
    if (currentContract) {
      const electResult = await currentContract.methods
        .Elect(newName)
        .send({ from: account, value: 1 * 10 ** 18 })
        //.send({ from: account })
        .on("transactionhash", () => {
          console.log("Done update");
        });
      console.log("done await update", electResult);
      updateCurrentBestCryptoName();
    } else {
      console.log("error current contract not there");
    }
    setIsElecting(false);
  };

  return (
    <div>
      <NavBar
        account={account}
        network={network}
        connect={loadBlockchainData}
      />

      {currentContract ? (
        <div align="center">
          <h1>
            The best crypto now is :
            {loading ? <LoadingSpinner visible="true" /> : currentBestCrypto}
          </h1>
          {isElecting ? (
            <LoadingSpinner visible="true" />
          ) : (
            <NameForm processSubmit={(name) => electNewCrypto(name)} />
          )}
        </div>
      ) : (
        <p> Please connect Metamask </p>
      )}
      <div align="center">
        <p/><p/>
        <h3> Current smart contract balance {balance / 10 ** 18 } ONE </h3>
      </div>
    </div>
  );
}

export default App;
