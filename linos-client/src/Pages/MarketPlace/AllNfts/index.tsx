import { Box, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArtistCard from "../../../components/Artist/ArtistCard";
import NftCollectionListLine from "../../../components/Nft/Collection/ListLine";
import { useLinosContext } from "../../../contexts/Linos/Context";
import { useEvents } from "../../../hooks/useEvent";
import ContainerFullHeightFlex from "../../../Layout/ContainerFullHeightFlex";
import { SpacingVertical } from "../../../Layout/Spacing";
import Title from "../../../Layout/Title";
import styles from './styles.module.css';

export default function AllNfts() {

  const navigate = useNavigate();
  const { linosNftFactoryContract, linosContract  } = useLinosContext();
  const [collectionsEvents] = useEvents({ contract: linosNftFactoryContract, eventName: "NFTCollectionCreated" });
  const [artists] = useEvents({ contract: linosContract, eventName: "ArtistRegistered" })

  return (
    <ContainerFullHeightFlex className={styles.container}>

      <Toolbar />
      <Title>Latest Artists</Title>

      <SpacingVertical />

      <Box className={styles.artistsContainer}>
        {artists.map(artistEvent => (
          <ArtistCard
            artistAddress={artistEvent.returnValues.artistAddress}
            className={styles.artistCard}
          />
        ))}
      </Box>

      <SpacingVertical />
      <SpacingVertical />
      <Title>Latest Collections</Title>

      <SpacingVertical />

      <Box className={styles.flexAndGrow}>

        {collectionsEvents.map(collectionEvent => (
          <NftCollectionListLine
            key={collectionEvent.returnValues._collectionAddress}
            displayArtist
            name={collectionEvent.returnValues._collectionName}
            address={collectionEvent.returnValues._collectionAddress}
            onClick={() => {
              navigate('/marketplace/nft/' + collectionEvent.returnValues._collectionAddress);
            }}
          />
        ))}
      </Box>
    </ContainerFullHeightFlex>
  );
}