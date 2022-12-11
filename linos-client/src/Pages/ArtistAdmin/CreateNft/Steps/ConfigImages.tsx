import { Alert, AlertTitle, Button, Divider, TextField } from '@mui/material';
import Select from '../../../../components/Select';
import Slider from '../../../../components/Slider';
import ContainerFullHeightFlex from '../../../../Layout/ContainerFullHeightFlex';
import FormLineWithTitle from '../../../../Layout/Form/FormLineWithTitle';
import { NFTConfig } from '../types';
import styles from './styles.module.css';

export default function ConfigImages({
  nftConfig,
  onChangeConfig
}: {
  nftConfig: NFTConfig;
  onChangeConfig: (nftConfig: NFTConfig) => any;
}) {

  return (
    <ContainerFullHeightFlex className={styles.container}>

      {nftConfig.nfts.map((nft, index) => (
        <div key={index}>
          <img src={URL.createObjectURL(nft.file)} height='100' />
          <FormLineWithTitle title={"Name"} className={styles.formLine}>
            <TextField label="" variant="outlined" value={nft.name} onChange={(e) => {
              const nfts = [...nftConfig.nfts];
              nfts[index].name = e.target.value;
              onChangeConfig({
                ...nftConfig,
                nfts
              })
            }} />
          </FormLineWithTitle>
          <FormLineWithTitle title={"Max supply (1 - 1e18)"} className={styles.formLine}>
            <TextField style={{marginRight: '10px'}} label="" variant="outlined" value={nft.maxSupply || ""} onChange={(e) => {
              const nfts = [...nftConfig.nfts];
              nfts[index].maxSupply = parseInt(e.target.value, 10) || 0;
              onChangeConfig({
                ...nftConfig,
                nfts
              })
            }} /> {!nft.maxSupply ? "(1)" : ""}
          </FormLineWithTitle>
          <Divider />
        </div>
      ))}


    </ContainerFullHeightFlex>
  );
}