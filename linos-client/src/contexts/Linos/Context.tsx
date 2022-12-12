import React, { useCallback, useContext, useEffect, useState } from 'react';
import useContracts from '../../hooks/useContracts';
import useCurrentUser, { CURRENT_USER_DATA, DefaultCurrentUserValue } from '../../hooks/useCurrentUser';
import NftFactoryArtifact from '../../contracts/ArtistERC1155Factory.json';
import NftMarketPlaceArtifact from '../../contracts/NftMarketPlace.json';
import ListenTokenArtifact from '../../contracts/ListenToken.json';
// @ts-ignore
import { useEth } from "../EthContext";
import { CircularProgress } from '@mui/material';
import useCurrentAccount from '../../hooks/useCurrentAccount';

export const LinosContext = React.createContext<{
    currentUser: CURRENT_USER_DATA;
    linosContract: any;
    linosNftFactoryContract: any;
    linosNftMarketPlaceContract: any;
    linosNftMarketPlaceAddress: string;
    listenTokenContract: any;
    listenTokenBalance: number;
    refreshBalance: () => Promise<any>;
}>({
    currentUser: DefaultCurrentUserValue,
    linosContract: null,
    linosNftFactoryContract: null,
    linosNftMarketPlaceContract: null,
    linosNftMarketPlaceAddress: "",
    listenTokenContract: null,
    listenTokenBalance: 0,
    refreshBalance: async () => {}
});

export const useLinosContext = () => useContext(LinosContext);

export function LinosContextProvider({
  children
}: {
  children: React.ReactNode
}) {

  const { state: { web3 }} = useEth()
  const contracts = useContracts();
  const account = useCurrentAccount();
  const [linosNftFactoryContract, setLinosNftFactoryContract] = useState<any>();
  const [linosNftMarketPlaceContract, setLinosNftMarketPlaceContract] = useState<any>();
  const [listenTokenContract, setListenTokenContract] = useState<any>();
  const [linosNftMarketPlaceAddress, setLinosNftMarketPlaceAddress] = useState<string>("");
  const [listenTokenBalance, setListenTokenBalance] = useState(0);
  const currentUser = useCurrentUser({
    linosContract: contracts.LinosPlatform
  });

  useEffect(() => {

    if (!contracts.LinosPlatform) {
      return;
    }


    if (!linosNftFactoryContract) {
      (async () => {
        const factoryAddress = await contracts.LinosPlatform.methods.nftFactoryAddress().call();
        const factoryContract = new web3.eth.Contract(NftFactoryArtifact.abi, factoryAddress);
        setLinosNftFactoryContract(factoryContract)
        console.log("factoryAddress", factoryAddress);
      })()
    }

    if (!linosNftMarketPlaceContract) {
      (async () => {
        const marketplaceAddress = await contracts.LinosPlatform.methods.nftMarketPlaceAddress().call();
        const marketplaceContract = new web3.eth.Contract(NftMarketPlaceArtifact.abi, marketplaceAddress);
        setLinosNftMarketPlaceAddress(marketplaceAddress);
        setLinosNftMarketPlaceContract(marketplaceContract)
        console.log("marketplaceAddress", marketplaceAddress);
      })()
    }

    if (!listenTokenContract) {
      (async () => {
        const address = await contracts.LinosPlatform.methods.listenTokenAddress().call();
        const contract = new web3.eth.Contract(ListenTokenArtifact.abi, address);
        setListenTokenContract(contract);
        console.log("listenToken Address", address);
      })()
    }

  }, [contracts.LinosPlatform, web3]);

  const refreshBalance = useCallback(async () => {
    if (!account || !listenTokenContract) {
      return;
    }
    const balance = await listenTokenContract.methods.balanceOf(account).call();
    setListenTokenBalance(balance);
  }, [listenTokenContract, account]);

  useEffect(() => {
    refreshBalance()
  }, [refreshBalance])

  if (!contracts.LinosPlatform || !linosNftFactoryContract || !linosNftMarketPlaceContract) {
    return (
      <CircularProgress />
    );
  }

  return (
    <LinosContext.Provider
      value={{
        currentUser,
        linosContract: contracts.LinosPlatform,
        linosNftFactoryContract,
        linosNftMarketPlaceContract,
        linosNftMarketPlaceAddress,
        listenTokenContract,
        listenTokenBalance,
        refreshBalance
      }}
    >
      {children}
    </LinosContext.Provider>
  )
}