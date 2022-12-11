// https://ipfs.io/api/v0/object/stat?arg=bafybeidvazcobnlrezfexuxa4ottqi5dczsudrnowvsedjeod7oztimse4
import axios from 'axios';

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNmM0ZjY5MC1kNGMxLTQzMDAtOGFhNC1lOTRhZWM0YjUwYWQiLCJlbWFpbCI6ImRhdmlkQGtueC1sYWIuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijc4NDY3MjZjNWM3NDNiZjk4MDZlIiwic2NvcGVkS2V5U2VjcmV0IjoiOTMzMmE5NTVjYmY3M2FmMTdhZjI1ODYzYjg0YTQ1MWFjMzFmZWE0Njk4ZThiYjczNjg4YzFhOTU4MmY0YTEzMyIsImlhdCI6MTY3MDQ0MzM3NH0.fqkvcxTPwm9SimophKvn5PbPKjvZQcelWnc_ZU3dmoM";

const STATUS_CHECKER_URL = "https://ipfs.io/api/v0/object/stat?arg=";


export async function pinCidToPinata(cid: string) {

  var data = JSON.stringify({
    "hashToPin": cid,
    "pinataMetadata": {
      "name": "Linos - " + cid
    }
  });

  var config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinByHash',
    headers: {
      'Authorization': 'Bearer ' + JWT,
      'Content-Type': 'application/json'
    },
    data: data
  };

  return await axios(config);
}

export async function pinStatusChecker(cid: string) {
  return await axios({
    method: 'get',
    url: "https://api.pinata.cloud/pinning/pinJobs",
    data: JSON.stringify({
      ipfs_pin_hash: cid
    }),
    headers: {
      'Authorization': 'Bearer ' + JWT,
      'Content-Type': 'application/json'
    }
  })
}