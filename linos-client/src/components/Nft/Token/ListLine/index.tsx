import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useEth from '../../../../contexts/EthContext/useEth';
import useArtist from '../../../../hooks/useArtist';
import useCurrentAccount from '../../../../hooks/useCurrentAccount';
import useFanTokenBalance from '../../../../hooks/useFanTokenBalance';
import useNftCollection from '../../../../hooks/useNftCollection';
import useNftToken from '../../../../hooks/useNftToken';
import Title from '../../../../Layout/Title';
import styles from './styles.module.css';


export default function NftTokenListLine({ collectionAddress, tokenId, onClick }: { tokenId: number; collectionAddress: string; onClick: () => any }) {

  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { nftCollection, nftToken } = useNftToken({ collectionAddress: collectionAddress, tokenId });

  const { artist } = useArtist({ address: nftCollection.owner });
  const { fanTokenBalance } = useFanTokenBalance({ fanTokenAddress: artist.fanTokenAddress, account });

  const canMint = fanTokenBalance > parseInt(nftCollection.options.minimumFanTokenRequiredToMint, 10);

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
      {!!artist.name && <Chip label={"By " + artist.name} onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate("/marketplace/artist/" + nftCollection.owner);
      }}/>}
      <Chip label={`Balance : ${nftToken.userBalance} / ${nftToken.maxSupply} tokens`} />
      {nftCollection.options.minimumFanTokenRequiredToMint !== "0" && (
        <Chip label="Only For Fans !" />
      )}
      {nftCollection.options.minimumFanTokenRequiredToMint !== "0" && canMint && (
        <Chip label="mint :)" />
      )}
    </div>
  )
}