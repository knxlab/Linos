import { Box, Button, Chip, Divider, Toolbar } from "@mui/material";
import { useParams } from "react-router-dom";
import AppBar from "../../../components/AppBar";
import NftSellListingLine from "../../../components/Nft/SellListing/ListLine";
import NftTokenListLine from "../../../components/Nft/Token/ListLine";
import { useLinosContext } from "../../../contexts/Linos/Context";
import useArtist from "../../../hooks/useArtist";
import { useEvents } from "../../../hooks/useEvent";
import useNftToken from "../../../hooks/useNftToken";
import ContainerFullHeightFlex from "../../../Layout/ContainerFullHeightFlex";
import Title from "../../../Layout/Title";
import SellButton from "./SellButton";
import styles from './styles.module.css';

export default function MarketPlaceNftTokenPage() {

  const { nftAddress, tokenId } = useParams();

  const { linosNftMarketPlaceContract } = useLinosContext();
  const { nftCollection, nftToken, refetch } = useNftToken({ collectionAddress: nftAddress, tokenId: parseInt(tokenId || "0", 10) });
  const { artist } = useArtist({ address: nftCollection.owner });

  const [sellEvents] = useEvents({ contract: linosNftMarketPlaceContract, eventName: "SellEvent" });

  return (
    <ContainerFullHeightFlex className={styles.container}>

      <Toolbar />
      <Box className={styles.flexAndGrow}>

        <div>
          <Title>{nftToken.name + " - " + nftCollection.collectionName + (!!artist.name ? ` -- by ${artist.name}` : "")}</Title>
          <Chip label={"Your Balance : " + nftToken.userBalance} />
        </div>
        {!!nftAddress && nftToken.userBalance > 0 && (
          <div className={styles.actionContainer}>
            <div />
            <SellButton
              userBalance={nftToken.userBalance}
              onListingCreated={async () => {
                console.log("Listing Created !");
              }}
              tokenAddress={nftAddress}
              tokenId={parseInt(tokenId || "0", 10)}
            />
          </div>
        )}

        {!!nftAddress && tokenId !== undefined && (
          <NftTokenListLine
            tokenId={parseInt(tokenId, 10)}
            collectionAddress={nftAddress}
            onClick={() => {}}
            onAnyActionEnd={refetch}
          />
        )}

        <Divider />

        <div style={{marginTop: '30px'}}>
          <Title>All listings</Title>
          {!!nftAddress && tokenId !== undefined && sellEvents.filter(sellEvent => sellEvent.returnValues.tokenAddress === nftAddress).map(sellEvent => (
            <NftSellListingLine
              key={sellEvent.returnValues.sellId}
              collectionAddress={nftAddress}
              tokenId={parseInt(tokenId, 10)}
              sellId={parseInt(sellEvent.returnValues.sellId, 10)}
              onBought={() => {
                refetch();
              }}
            />
          ))}
        </div>



      </Box>
    </ContainerFullHeightFlex>
  );
}