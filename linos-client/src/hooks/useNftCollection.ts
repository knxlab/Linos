import { useCallback, useEffect, useState } from "react";
import useEth from "../contexts/EthContext/useEth";
import useCurrentAccount from "./useCurrentAccount";

import NftArtifact from '../contracts/ArtistERC1155Token.json';


export type NFT_COLLECTION_OPTIONS = {
  distributionType: 0 | 1;
  maxMintPerWallerPerToken: number;
  maxTotalMintPerWallet: number;
  minimumFanTokenRequiredToMint: number;
};
export type NFT_COLLECTION = {
  // uri: string;
  collectionName: string;
  owner: string;
  options: NFT_COLLECTION_OPTIONS;
  countTokens: number;
  tokenUri?: string;
}

const DefaultNftCollection: NFT_COLLECTION = {
  collectionName: "",
  owner: "",
  countTokens: 0,
  tokenUri: "",
  options: {
    distributionType: 0,
    maxMintPerWallerPerToken: 0,
    maxTotalMintPerWallet: 0,
    minimumFanTokenRequiredToMint: 0
  }
};

function transformOptions(_options: any): NFT_COLLECTION_OPTIONS {
  return {
    distributionType: parseInt(_options.distributionType, 10) as (0 | 1),
    maxMintPerWallerPerToken: parseInt(_options.maxMintPerWallerPerToken, 10),
    maxTotalMintPerWallet: parseInt(_options.maxTotalMintPerWallet, 10),
    minimumFanTokenRequiredToMint: parseInt(_options.minimumFanTokenRequiredToMint, 10)
  }
}
export default function useNftCollection({ address, tokenId }: { address?: string; tokenId?: number }): { nftCollection: NFT_COLLECTION; refetch: () => Promise<any>} {
    const [value, setValue] = useState<NFT_COLLECTION>(DefaultNftCollection);

    const account = useCurrentAccount();
    const { state: { web3 }} = useEth();


    const load = useCallback(async () => {
      console.log("address", address)
      if (!address) {
        return;
      }
      const contract = new web3.eth.Contract(NftArtifact.abi, address)
      try {
        setValue({
          collectionName: await contract.methods.collectionName().call({ from: account }),
          options: transformOptions(await contract.methods._options().call({ from: account })),
          countTokens: await contract.methods.getCountTokens().call({ from: account }),
          owner: await contract.methods.owner().call(),

          ...(tokenId !== undefined ? {
            tokenUri: await contract.methods.uri(tokenId).call()
          } : {})
        })
      } catch (e) {
        console.log(e)
        setValue(DefaultNftCollection)
      }
    }, [web3, address, account]);

    useEffect(() => {
        load();
    }, [load]);

    console.log("nftCollection", value);

    return {nftCollection: value, refetch: load};
}