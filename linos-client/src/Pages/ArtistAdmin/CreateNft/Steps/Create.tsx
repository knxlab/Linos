import {  Box, Button, LinearProgress, Typography } from '@mui/material';
import { useState } from 'react';
import ContainerFullHeightFlex from '../../../../Layout/ContainerFullHeightFlex';
import uploadFilesToIpfs, { uploadJsonsToIpfs } from '../../../../Libs/ipfs/helpers/UploadFile';
import useIpfs from '../../../../Libs/ipfs/hooks/useIpfsWithGateway';
import { NFTConfig } from '../types';
import styles from './styles.module.css';

export default function CreateNftUpload({
  nftConfig,
}: {
  nftConfig: NFTConfig;
}) {

  const { ipfs, isIpfsReady } = useIpfs({ autoInit : true });
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const create = async () => {
    if (!ipfs) {
      return;
    }
    setLoading(true);
    setProgress(0);

    const result = await uploadFilesToIpfs({
      ipfs,
      files: nftConfig.nfts.map(nft => nft.file),
      onProgress: (percent) => {
        setProgress(Math.round(percent * 100))
      }
    })
    console.log("RESULT", result, result.cid.toString());

    const resultJsons = await uploadJsonsToIpfs({
      ipfs,
      jsons: nftConfig.nfts.map((nft, i) => {
        return {
          image: `ipfs://${result.cid.toString()}/linos/${i}`
        }
      }),
      onProgress: console.log
    })

    console.log(resultJsons, resultJsons.cid.toString());

    setLoading(false);
    // setProgress(0);
  }

  return (
    <ContainerFullHeightFlex className={styles.container}>

      <Button disabled={!isIpfsReady || loading} onClick={create}>{!isIpfsReady ? "Loading..." : "Create Your collection"}</Button>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${Math.round(
              progress,
            )}%`}</Typography>
          </Box>
        </Box>
      )}
    </ContainerFullHeightFlex>
  );
}