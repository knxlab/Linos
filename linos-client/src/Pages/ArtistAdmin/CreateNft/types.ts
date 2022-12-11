export enum NftCreateStep {
    'General',
    'AddingImages',
    'Create'
}

export enum NFTTypes {
  DROP,
  SELL
}
export type NFTConfig = {
  type: NFTTypes;
  count: number;
  nfts: Array<{
    name?: string;
    maxSupply?: number;
    file: File;
  }>
}