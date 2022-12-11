import {  Box, Button, LinearProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLinosContext } from '../../../../contexts/Linos/Context';
import useCurrentAccount from '../../../../hooks/useCurrentAccount';
import ContainerFullHeightFlex from '../../../../Layout/ContainerFullHeightFlex';
import uploadFilesToIpfs, { uploadJsonsToIpfs } from '../../../../Libs/ipfs/helpers/UploadFile';
import useIpfs from '../../../../Libs/ipfs/hooks/useIpfsWithGateway';
import { NFTConfig } from '../types';
import styles from './styles.module.css';

import ArtistERC1155TokenArtifact from '../../../../contracts/ArtistERC1155Token.json';

export default function CreateNftUpload({
  nftConfig,
}: {
  nftConfig: NFTConfig;
}) {

  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { linosNftFactoryContract } = useLinosContext();
  const { ipfs, isIpfsReady } = useIpfs({ autoInit : true });
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  console.log("ArtistERC1155TokenArtifact", ArtistERC1155TokenArtifact)

  const create = async () => {
    if (!ipfs) {
      return;
    }
    setLoading(true);
    setProgress(0);

    const resultImages = await uploadFilesToIpfs({
      ipfs,
      files: nftConfig.nfts.map(nft => nft.file),
      onProgress: (percent) => {
        setProgress(Math.round(percent * 100))
      }
    })

    const resultJsons = await uploadJsonsToIpfs({
      ipfs,
      jsons: nftConfig.nfts.map((nft, i) => {
        /*
        {
          "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
          "external_url": "https://openseacreatures.io/3",
          "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
          "name": "Dave Starbelly",
          "attributes": [ ... ]
        }
        */
        return {
          name: nft.name,
          description: nft.name,
          image: `ipfs://${resultImages.cid.toString()}/linos/${i}`
        }
      }),
      onProgress: console.log
    })

    console.log("resultJsons", resultJsons.cid.toString());
    console.log("nftConfig.type", nftConfig.type);
    const method = linosNftFactoryContract.methods.createNFTCollection(
      `ipfs://${resultJsons.cid.toString()}/linos/{id}`,
      nftConfig.collectionName,
      nftConfig.nfts.map(nft => nft.name),
      nftConfig.nfts.map(nft => nft.maxSupply),
      {
        distributionType: nftConfig.type,
        minimumFanTokenRequiredToMint: 0,
        maxTotalMintPerWallet: 0,
        maxMintPerWallerPerToken: 0
      }
    );

    try {
      await method.call({ from: account });
      const resultCreateNft = await method.send({ from: account });
      console.log("resultCreateNft", resultCreateNft)
      // if (resultCreateNft.status) {
      //   navigate("/marketplace/all");
      //   return;
      // }
    } catch (e: any) {
      alert(e.message);
    }

    setLoading(false);
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