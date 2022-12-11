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


const routerUnlogged = createBrowserRouter([
  {
    path: "/",
    element: <LoginRegister /> ,
  }
]);

const routesMarketplace = {
  path: "/marketplace",
  element: <MarketPlace />
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