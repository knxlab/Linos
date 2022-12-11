

export function formatIpfsUri(uri: string, tokenId: number) {
  let returnUri = uri;
  returnUri = returnUri.replace("{id}", String(tokenId));
  returnUri = returnUri.replace("ipfs://", "https://linos.infura-ipfs.io/ipfs/");

  return returnUri;
}