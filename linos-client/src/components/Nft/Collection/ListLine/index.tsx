import { Chip } from '@mui/material';
import useArtist from '../../../../hooks/useArtist';
import useNftCollection from '../../../../hooks/useNftCollection';
import Title from '../../../../Layout/Title';
import styles from './styles.module.css';

export default function NftCollectionListLine({ name, address, onClick }: { name: string; address: string; onClick: () => any }) {

  const { nftCollection } = useNftCollection({ address });
  const { artist } = useArtist({ address: nftCollection.owner });

  return (
    <div className={styles.container} onClick={onClick}>
      <Title className={styles.title}>{name}</Title>
      {!!artist.name && <Chip label={artist.name} />}
      <Chip label={`${nftCollection.countTokens} tokens`} />
      {nftCollection.options.minimumFanTokenRequiredToMint === "0" && (

        <Chip label="Only For Fans !" />

      )}
    </div>
  )
}