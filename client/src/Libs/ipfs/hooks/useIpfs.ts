import { create, IPFS } from 'ipfs-core'
import { useState } from 'react'

let ipfs: IPFS | null = null;

export default function useIpfs() {
  const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs))
  const [ipfsInitError, setIpfsInitError] = useState(null)

  async function init() {
    try {
        console.time('IPFS Started')
        ipfs = await create();
        console.timeEnd('IPFS Started');
        setIpfsReady(Boolean(ipfs))
      } catch (error: any) {
        console.error('IPFS init error:', error)
        ipfs = null
        setIpfsInitError(error);
      }
  }

  return { ipfs, isIpfsReady, ipfsInitError, init }
}
