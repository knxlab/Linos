import { Button } from "@mui/material";
// @ts-ignore
import { useEth } from "../../contexts/EthContext";
// @ts-ignore
import { ReactComponent as Icon } from './metamask.svg';

export default function MetaMaskLoginBtn() {
    const { connect, state: { ready }} = useEth();

    return (
        <Button variant='contained' onClick={ready ? () => {} : connect}>
            <Icon style={{marginRight: '10px'}} /> Login with Metamask
        </Button>
    )
}