import React, { useContext, useEffect, useState } from 'react';
import useContracts from '../../hooks/useContracts';
import useCurrentUser, { CURRENT_USER_DATA, DefaultCurrentUserValue } from '../../hooks/useCurrentUser';
import NftFactoryArtifact from '../../contracts/ArtistERC1155Factory.json';
import NftMarketPlaceArtifact from '../../contracts/NftMarketPlace.json';
// @ts-ignore
import { useEth } from "../EthContext";
import { CircularProgress } from '@mui/material';

export const LinosContext = React.createContext<{
    currentUser: CURRENT_USER_DATA;
    linosContract: any;
    linosNftFactoryContract: any;
    linosNftMarketPlaceContract: any;
}>({
    currentUser: DefaultCurrentUserValue,
    linosContract: null,
    linosNftFactoryContract: null,
    linosNftMarketPlaceContract: null,
});

export const useLinosContext = () => useContext(LinosContext);

export function LinosContextProvider({
  children
}: {
  children: React.ReactNode
}) {

  const { state: { web3 }} = useEth()
  const contracts = useContracts();
  const [linosNftFactoryContract, setLinosNftFactoryContract] = useState<any>();
  const [linosNftMarketPlaceContract, setLinosNftMarketPlaceContract] = useState<any>();
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
        setLinosNftMarketPlaceContract(marketplaceContract)
        console.log("marketplaceAddress", marketplaceAddress);
      })()
    }

  }, [contracts.LinosPlatform, web3])

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
        linosNftMarketPlaceContract
      }}
    >
      {children}
    </LinosContext.Provider>
  )
}