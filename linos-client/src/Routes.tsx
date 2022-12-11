import {
  createBrowserRouter,
  RouterProvider,
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

const routerUnlogged = createBrowserRouter([
  {
    path: "/",
    element: <LoginRegister /> ,
  }
]);

const routesMarketplace = {
  path: "/marketplace",
  element: <MarketPlace />,
  children: [
    {
      path: "all",
      element: <AllNfts />
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


const routerArtist = createBrowserRouter([
  {
    path: "/",
    element: <ChooseApp /> ,
  },
  routesMarketplace,
  {
    path: "/artist-admin",
    element: <ArtistAdmin />,
    children: [
      {
        path: "create-nft",
        element: <CreateNft />
      }
    ]
  }
]);

const routerUser = createBrowserRouter([
  {
    path: "/",
    element: <ChooseAppUser /> ,
  },
  routesMarketplace
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