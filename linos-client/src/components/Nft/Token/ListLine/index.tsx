import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useArtist from '../../../../hooks/useArtist';
import useCurrentAccount from '../../../../hooks/useCurrentAccount';
import useNftToken from '../../../../hooks/useNftToken';
import Title from '../../../../Layout/Title';
import styles from './styles.module.css';

import FanTokenArtifact from '../../../../contracts/ArtistERC1155Token.json';
import useEth from '../../../../contexts/EthContext/useEth';
import extractError from '../../../../helpers/contractErrors';

export default function NftTokenListLine({
  collectionAddress, tokenId, onClick, displayBalance,
  displayArtist,
  onAnyActionEnd = async () => {}
}: {
  tokenId: number; collectionAddress: string; onClick: () => any; displayBalance?: boolean;
  displayArtist?: boolean;
  onAnyActionEnd?: () => Promise<any>
}) {

  const navigate = useNavigate();
  const { state: { web3 }} = useEth();
  const account = useCurrentAccount();
  const { nftCollection, nftToken, refetch } = useNftToken({ collectionAddress: collectionAddress, tokenId });

  const { artist } = useArtist({ address: nftCollection.owner });

  const minimumFanTokenRequiredToMint = nftCollection.options.minimumFanTokenRequiredToMint;

  const mintNft = async () => {
      const contract = new web3.eth.Contract(FanTokenArtifact.abi, collectionAddress);
      const mintMethod = contract.methods.PublicMint(tokenId);
      try {
        await mintMethod.call({ from: account });
        await mintMethod.send({ from: account });
        await refetch();
        await onAnyActionEnd();
      } catch (e: any) {
        console.log(extractError(e));
        console.log(e)
      }
  }

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
      {nftToken.canMint && (
        <Chip onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          mintNft()
        }} className={styles.chip} label="mint :)" />
      )}
    </div>
  )
}