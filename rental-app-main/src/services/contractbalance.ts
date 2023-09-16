import { ethers } from 'ethers';

export async function getContractBalance(contractAddress: string) {
  const provider = new ethers.providers.JsonRpcProvider(); // Replace with your provider
  const balance = await provider.getBalance(contractAddress);
  return ethers.utils.formatEther(balance);
}
