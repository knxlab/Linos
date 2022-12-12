import { useEffect, useState } from "react";
import { ARTIST } from "./useArtist";
import useCurrentAccount from "./useCurrentAccount";


export type USER = {
  name: string;
  isRegistered: boolean;
}

const DefaultArtist: ARTIST = {
  name: "",
  isRegistered: false,
  isValid: false,
  fanTokenAddress: ""
};

const DefaultUser: USER = {
  name: "",
  isRegistered: false,
};

export type CURRENT_USER_DATA = {
  user: USER,
  artist: ARTIST,
  isUser: boolean;
  isArtist: boolean;
  refetch: () => Promise<any>;
}

export const DefaultCurrentUserValue: CURRENT_USER_DATA = {
  isArtist: false, isUser: false,
  artist: DefaultArtist,
  user: DefaultUser,
  refetch: async () => {}
}

export default function useCurrentUser({
  linosContract
}: {
  linosContract: any
}): CURRENT_USER_DATA {
    const [artist, setArtist] = useState<ARTIST>(DefaultArtist);
    const [user, setUser] = useState<USER>(DefaultUser);

    const account = useCurrentAccount();

    const loadUser = async () => {
        try {
            const artist = await linosContract.methods.getArtist(account).call({ from: account });
            setArtist({
              name: artist.name,
              isRegistered: artist.isRegistered,
              isValid: artist.isValid,
              fanTokenAddress: artist.fanTokenAddress
            })
        } catch (e) {
            console.log("Normal error due to getVoter try");
            setArtist(DefaultArtist);
        }

        try {
            const user = await linosContract.methods.getUser(account).call({ from: account });
            setUser({
              name: user.name,
              isRegistered: user.isRegistered,
            })
        } catch (e) {
            console.log("Normal error due to getVoter try")
            setUser(DefaultUser);
        }
    }

    useEffect(() => {
      if (account && linosContract) {
        loadUser();
      }
    // eslint-disable-next-line
    }, [linosContract, account]);

    return {artist, user, isUser: user.isRegistered, isArtist: artist.isRegistered, refetch: loadUser};
}