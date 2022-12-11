import { create } from 'ipfs-http-client';
import { IPFS } from 'ipfs-core';
import { useEffect, useState } from 'react'
// @ts-ignore
import base64 from 'base-64';

let ipfs: IPFS | null = null;
let initialized = false;

const projectId = '2IllxHfa01FfX99Xj9i4o5bmeH8';
const projectSecret = '0dd38dca30bc628e2a80f50d3f9ef0d0';
const auth =
    'Basic ' + base64.encode(projectId + ':' + projectSecret);

export default function useIpfs({ autoInit = true } : { autoInit?: boolean } = {}) {
  const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs))
  const [ipfsInitError, setIpfsInitError] = useState(null)

  async function init() {
    if (initialized) {
      setIpfsReady(true);
      return;
    }
    try {
        console.time('IPFS Started');
        // @ts-ignore
        ipfs = create({
          host: 'ipfs.infura.io',
          port: 5001,
          protocol: 'https',
          headers: {
              authorization: auth,
          },
        });
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
