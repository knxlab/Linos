import * as React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Paper, TextField } from '@mui/material';
import styles from './styles.module.css';
import { useSnackbar } from 'notistack';
import useCurrentAccount from '../../../../../hooks/useCurrentAccount';
import { useLinosContext } from '../../../../../contexts/Linos/Context';
import Title from '../../../../../Layout/Title';

import NftArtifact from '../../../../../contracts/ArtistERC1155Token.json';
import useEth from '../../../../../contexts/EthContext/useEth';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function BuyModal({
    open = false,
    handleClose = () => {},
    onBought = async () => null,

    sellId,
    maxAmountToken,
    pricePerToken
}: {
    open: boolean;
    handleClose: () => any;
    onBought?: () => Promise<any>;

    sellId: number;
    maxAmountToken: number;
    pricePerToken: string;
}) {

    const { state: { web3 }} = useEth();

    const [amountOfTokens, setAmountOfToken] = React.useState<number>(1);

    const [loading, setLoading] = React.useState(false);
    const { linosNftMarketPlaceContract, linosNftMarketPlaceAddress } = useLinosContext();
    const account = useCurrentAccount();
    const { enqueueSnackbar } = useSnackbar();

    const getTotalPriceString = (toEth: boolean = false) => {
      const wei = web3.utils.toBN(pricePerToken);
      const totalPrice = wei.mul(web3.utils.toBN(amountOfTokens));

      if (!toEth) {
        return totalPrice.toString();
      } else {
        return web3.utils.fromWei(totalPrice.toString(), "ether");
      }
    }

    const onPressBuy = async () => {

      const totalPrice = getTotalPriceString();

      if (!linosNftMarketPlaceContract) {
          alert("An error has occured, no VotingFactory available");
          return;
      }
      try {
          setLoading(true);
          console.log("totalPrice.address", totalPrice);

          const method = linosNftMarketPlaceContract.methods.buyItem(
            sellId,
            amountOfTokens
          );
          await method.call({ from: account, value: totalPrice });
          await method.send({ from: account, value: totalPrice });
          await onBought();
          setLoading(false);
          enqueueSnackbar("Bought!", { variant: "success" });
          handleClose();
      } catch (e) {
          setLoading(false);
      }
    }

    return (
        <Modal
            open={loading || open}
            onClose={loading ? () => {} : handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Paper sx={style}>
                <Title>
                    Buy Nfts
                </Title>
                <div>
                  <div>
                    <TextField
                      label="How many token ?"
                      placeholder={'How many tokens (max :' + maxAmountToken + ")"} fullWidth variant="outlined" disabled={loading}
                      value={amountOfTokens || ""}
                      onChange={e => {
                        const amount = parseInt(e.target.value, 10) || 0;
                        setAmountOfToken(Math.min(maxAmountToken, amount))
                      }}
                    />
                  </div>

                </div>
                <div className={styles.modalActions}>
                    {!loading && <Button variant='outlined' color='secondary' onClick={handleClose}>Cancel</Button>}
                    <Button
                      variant='contained'
                      color='primary'
                      disabled={loading || amountOfTokens > maxAmountToken || amountOfTokens === 0}
                      className={styles.saveBtn}
                      onClick={onPressBuy}
                    >Buy for {getTotalPriceString(true)} eth</Button>
                </div>
            </Paper>
        </Modal>
        );
    }