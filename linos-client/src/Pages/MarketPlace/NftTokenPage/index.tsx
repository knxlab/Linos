import { Chip } from "@mui/material";
import { useParams } from "react-router-dom";
import AppBar from "../../../components/AppBar";
import NftTokenListLine from "../../../components/Nft/Token/ListLine";
import useArtist from "../../../hooks/useArtist";
import useNftToken from "../../../hooks/useNftToken";
import ContainerFullHeightFlex from "../../../Layout/ContainerFullHeightFlex";
import styles from './styles.module.css';

export default function MarketPlaceNftTokenPage() {

  const { nftAddress, tokenId } = useParams();

  const { nftCollection, nftToken } = useNftToken({ collectionAddress: nftAddress, tokenId: parseInt(tokenId || "0", 10) });
  const { artist } = useArtist({ address: nftCollection.owner });

  return (
    <ContainerFullHeightFlex className={styles.container}>
      <AppBar title={nftToken.name + " - " + nftCollection.collectionName + (!!artist.name ? ` -- by ${artist.name}` : "")}>
        <Chip label={"Balance : " + nftToken.userBalance} />
      </AppBar>

      <ContainerFullHeightFlex hasToolBar className={styles.flexAndGrow}>

      {!!nftAddress && tokenId !== undefined && (
      <NftTokenListLine
        tokenId={parseInt(tokenId, 10)}
        collectionAddress={nftAddress}
        onClick={() => {}}
      />
      )}

      </ContainerFullHeightFlex>
    </ContainerFullHeightFlex>
  );
}