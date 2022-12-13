import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useArtist from '../../../../hooks/useArtist';
import useCurrentAccount from '../../../../hooks/useCurrentAccount';
import useFanTokenBalance from '../../../../hooks/useFanTokenBalance';
import useNftToken from '../../../../hooks/useNftToken';
import Title from '../../../../Layout/Title';
import styles from './styles.module.css';


export default function NftTokenListLine({
  collectionAddress, tokenId, onClick, displayBalance,
  displayArtist
}: {
  tokenId: number; collectionAddress: string; onClick: () => any; displayBalance?: boolean;
  displayArtist?: boolean;
}) {

  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { nftCollection, nftToken } = useNftToken({ collectionAddress: collectionAddress, tokenId });

  const { artist } = useArtist({ address: nftCollection.owner });
  const { fanTokenBalance } = useFanTokenBalance({ fanTokenAddress: artist.fanTokenAddress, account });

  const minimumFanTokenRequiredToMint = nftCollection.options.minimumFanTokenRequiredToMint;
  const canMint = fanTokenBalance > minimumFanTokenRequiredToMint;

  return (
    <div className={styles.container} onClick={onClick}>
      {!!nftToken.image ? (
        <div className={styles.imgContainer}>
          <img src={nftToken.image} height="100%" width="100px" style={{ width: '100px', objectFit: "contain"}} />
        </div>
      ): (
        <div className={styles.imgPlaceholder} />
      )}
      <Title className={styles.title}>{nftToken.name} - {nftCollection.collectionName}</Title>
      {displayArtist && !!artist.name && <Chip label={"By " + artist.name} onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate("/marketplace/artist/" + nftCollection.owner);
      }}/>}
      {displayBalance && (
        <Chip className={styles.chip} label={`Your balance : ${nftToken.userBalance}`} />
      )}
      {minimumFanTokenRequiredToMint !== 0 && (
        <Chip className={styles.chip} label="Only For Fans !" />
      )}
      {minimumFanTokenRequiredToMint !== 0 && canMint && (
        <Chip className={styles.chip} label="mint :)" />
      )}
    </div>
  )
}