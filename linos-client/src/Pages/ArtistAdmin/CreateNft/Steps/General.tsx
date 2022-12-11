import { Alert, AlertTitle, Button } from '@mui/material';
import Select from '../../../../components/Select';
import Slider from '../../../../components/Slider';
import ContainerFullHeightFlex from '../../../../Layout/ContainerFullHeightFlex';
import FormLineWithTitle from '../../../../Layout/Form/FormLineWithTitle';
import { NFTConfig } from '../types';
import styles from './styles.module.css';

export default function CreateNftStepGeneral({
  nftConfig,
  onChangeConfig
}: {
  nftConfig: NFTConfig;
  onChangeConfig: (nftConfig: NFTConfig) => any;
}) {

  return (
    <ContainerFullHeightFlex className={styles.container}>
      <FormLineWithTitle title={"Type"} className={styles.formLine}>
        <Select options={['DROP', 'SELL']} selectedIndex={nftConfig.type} onChangeIndex={index => onChangeConfig({...nftConfig, type: index})} />
      </FormLineWithTitle>

      <Alert severity="info" variant='outlined' className={styles.formLine}>
        <AlertTitle>{nftConfig.type === 0 ? "DROP" : "SELL"}</AlertTitle>
        {nftConfig.type === 0 ?
          "Users or Fans (you choose) will be able to mint your nft for free ! (but don't worry, you can set a royalties)" :
          "Users or Fans (you choose) will purshase your nfts for the amount of eth you decide"
        }
      </Alert>

      <FormLineWithTitle title={"How many Nft ?"} className={styles.formLine}>
        <Slider value={nftConfig.count} min={1} max={10} onChange={val => onChangeConfig({ ...nftConfig, count: val })} />
      </FormLineWithTitle>

      {nftConfig.count === 10 && <Alert severity="info" variant='outlined' className={styles.formLine}>
        <AlertTitle>You want more ?</AlertTitle>
        {"Go Premium =>"} <Button>Premium Access For Artists</Button>
      </Alert>}

    </ContainerFullHeightFlex>
  );
}