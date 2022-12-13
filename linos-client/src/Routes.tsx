import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import ChooseApp from "./Pages/ChooseApp";
import ArtistAdmin from "./Pages/ArtistAdmin";
import MarketPlace from "./Pages/MarketPlace";
import CreateNft from "./Pages/ArtistAdmin/CreateNft";
import { useLinosContext } from "./contexts/Linos/Context";
import ChooseAppUser from "./Pages/ChooseAppUser";
import LoginRegister from "./Pages/LoginRegister";
import AllNfts from "./Pages/MarketPlace/AllNfts";
import YourListings from "./Pages/MarketPlace/YourListings";
import MarketPlaceNftPage from "./Pages/MarketPlace/NftPage";
import MarketPlaceNftTokenPage from "./Pages/MarketPlace/NftTokenPage";
import ArtistPage from "./Pages/MarketPlace/ArtistPage";
import { useEffect } from "react";


const Soon = () => {
  return (<div>Soon..</div>)
}



const routesStreaming = {
  path: "/streaming",
  element: <Soon />,

}
const routesMarketplace = {
  path: "/marketplace",
  element: <MarketPlace />,
  children: [
    {
      path: "all",
      element: <AllNfts />
    },
    {
      path: "artist/:artistAddress",
      element: <ArtistPage />
    },
    {
      path: 'nft/:nftAddress/:tokenId',
      element: <MarketPlaceNftTokenPage />
    },
    {
      path: 'nft/:nftAddress',
      element: <MarketPlaceNftPage />,
    },
    {
      path: "your-listings",
      element: <YourListings />
    }
  ]
};

const RedirectRoot = () => {
  const navigate  = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [])
  return (
    null
  )
}

const routerUnlogged = createBrowserRouter([
  {
    path: "/",
    element: <LoginRegister />,
    errorElement: <RedirectRoot />
  },
]);



const routerArtist = createBrowserRouter([
  {
    path: "/",
    element: <ChooseApp /> ,
  },
  routesMarketplace,
  routesStreaming,
  {
    path: "/artist-admin",
    element: <ArtistAdmin />,
    children: [
      {
        path: "create-nft",
        element: <CreateNft />
      },
      {
        path: "create-track",
        element: <Soon />
      }
    ]
  }
]);

const routerUser = createBrowserRouter([
  {
    path: "/",
    element: <ChooseAppUser /> ,
  },
  routesMarketplace,
  routesStreaming
]);

export default function Routes() {

  const { currentUser }  = useLinosContext();

  if (!currentUser.isUser && !currentUser.isArtist) {
    return <RouterProvider router={routerUnlogged} />
  }

  if (currentUser.isArtist) {
    return <RouterProvider router={routerArtist} />;
  } else {
    return <RouterProvider router={routerUser} />;
  }
}