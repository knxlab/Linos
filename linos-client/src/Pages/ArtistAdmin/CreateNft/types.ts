export enum NftCreateStep {
    'General',
    'AddingImages',
    'Create'
}

export enum NFTTypes {
  SELL,
  DROP
}
export type NFTConfig = {
  collectionName: string;
  type: NFTTypes;
  count: number;
  nfts: Array<{
    name?: string;
    maxSupply?: number;
    file: File;
  }>
}