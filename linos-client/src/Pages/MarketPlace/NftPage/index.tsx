import { Box, Button, Toolbar } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AppBar from "../../../components/AppBar";
import NftTokenListLine from "../../../components/Nft/Token/ListLine";
import useArtist from "../../../hooks/useArtist";
import useNftCollection from "../../../hooks/useNftCollection";
import ContainerFullHeightFlex from "../../../Layout/ContainerFullHeightFlex";
import { SpacingVertical } from "../../../Layout/Spacing";
import Title from "../../../Layout/Title";
import styles from './styles.module.css';

export default function MarketPlaceNftPage() {

  const { nftAddress } = useParams();
  const navigate = useNavigate();

  const {nftCollection} = useNftCollection({ address: nftAddress });
  const { artist } = useArtist({ address: nftCollection.owner });

  let nftIds = []
  for (let index = 0; index < nftCollection.countTokens; index++) {
    nftIds.push(index);
  }

  console.log("nftIds", nftIds);
  return (
    <ContainerFullHeightFlex className={styles.container}>
      <Toolbar />
      <Title>{nftCollection.collectionName}{!!artist.name ? (
        <>
          <Button
            style={{marginLeft: '20px'}}
            variant="text"
            onClick={() => navigate('/marketplace/artist/' + nftCollection.owner )}
          >by {artist.name}</Button>
        </>
      ) : ""}</Title>

      <SpacingVertical />

      <Box className={styles.flexAndGrow}>

        {!!nftAddress && nftIds.map((index) => (
          <NftTokenListLine
            displayBalance
            key={index}
            tokenId={index}
            collectionAddress={nftAddress}
            onClick={() => {
              navigate('/marketplace/nft/' + nftAddress + "/" + index);
            }}
          />
        ))}


      </Box>
    </ContainerFullHeightFlex>
  );
}