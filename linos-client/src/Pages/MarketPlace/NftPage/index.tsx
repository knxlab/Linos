import { useNavigate, useParams } from "react-router-dom";
import AppBar from "../../../components/AppBar";
import NftTokenListLine from "../../../components/Nft/Token/ListLine";
import useArtist from "../../../hooks/useArtist";
import useNftCollection from "../../../hooks/useNftCollection";
import ContainerFullHeightFlex from "../../../Layout/ContainerFullHeightFlex";
import styles from './styles.module.css';

export default function MarketPlaceNftPage() {

  const { nftAddress } = useParams();
  const navigate = useNavigate();

  const {nftCollection} = useNftCollection({ address: nftAddress });
  const { artist } = useArtist({ address: nftCollection.owner });

  console.log("artist", artist);

  let nftIds = []
  for (let index = 0; index < nftCollection.countTokens; index++) {
    nftIds.push(index);
  }

  console.log("nftIds", nftIds);
  return (
    <ContainerFullHeightFlex className={styles.container}>
      <AppBar title={nftCollection.collectionName + (!!artist.name ? ` -- by ${artist.name}` : "")} />

      <ContainerFullHeightFlex hasToolBar className={styles.flexAndGrow}>

      {!!nftAddress && nftIds.map((index) => (
        <NftTokenListLine
          key={index}
          tokenId={index}
          collectionAddress={nftAddress}
          onClick={() => {
            navigate('/marketplace/nft/' + nftAddress + "/" + index);
          }}
        />
      ))}


      </ContainerFullHeightFlex>
    </ContainerFullHeightFlex>
  );
}