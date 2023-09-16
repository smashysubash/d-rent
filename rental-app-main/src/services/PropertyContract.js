import { ethers } from 'ethers'; // Import ethers library
import PropertyContract from '../artifacts/contracts/Property.sol/Property.json'; // Import your contract ABI

class PropertyContractService {
  constructor(provider, contractAddress) {
    this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    this.signer = provider.getSigner();
    this.contract = new ethers.Contract(
      contractAddress,
      PropertyContract.abi,
      this.signer
    );
  }

  async createProperty(propertyData, fromAddress) {
    try {
      // Call the setProperty function on your contract with the "from" address
      const tx = await this.contract.connect(this.signer).setProperty(
        propertyData.pid,
        propertyData.shareholders,
        propertyData.percentage,
        propertyData.price,
        propertyData.owner,
        { from: fromAddress } // Specify the "from" address here
      );

      // Wait for the transaction to be mined
      await tx.wait();

      return true; // Success
    } catch (error) {
      console.error('Error creating property:', error);
      console.log(error);
      return false; // Failed
    }
  }
  async payToProperty(propertyId, amount, fromAddress) {
    try {
      // Convert the amount to Wei if it's not already in Wei
      const amountInWei = ethers.utils.parseEther(amount.toString());

      // Call the payToProperty function on your contract with the specified parameters
      const tx = await this.contract.paytoProperty(propertyId, {
        value: amountInWei, // Send the specified amount as value (in Wei)
        from: fromAddress, // Specify the "from" address here
      });

      // Wait for the transaction to be mined
      await tx.wait();

      return true; // Success
    } catch (error) {
      console.error('Error paying to property:', error);
      console.log(error);
      return false; // Failed
    }
  }
  async withdraw(propertyId, fromAddress) {
    try {
      // Call the withdraw function on your contract with the specified parameters
      const tx = await this.contract.connect(this.signer).withdraw(propertyId, {
        from: fromAddress, // Specify the "from" address here
      });

      // Wait for the transaction to be mined
      await tx.wait();

      return true; // Success
    } catch (error) {
      console.error('Error withdrawing funds from property:', error);
      console.log(error);
      return false; // Failed
    }
  }
}

export default PropertyContractService;
