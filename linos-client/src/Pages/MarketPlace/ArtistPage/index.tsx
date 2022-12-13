import { Chip } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AppBar from "../../../components/AppBar";
import NftCollectionListLine from "../../../components/Nft/Collection/ListLine";
import { useLinosContext } from "../../../contexts/Linos/Context";
import useArtist from "../../../hooks/useArtist";
import useCurrentAccount from "../../../hooks/useCurrentAccount";
import { useEvents } from "../../../hooks/useEvent";
import useFanTokenBalance from "../../../hooks/useFanTokenBalance";
import ContainerFullHeightFlex from "../../../Layout/ContainerFullHeightFlex";
import Title from "../../../Layout/Title";
import styles from './styles.module.css';

export default function ArtistPage() {

  const navigate = useNavigate();
  const account = useCurrentAccount();
  const {artistAddress} = useParams();
  const { artist } = useArtist({ address: artistAddress });
  const { linosNftFactoryContract, linosContract, refreshBalance } = useLinosContext();
  const [collectionsEvents] = useEvents({ contract: linosNftFactoryContract, eventName: "NFTCollectionCreated" });
  const { fanTokenBalance, symbol, refresh } = useFanTokenBalance({ fanTokenAddress: artist.fanTokenAddress, account });

  const boost = async () => {
    await linosContract.methods.boostArtist(artistAddress, 10).send({ from: account });
    refresh();
    refreshBalance();
  }

  return (
    <ContainerFullHeightFlex className={styles.container}>

      <ContainerFullHeightFlex hasToolBar className={styles.flexAndGrow}>

        <Title>{artist.name + " - All Nft Collections"}</Title>

        <div className={styles.actionContainer}>
          <Chip label={`${fanTokenBalance} ${symbol}`} style={{marginRight: '10px'}} />
          <Chip color="success" label={"Boost"} onClick={boost} />
        </div>

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