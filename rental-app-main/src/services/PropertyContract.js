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
      console.log(propertyData);
      const tx = await this.contract.connect(this.signer).setProperty(
        propertyData.name,
        propertyData.shareholders,
        propertyData.percentage,
        propertyData.price,
        propertyData.owner,
        { from: fromAddress } // Specify the "from" address here
      );

      // Wait for the transaction to be mined
      await tx.wait().then((result) => {
        console.log(result);
      });

      return true; // Success
    } catch (error) {
      console.error('Error creating property:', error);
      console.log(error);
      return false; // Failed
    }
  }
  async payToProperty(propertyId, amount, fromAddress) {
    try {
      console.log('amount', amount);
      const tx = await this.contract.paytoProperty(propertyId, {
        value: ethers.utils.parseEther(amount.toString()),
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
  async getMyProperty(ownerAddress) {
    try {
      // Call the getMyProperty function on your contract
      const myProperties = await this.contract.getMyProperty({
        from: ownerAddress,
      });
      console.log(myProperties);
      return myProperties; // Array of properties owned by the address
    } catch (error) {
      console.error('Error fetching properties:', error);
      return []; // Return an empty array in case of an error
    }
  }
  //write a function to get the property data by id
  async getPropertyById(propertyId) {
    try {
      // Call the getPropertyById function on your contract
      const property = await this.contract.getpropertydetail(propertyId);
      console.log(property);
      return property; // Return the property data
    } catch (error) {
      console.error('Error fetching property:', error);
      return null; // Return null in case of an error
    }
  }
  //write a function to get balance of the account from the contract getBalance with params as address
  async getBalance(address) {
    try {
      // Call the getBalance function on your contract
      const balance = await this.contract.getBalance(address);
      console.log(balance);
      return balance; // Return the balance
    } catch (error) {
      console.error('Error fetching balance:', error);
      return null; // Return null in case of an error
    }
  }
}

export default PropertyContractService;
