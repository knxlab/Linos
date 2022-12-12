import { useNavigate, useParams } from "react-router-dom";
import AppBar from "../../../components/AppBar";
import NftCollectionListLine from "../../../components/Nft/Collection/ListLine";
import { useLinosContext } from "../../../contexts/Linos/Context";
import useArtist from "../../../hooks/useArtist";
import { useEvents } from "../../../hooks/useEvent";
import ContainerFullHeightFlex from "../../../Layout/ContainerFullHeightFlex";
import styles from './styles.module.css';

export default function ArtistPage() {

  const navigate = useNavigate();
  const {artistAddress} = useParams();
  const { artist } = useArtist({ address: artistAddress });
  const { linosNftFactoryContract } = useLinosContext();
  const [collectionsEvents] = useEvents({ contract: linosNftFactoryContract, eventName: "NFTCollectionCreated" });

  console.log("artist", artist, artist.name);
  console.log("collections", collectionsEvents);

  return (
    <ContainerFullHeightFlex className={styles.container}>
      <AppBar title={artist.name + " - All Nft Collections"} />

      <ContainerFullHeightFlex hasToolBar className={styles.flexAndGrow}>

        {collectionsEvents.filter(collectionEvent => collectionEvent.returnValues._artistAddress === artistAddress).map(collectionEvent => (
          <NftCollectionListLine
            key={collectionEvent.returnValues._collectionAddress}
            name={collectionEvent.returnValues._collectionName}
            address={collectionEvent.returnValues._collectionAddress}
            onClick={() => {
              navigate('/marketplace/nft/' + collectionEvent.returnValues._collectionAddress);
            }}
          />
        ))}


      </ContainerFullHeightFlex>
    </ContainerFullHeightFlex>
  );
}