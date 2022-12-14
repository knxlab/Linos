import { create, IPFS } from 'ipfs-core'
import { useEffect, useState } from 'react'

let ipfs: IPFS | null = null;
let initialized = false;

export default function useIpfs({ autoInit = true } : { autoInit?: boolean } = {}) {
  const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs))
  const [ipfsInitError, setIpfsInitError] = useState(null)

  async function init() {
    if (initialized) {
      setIpfsReady(true);
      return;
    }
    try {
        console.time('IPFS Started')
        ipfs = await create();
        console.timeEnd('IPFS Started');
        setIpfsReady(Boolean(ipfs));
        initialized = Boolean(ipfs);
      } catch (error: any) {
        console.error('IPFS init error:', error)
        ipfs = null
        setIpfsInitError(error);
      }
  }

  useEffect(() => {
    if (autoInit) {
      init();
    }
  }, [autoInit]);

  return { ipfs, isIpfsReady, ipfsInitError, init: autoInit ? () => {} : init }
}
