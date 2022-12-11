import React, { useState } from 'react';
import { Button } from "@mui/material";
import BuyModal from './BuyModal';


export default function BuyButton({
    onBought,
    sellId,
    maxAmountToken,
    pricePerToken,
    style
}: {
    onBought?: () => Promise<any>;
    sellId: number;
    maxAmountToken: number;
    pricePerToken: string;
    style: any
}) {

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Button style={style} variant="outlined" onClick={() => setModalOpen(true)}>Buy</Button>
            {modalOpen && <BuyModal
              pricePerToken={pricePerToken}
              maxAmountToken={maxAmountToken}
              sellId={sellId}
              open={modalOpen}
              handleClose={() => setModalOpen(false)}
              onBought={onBought}
            />}
        </>
    )
}