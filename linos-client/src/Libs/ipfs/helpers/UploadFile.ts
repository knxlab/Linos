import { IPFS } from 'ipfs-core';
import { AddResult } from 'ipfs-core-types/dist/src/root';
import { Buffer } from 'buffer';

export default function uploadFileToIpfs({ ipfs, file } : { ipfs: IPFS; file: File }): Promise<AddResult> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = async function() {
            if (reader.result instanceof ArrayBuffer) {
                console.log("FILE HAS BEEN READ AND IS ARRAY BUFFER");
                const fileBuffer = Buffer.from(reader.result);
                const result = await ipfs.add(fileBuffer)
                console.log("IPFS RESULT ", result);
                resolve(result);
            } else {
                reject(new Error("File is not a buffer"))
            }
        }
        reader.readAsArrayBuffer(file);
    })
}