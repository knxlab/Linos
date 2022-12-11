import { Toolbar } from "@mui/material";
import AppBar from "../../../components/AppBar";
import ContainerFullHeightFlex from "../../../Layout/ContainerFullHeightFlex";
import { SpacingVertical } from "../../../Layout/Spacing";
import styles from './styles.module.css';

export default function NftCollections() {

  return (
    <ContainerFullHeightFlex className={styles.container}>
      <AppBar title={"Your NFT Collections"} />
      <Toolbar />

      <ContainerFullHeightFlex hasToolBar className={styles.flexAndGrow}>

        <SpacingVertical />


      </ContainerFullHeightFlex>
    </ContainerFullHeightFlex>
  );
}