

import { useCallback, useEffect, useState } from 'react';
import useEth from '../contexts/EthContext/useEth';
import FanTokenArtifact from '../contracts/FanToken.json';

export default function useFanTokenBalance({ fanTokenAddress, account }: { fanTokenAddress?: string; account?: string | null; }) {

  const { state: { web3 }} = useEth();

  const [balance, setBalance] = useState(0);
  const [symbol, setSymbol] = useState("");

  const load = useCallback(async () => {
    if (fanTokenAddress && account) {
      const contract = new web3.eth.Contract(FanTokenArtifact.abi, fanTokenAddress);
      const balance = await contract.methods.balanceOf(account).call();
      const symbol = await contract.methods.symbol().call();
      setBalance(balance);
      setSymbol(symbol);
    }
  }, [account, fanTokenAddress]);

  useEffect(() => {
    load();
  }, [load])

  return { fanTokenBalance: balance, symbol, refresh: load };
}
