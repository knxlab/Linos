// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


interface LinosPlatformInterface {
  struct Track {
    // address contractAddress;
    string name;
    string coverUri;
  }

  struct Artist {
    string name;
    address fanTokenAddress;
    bool isRegistered;
    bool isValid;
  }

  struct User {
    string name;
    bool isRegistered;
  }

  function getArtist(address artistAddress) external view returns(Artist memory);
  function isArtistValid(address artistAddress) external view returns(bool);
}