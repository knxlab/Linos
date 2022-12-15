import { Button } from "@mui/material";
import delay from "delay";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import useCurrentAccount from "../../hooks/useCurrentAccount";


export default function Faucet({
  className
}: {
  className?: string
}) {
  const [loading, setLoading] = useState(false);
  const account = useCurrentAccount();
  const { state: { web3 }} = useEth();
  const get10Eth = async () => {

    setLoading(true);

    const beforeBalance = await web3.eth.getBalance(account);
    console.log("beforeBalance", beforeBalance);

    const faucetAddress = "0x9B657FAa60cC0b8e919C52C793a5028D0C6B0d7E";

    const transaction = {
      from: faucetAddress,
     'to': account, // faucet address to return eth
     'value': 10000000000000000000,
     'gas': 30000,
    //  'nonce': nonce,
    //  type: '0x1',
     // optional data field to send message or execute smart contract
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, "0xcf416f09c8936578aa2f29500f47a17bfe4f4177081fdd575ec93bf12748f11b");

    console.log("signedTx", signedTx);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error: any, hash: any) {
      if (!error) {
        console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");

        let afterBalance = beforeBalance;
        do {
          afterBalance = await web3.eth.getBalance(account);
          console.log("afterBalance", afterBalance);
          await delay(500);
        } while(afterBalance === beforeBalance)

        setLoading(false);
      } else {
        console.log("❗Something went wrong while submitting your transaction:", error)
        setLoading(false);
      }
    });

  }

  return (
    <Button disabled={loading} variant="contained" onClick={get10Eth} className={className}>{loading ? "Loading.." : "Faucet : Get 10 eth"}</Button>
  )
}