import { Button } from "@mui/material";
import { useState } from "react";
import { useLinosContext } from "../../contexts/Linos/Context";
import useCurrentAccount from "../../hooks/useCurrentAccount";


export default function FaucetListenToken({
  className
}: {
  className?: string
}) {
  const [loading, setLoading] = useState(false);
  const account = useCurrentAccount();
  const { listenTokenContract, refreshBalance } = useLinosContext();

  const get500 = async () => {

    setLoading(true);
    console.log("listenTokenContract.methods", listenTokenContract.methods);
    try {
      await listenTokenContract.methods.faucet().call({ from: account });
      await listenTokenContract.methods.faucet().send({ from: account });
      await refreshBalance();
    } catch (e: any) {
      console.log(e)
    }
    setLoading(false);
  }

  return (
    <Button disabled={loading} variant="contained" onClick={get500} className={className}>{loading ? "Loading.." : "Faucet : Get 500 ListenToken (Linos)"}</Button>
  )
}