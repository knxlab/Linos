import { Alert, AlertTitle, Button, Switch, TextField } from '@mui/material';
import Select from '../../../../components/Select';
import Slider from '../../../../components/Slider';
import ContainerFullHeightFlex from '../../../../Layout/ContainerFullHeightFlex';
import FormLineWithTitle from '../../../../Layout/Form/FormLineWithTitle';
import { NFTConfig, NFTTypes } from '../types';
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

      <Alert severity="info" variant='outlined' className={styles.formLine}>
        <AlertTitle>{nftConfig.type === 0 ? "SELL" : "DROP"}</AlertTitle>
        {nftConfig.type === 0 ?
          "Users or Fans (you choose) will purshase your nfts for the amount of eth you decide":
          "Users or Fans (you choose) will be able to mint your nft for free ! (but don't worry, you can set a royalties)"
        }
      </Alert>

      <FormLineWithTitle title={"Type"} className={styles.formLine}>
        <Select options={['SELL', 'DROP']} selectedIndex={nftConfig.type} onChangeIndex={index => onChangeConfig({...nftConfig, type: index})} />
      </FormLineWithTitle>

      <FormLineWithTitle title={"Collection Name"} className={styles.formLine}>
        <TextField label="Collection Name" variant="outlined" value={nftConfig.collectionName} onChange={(e) => {
          onChangeConfig({
            ...nftConfig,
            collectionName: e.target.value
          })
        }} />
      </FormLineWithTitle>


      <FormLineWithTitle title={"How many Nft ?"} className={styles.formLine}>
        <Slider value={nftConfig.count} min={1} max={6} onChange={val => onChangeConfig({ ...nftConfig, count: val })} />
      </FormLineWithTitle>

      {nftConfig.count === 6 && <Alert severity="info" variant='outlined' className={styles.formLine}>
        <AlertTitle>You want more ?</AlertTitle>
        {"Go Premium =>"} <Button>Premium Access For Artists</Button>
      </Alert>}

      {nftConfig.type === NFTTypes.DROP && (
        <>
        <FormLineWithTitle title={"Minter must be a fan ?"} className={styles.formLine}>
          <Switch checked={nftConfig.mustBeAFan} onChange={(e) => {
            onChangeConfig({
                ...nftConfig,
                mustBeAFan: e.target.checked
              })
          }} />
        </FormLineWithTitle>

        {nftConfig.mustBeAFan && (
          <FormLineWithTitle title={"Minimum fantoken to mint"} className={styles.formLine}>
            <TextField label="Minimum of FanToken needed to mint this collection" variant="outlined" value={nftConfig.minimumFanTokenRequiredToMint || ""} onChange={(e) => {
              onChangeConfig({
                ...nftConfig,
                minimumFanTokenRequiredToMint: parseInt(e.target.value, 10) || 0
              })
            }} />
          </FormLineWithTitle>
        )}
        </>
      )}

    </ContainerFullHeightFlex>
  );
}