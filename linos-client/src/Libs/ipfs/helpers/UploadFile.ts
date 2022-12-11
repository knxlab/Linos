import { IPFS } from 'ipfs-core';
import { AddResult } from 'ipfs-core-types/dist/src/root';
import { Buffer } from 'buffer';

function readFile(file: File): Promise<Buffer> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = async function() {
            console.log("FILE HAS BEEN READ");
            const fileBuffer = Buffer.from(reader.result as ArrayBuffer);
            resolve(fileBuffer);
        }
        reader.readAsArrayBuffer(file);
    })
}


export async function uploadJsonsToIpfs({ ipfs, jsons, onProgress } : { ipfs: IPFS; jsons: Array<any>; onProgress: (val: number) => any; }): Promise<any | AddResult> {
    let dir;


    for await (const result of ipfs.addAll(jsons.map((json, i) => ({
        content: JSON.stringify(json),
        path: '/linos/' + i,
    })), {
        pin: true,
        progress: () => {
            onProgress(10);
        },
        cidVersion: 1,
        wrapWithDirectory: true
    })) {
        if (result.path === "") {
            dir = result;
        }
    }

    return dir;
}


export default async function uploadFilesToIpfs({ ipfs, files, onProgress } : { ipfs: IPFS; files: Array<File>; onProgress: (val: number) => any; }): Promise<any | AddResult> {
    const fileBuffers = await Promise.all(files.map(readFile));
    let dir;

    let totalBytes = 0;
    for (let index = 0; index < fileBuffers.length; index++) {
        const fileBuffer = fileBuffers[index];
        totalBytes += fileBuffer.byteLength;
    }

    for await (const result of ipfs.addAll(fileBuffers.map((fileBuffer, i) => ({
        content: fileBuffer,
        path: '/linos/' + i,
    })), {
        pin: true,
        progress: (bytesLoaded) => {
            onProgress(bytesLoaded/totalBytes);
        },
        cidVersion: 1,
        wrapWithDirectory: true
    })) {
        if (result.path === "") {
            dir = result;
        }
    }

    return dir;
}