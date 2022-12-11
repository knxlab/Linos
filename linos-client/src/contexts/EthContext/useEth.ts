import { useContext } from "react";
// @ts-ignore
import EthContext from "./EthContext";

const useEth = () => useContext(EthContext);

export default useEth;
