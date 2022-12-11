import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import useEth from '../../../../contexts/EthContext/useEth';
import { useLinosContext } from '../../../../contexts/Linos/Context';
import useCurrentAccount from '../../../../hooks/useCurrentAccount';
import Title from '../../../../Layout/Title';
import BuyButton from './BuyButton';
import styles from './styles.module.css';


type SELL_LISTING = {
  amountOfTokens: string;
  pricePerToken: string;
  sellerAddress: string;
  canceled: boolean;
};

export default function NftSellListingLine({ sellId, collectionAddress, tokenId }: {
  collectionAddress: string;
  tokenId: number
  sellId: number;
}) {

  const { state: { web3 }} = useEth();
  const account = useCurrentAccount();
  const { linosNftMarketPlaceContract } = useLinosContext();
  const [sellListing, setSellListing] = useState<SELL_LISTING>({
    sellerAddress: '',
    pricePerToken: "0",
    amountOfTokens: "0",
    canceled: false
  });

  const loadListing = useCallback(async () => {
    const sellListing = await linosNftMarketPlaceContract.methods.getListing(sellId).call();
    setSellListing(sellListing as SELL_LISTING);
  }, [sellId])

  useEffect(() => {
    loadListing()
  }, [loadListing]);

  const cancelListing = async () => {
    await linosNftMarketPlaceContract.methods.cancelListing(sellId).send({ from : account });
    loadListing();
  }

  if (sellListing.sellerAddress === "" || sellListing.canceled || sellListing.amountOfTokens === "0") {
    return null;
  }

  const displayPrice = web3.utils.fromWei(sellListing.pricePerToken, 'ether') + " eth";

  return (
    <div className={styles.container}>
      <Title className={styles.title}>From {`${sellListing.sellerAddress.slice(0, 5)}...${sellListing.sellerAddress.slice(-4)}`}</Title>
      <span className={styles.numberForPrice}>{`${sellListing.amountOfTokens} for ${displayPrice} each`}</span>
      <div className={styles.actionsContainer}>
        {sellListing.sellerAddress !== account ? (
          <BuyButton
            style={{width: '150px'}}
            onBought={loadListing}
            sellId={sellId}
            pricePerToken={sellListing.pricePerToken}
            maxAmountToken={parseInt(sellListing.amountOfTokens, 10)}
          />
        ): (
          <Button style={{width: '150px'}} variant="contained" onClick={cancelListing}>Cancel listing</Button>
        )}
      </div>
    </div>
  )
}