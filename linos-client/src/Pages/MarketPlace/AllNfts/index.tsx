import { Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppBar from "../../../components/AppBar";
import NftCollectionListLine from "../../../components/Nft/Collection/ListLine";
import { useLinosContext } from "../../../contexts/Linos/Context";
import { useEvents } from "../../../hooks/useEvent";
import ContainerFullHeightFlex from "../../../Layout/ContainerFullHeightFlex";
import { SpacingVertical } from "../../../Layout/Spacing";
import styles from './styles.module.css';

export default function AllNfts() {

  const navigate = useNavigate();
  const { linosNftFactoryContract } = useLinosContext();
  const [collectionsEvents] = useEvents({ contract: linosNftFactoryContract, eventName: "NFTCollectionCreated" });

  console.log("collections", collectionsEvents);
  return (
    <ContainerFullHeightFlex className={styles.container}>
      <AppBar title={"All Nfts"} />

      <ContainerFullHeightFlex hasToolBar className={styles.flexAndGrow}>

        {collectionsEvents.map(collectionEvent => (
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