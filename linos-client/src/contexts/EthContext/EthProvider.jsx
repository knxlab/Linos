import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import LinosPlatform from "../../contracts/LinosPlatform.json";

const INIT_ARTIFACTS = {
  LinosPlatform
};

function EthProvider({ children, autoInit = false }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifacts => {
      if (artifacts) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const contracts = {};
        Object.keys(artifacts).forEach(artifactName => {
          const artifact = artifacts[artifactName];
          const { abi } = artifact;
          let address, contract;
          try {
            address = artifact.networks[networkID].address;
            contract = new web3.eth.Contract(abi, address);
          } catch (err) {
            console.error(err);
          }
          contracts[artifactName] = contract;
        })

        dispatch({
          type: actions.init,
          data: { artifacts, web3, accounts, networkID, contracts, loading: false, ready: true }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        init(INIT_ARTIFACTS);
      } catch (err) {
        console.error(err);
      }
    };

    (async () => {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
      const accounts = await web3.eth.getAccounts();
      if (autoInit || accounts.length > 0) {
        tryInit();
      }
    })()
  }, [init, autoInit]);

  useEffect(() => {
    if (!state.ready) { // Do not listen to event if account not connected !
      return;
    }
    const handleChainChanged = () => {
      init(INIT_ARTIFACTS);
    };

    const handleAccountChanged = (accounts) => {
      if (accounts.length === 0) {
        dispatch({
          type: actions.init,
          data: initialState
        });
        return;
      }
      init(INIT_ARTIFACTS);
    };

    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('accountsChanged', handleAccountChanged);
    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('accountsChanged', handleAccountChanged);
    };
  }, [init, state.ready]);

  const connect = async () => {
    await init(INIT_ARTIFACTS);;
  }

  return (
    <EthContext.Provider value={{
      state,
      dispatch,
      connect
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
