import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useArtist from '../../../../hooks/useArtist';
import useNftCollection from '../../../../hooks/useNftCollection';
import useNftToken from '../../../../hooks/useNftToken';
import Title from '../../../../Layout/Title';
import styles from './styles.module.css';

export default function NftCollectionListLine({
  name, address, onClick,
  displayArtist
}: {
  name: string; address: string; onClick: () => any;
  displayArtist?: boolean;
}) {

  const navigate = useNavigate();
  const { nftCollection } = useNftCollection({ address });
  const { artist } = useArtist({ address: nftCollection.owner });
  const { nftToken } = useNftToken({ collectionAddress: address, tokenId: 0 });

  return (
    <div className={styles.container} onClick={onClick}>
      {!!nftToken.image ? (
        <div className={styles.imgContainer}>
          <img src={nftToken.image} height="100%" width="100px" style={{ width: '100px', objectFit: "contain"}} />
        </div>
      ): (
        <div className={styles.imgPlaceholder} />
      )}
      <Title className={styles.title}>{name}</Title>
      {displayArtist && !!artist.name && (
      <Chip className={styles.chip} label={"by " + artist.name} onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate("/marketplace/artist/" + nftCollection.owner);
      }} />
      )}
      <Chip className={styles.chip} label={`${nftCollection.countTokens} tokens`} />
      {nftCollection.options.minimumFanTokenRequiredToMint !== 0 && (
        <Chip className={styles.chip} label="Only For Fans !" />
      )}
    </div>
  )
}