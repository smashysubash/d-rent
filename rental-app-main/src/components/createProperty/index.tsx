import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useMetaMask } from 'metamask-react';
import toast from 'react-hot-toast';
import MetamaskModal from '../modal';
import PropertyContractService from '../../services/PropertyContract';
import { ethers } from 'ethers';

const CreateProperty: React.FC = () => {
  const { status, account, ethereum } = useMetaMask();
  const [propertyId, setPropertyId] = useState<number>(0);
  const [propertyContractService, setPropertyContractService] =
    useState<PropertyContractService | null>(null);

  useEffect(() => {
    console.log(import.meta.env.VITE_CONTRACT_ADDRESS);
    if (status === 'connected' && ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; // Replace with your actual contract address
      const propertyService = new PropertyContractService(
        provider,
        contractAddress
      );
      setPropertyContractService(propertyService);
    }
  }, [status, ethereum]);

  const createNewProperty = async () => {
    if (!propertyContractService) {
      console.error('PropertyContractService not initialized');
      return;
    }

    const propertyData = {
      pid: propertyId, // Property ID
      shareholders: [
        account,
        '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
        '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
      ], // Array of shareholder addresses
      percentage: [50, 25, 25], // Array of ownership percentages
      price: ethers.utils.parseEther('1'), // Property price in wei (1 ETH in wei)
      owner: account, // Owner is the connected MetaMask account
    };
    console.log(propertyData);
    const success = await propertyContractService.createProperty(
      propertyData,
      account
    );

    if (success) {
      // Property created successfully
      toast.success('Property created successfully');
    }
  };

  return (
    <div>
      <>
        <h1>Create a New Property</h1>
        <div>
          <label>Property ID:</label>
          <input
            type='number'
            value={propertyId}
            onChange={(e) => setPropertyId(parseInt(e.target.value))}
          />
        </div>
        <button onClick={createNewProperty}>Create Property</button>
      </>
    </div>
  );
};

export default CreateProperty;
