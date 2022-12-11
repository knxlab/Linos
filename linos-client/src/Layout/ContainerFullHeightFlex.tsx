import { Container } from "@mui/material";
import styles from './styles.module.css';

export default function ContainerFullHeightFlex({
  hasToolBar = false, className, ...props
}: {
  hasToolBar?: boolean;
  className?: string;
} & any) {
  return (
    <Container {...props} className={`${styles.containerFullHeightFlex} ${hasToolBar ? styles.withtoolbar : ""} ${className || ""}`} />
  )
}