import { createContext } from "react";

const EthContext = createContext<{
  state: {
    ready: boolean;
    web3: any;
    accounts: Array<string>;
    contracts: {[key: string]: any};
  };
  dispatch?: any;
  connect?: any;

}>({
  state: {
    accounts: [],
    ready: false,
    web3: null,
    contracts: {}
  }
});

export default EthContext;
