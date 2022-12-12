import * as React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Paper, TextField } from '@mui/material';
import styles from './styles.module.css';
import { useSnackbar } from 'notistack';
import useCurrentAccount from '../../../../hooks/useCurrentAccount';
import { useLinosContext } from '../../../../contexts/Linos/Context';
import Title from '../../../../Layout/Title';

import NftArtifact from '../../../../contracts/ArtistERC1155Token.json';
import useEth from '../../../../contexts/EthContext/useEth';

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

export default function SellModal({
    open = false,
    handleClose = () => {},
    onListingCreated = async () => null,

    userBalance,
    tokenAddress,
    tokenId,
}: {
    open: boolean;
    handleClose: () => any;
    onListingCreated?: () => Promise<any>;

    userBalance: number;
    tokenAddress: string;
    tokenId: number;
}) {

    const { state: { web3 }} = useEth();

    const [amountOfTokens, setAmountOfToken] = React.useState<number>(1);
    const [pricePerToken, setPricePerToken] = React.useState<string>("1");

    const [loading, setLoading] = React.useState(false);
    const { linosNftMarketPlaceContract, linosNftMarketPlaceAddress } = useLinosContext();
    const account = useCurrentAccount();
    const { enqueueSnackbar } = useSnackbar();

    const onPressSave = async () => {
        if (!linosNftMarketPlaceContract) {
            alert("An error has occured, no VotingFactory available");
            return;
        }
        try {
            setLoading(true);
            console.log("linosNftMarketPlaceContract.address", linosNftMarketPlaceAddress);
            const tokenContract = new web3.eth.Contract(NftArtifact.abi, tokenAddress);
            const isApproved = await tokenContract.methods.isApprovedForAll(account, linosNftMarketPlaceAddress).call();
            if (!isApproved) {
              try {
                const approve = await tokenContract.methods.setApprovalForAll(linosNftMarketPlaceAddress, true).send({ from: account });
                if (!approve || !approve.status) {
                  throw new Error("Not approved")
                }
              } catch (e) {
                setLoading(false);
                return;
              }
            }

            const method = linosNftMarketPlaceContract.methods.listItems(
              tokenAddress, tokenId,
              amountOfTokens,
              web3.utils.toWei(String(parseFloat(pricePerToken || "0")), "ether"),
            );
            await method.call({ from: account });
            await method.send({ from: account });
            await onListingCreated();
            setLoading(false);
            enqueueSnackbar("Listing created !", { variant: "success" });
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
                    Create a new Listing
                </Title>
                <div>
                  <div>
                    <TextField
                      label="How many Tokens?"
                      placeholder={'How many tokens (max :' + userBalance + ")"} fullWidth variant="outlined" disabled={loading}
                      value={amountOfTokens || ""}
                      onChange={e => {
                        const amount = parseInt(e.target.value, 10) || 0;
                        setAmountOfToken(Math.min(userBalance, amount))
                      }}
                    />
                  </div>

                  <div>
                    <TextField
                      style={{marginTop: '20px'}}
                      label="Price per token"
                      placeholder='Price per token' fullWidth variant="outlined" disabled={loading}
                      value={pricePerToken || ""}
                      onChange={e => {
                        let withComma = false;
                        if (e.target.value.endsWith(",") || e.target.value.endsWith(".")) {
                          withComma = true;
                        }
                        const amount = parseFloat(e.target.value) || 0;
                        setPricePerToken((String(amount) + (withComma ? "." : "")));
                      }}
                    />
                  </div>

                </div>
                <div className={styles.modalActions}>
                    {!loading && <Button variant='outlined' color='secondary' onClick={handleClose}>Cancel</Button>}
                    <Button
                      variant='contained'
                      color='primary'
                      disabled={loading || amountOfTokens > userBalance || amountOfTokens === 0 || pricePerToken === "" || parseFloat(pricePerToken) === 0}
                      className={styles.saveBtn}
                      onClick={onPressSave}
                    >Sell tokens</Button>
                </div>
            </Paper>
        </Modal>
        );
    }