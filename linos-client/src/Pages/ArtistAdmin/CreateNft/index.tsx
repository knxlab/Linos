import { Container, Toolbar } from "@mui/material";
import { useState } from "react";
import AppBar from "../../../components/AppBar";
import ContainerFullHeightFlex from "../../../Layout/ContainerFullHeightFlex";
import { SpacingVertical } from "../../../Layout/Spacing";
import NftCreateStatusStepper from "./Stepper";
import StepperControl from "./StepperControls";
import AddingImages from "./Steps/AddingImages";
import ConfigImages from "./Steps/ConfigImages";
import CreateNftUpload from "./Steps/Create";
import CreateNftStepGeneral from "./Steps/General";
import styles from './styles.module.css';
import { NFTConfig, NftCreateStep, NFTTypes } from "./types";



export default function CreateNft() {

  const [nftConfig, setNftConfig] = useState<NFTConfig>({
    type: NFTTypes.SELL,
    collectionName: "",
    count: 1,
    nfts: []
  });

  const [step, setStep] = useState<NftCreateStep>(0);

  return (
    <ContainerFullHeightFlex className={styles.container}>
      <AppBar title={"Create a NFT Collection"}/>
      <Toolbar />

      <ContainerFullHeightFlex hasToolBar className={styles.flexAndGrow}>

        <SpacingVertical />

        <NftCreateStatusStepper step={step} />

        {(() => {
          switch(step) {
            case NftCreateStep.General :
              return <CreateNftStepGeneral nftConfig={nftConfig} onChangeConfig={setNftConfig} />;
            case NftCreateStep.AddingImages:
              return <AddingImages nftConfig={nftConfig} onChangeConfig={setNftConfig} />;
            case NftCreateStep.Create:
              return <CreateNftUpload nftConfig={nftConfig} />;
            default:
              return null;
          }
        })()}

        <StepperControl step={step} onChangeStep={setStep} />

      </ContainerFullHeightFlex>
    </ContainerFullHeightFlex>
  );
}