import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import useEth from "../contexts/EthContext/useEth";
import useCurrentAccount from "./useCurrentAccount";

import NftArtifact from '../contracts/ArtistERC1155Token.json';
import useNftCollection, { NFT_COLLECTION } from "./useNftCollection";
import { formatIpfsUri } from "../helpers/ipfsUriFormatter";


 /*
{
  "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
  "external_url": "https://openseacreatures.io/3",
  "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
  "name": "Dave Starbelly",
  "attributes": [ ... ]
}
*/
export type NFT_TOKEN = {
  uri: string;
  name: string;
  description: string;
  image: string;
  maxSupply: number;
  userBalance: number;
  canMint: boolean;
}

const DefaultNftCollection: NFT_TOKEN = {
  uri: "",
  name: "",
  description: "",
  image: "",
  maxSupply: 0,
  userBalance: 0,
  canMint: false
};
export default function useNftToken({ collectionAddress, tokenId }: { collectionAddress?: string; tokenId?: number; }): {
  nftToken: NFT_TOKEN;
  nftCollection: NFT_COLLECTION;
  refetch: () => Promise<any>
} {
    const [value, setValue] = useState<NFT_TOKEN>(DefaultNftCollection);
    const { nftCollection } = useNftCollection({ address: collectionAddress, tokenId });

    const account = useCurrentAccount();
    const { state: { web3 }} = useEth();

    const load = useCallback(async () => {
      if (!collectionAddress || tokenId === undefined) {
        return;
      }
      const contract = new web3.eth.Contract(NftArtifact.abi, collectionAddress)
      try {

        let uri = await contract.methods.uri(tokenId).call();
        let newValue = {
          ...value,
          uri,
          name: await contract.methods._tokenNames(tokenId).call(),
          maxSupply: await contract.methods._maxSupply(tokenId).call(),
          userBalance: await contract.methods.balanceOf(account, tokenId).call(),
          canMint: await contract.methods.canMint(tokenId).call({ from: account })
        };
        if (uri !== "") {
          uri = formatIpfsUri(uri, tokenId);
          const response = await axios({
            method: 'get',
            url: uri
          });
          if (response.data.image) {
            newValue.image = formatIpfsUri(response.data.image, tokenId);
          }
        }
        setValue(newValue)

      } catch (e) {
        console.log(e)
        setValue(DefaultNftCollection)
      }
    }, [web3, collectionAddress, account]);

    useEffect(() => {
        load();
    }, [load]);

    return { nftToken: value, nftCollection, refetch: load};
}