import React, { useState } from 'react';
import { Button } from "@mui/material";
import SellModal from './SellModal';


export default function SellButton({
    onListingCreated,
    tokenAddress,
    tokenId,
    userBalance,
}: {
    onListingCreated?: () => Promise<any>;
    tokenAddress: string;
    tokenId: number;
    userBalance: number;
}) {

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Button variant="outlined" onClick={() => setModalOpen(true)}>Create Listing</Button>
            {modalOpen && <SellModal
              userBalance={userBalance}
              tokenAddress={tokenAddress}
              tokenId={tokenId}
              open={modalOpen}
              handleClose={() => setModalOpen(false)}
              onListingCreated={onListingCreated}
            />}
        </>
    )
}