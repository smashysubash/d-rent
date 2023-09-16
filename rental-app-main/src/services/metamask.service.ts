import { ethers } from 'ethers';

export const connectWithMetamask = (
  connect: (arg0: typeof ethers.providers.Web3Provider, arg1: string) => any,
  metaState: { isConnected: any }
) => {
  if (!metaState.isConnected) {
    (async () => {
      try {
        await connect(ethers.providers.Web3Provider, 'any');
      } catch (error) {
        console.log(error);
      }
    })();
  }
};
