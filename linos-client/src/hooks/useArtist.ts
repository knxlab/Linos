import { useCallback, useEffect, useState } from "react";
import useEth from "../contexts/EthContext/useEth";
import useCurrentAccount from "./useCurrentAccount";

import { useLinosContext } from "../contexts/Linos/Context";

export type ARTIST = {
  name: string;
  isRegistered: boolean;
  isValid: boolean;
  fanTokenAddress: string;
}

const DefaultValue: ARTIST = {
  name: "",
  isRegistered: false,
  isValid: false,
  fanTokenAddress: "",
};

export default function useArtist({ address }: { address?: string; }): { artist: ARTIST; refetch: () => Promise<any>} {
    const [value, setValue] = useState<ARTIST>(DefaultValue);

    const { linosContract } = useLinosContext();
    const account = useCurrentAccount();
    const { state: { web3 }} = useEth();

    const load = useCallback(async () => {
      if (!address) {
        return;
      }
      try {
        const artist = await linosContract.methods.getArtist(address).call();
        setValue(artist as ARTIST);
      } catch (e) {
        console.log(e)
        setValue(DefaultValue)
      }
    }, [web3, address, account]);

    useEffect(() => {
        load();
    }, [load]);

    return {artist: value, refetch: load};
}