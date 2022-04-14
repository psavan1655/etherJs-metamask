import "./App.css";
import * as ethers from "ethers";
import { useEffect, useState } from "react";

let provider = "";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    block: 0,
    ethBalance: 0,
  });

  useEffect(() => {
    const checkIfWalletConnected = async () => {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setIsConnected(true);
        return
      }
    }
    checkIfWalletConnected()
  }, []);

  const getBalance = async () => {
    let balance = await provider.getBalance("ethers.eth");
    balance = ethers.utils.formatEther(balance);
    console.log(balance);
    setData({
      ...data,
      ethBalance: balance,
    });
  };

  const getBlock = async () => {
    const blockVal = await provider.getBlockNumber();
    setData({
      ...data,
      block: blockVal,
    });
  };

  const handleMetamaskConnection = async () => {
    try {
      setIsLoading(true);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setData(signer);
      setError("");
      setIsLoading(false);
      setIsConnected(true);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="App">
      <button
        onClick={handleMetamaskConnection}
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white mt-4 py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        {isConnected
          ? `Welcome `
          : isLoading
          ? "Connecting..."
          : "Connect metamask"}
      </button>

      <div className="text-red-500">{error}</div>

      {/* {isLoading ? "Logging in to metamask wallet" : ""}
      {data ? "Successfully logged in!" : "Please login to continue!"}
      <br />
      <div>Current block = {data.block}</div>
      <div>Ethereum Balance (in wei) = {data.ethBalance}</div> */}
    </div>
  );
};

export default App;
