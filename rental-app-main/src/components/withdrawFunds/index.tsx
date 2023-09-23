import React, { useState, useEffect } from 'react';
import { Button, Input, Image } from 'antd';
import { useMetaMask } from 'metamask-react';
import toast from 'react-hot-toast';
import PropertyContractService from '../../services/PropertyContract'; // Import your contract service
import { ethers } from 'ethers';
import DefaultLayout from '../layout';
import propimage from '../../assets/property.jpg';

const WithdrawFunds: React.FC = () => {
  const { status, account, ethereum } = useMetaMask();
  const [propertyId, setPropertyId] = useState<number | null>(0);
  const [property, setProperty] = useState<property | null>(null); // Define your property structure
  const [propertyContractService, setPropertyContractService] =
    useState<PropertyContractService | null>(null);

  useEffect(() => {
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

  const getPropertyDetails = async () => {
    try {
      const propertyDetails = await propertyContractService.getPropertyById(
        propertyId
      );

      if (propertyDetails) {
        setProperty(propertyDetails);
      } else {
        toast.error('Property not found');
        setProperty(null);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  };

  const handleWithdrawFunds = async () => {
    try {
      const success = await propertyContractService.withdraw(
        propertyId,
        account
      );

      if (success) {
        toast.success(`Funds withdrawn from Property ID: ${propertyId}`);
      } else {
        toast.error('Withdrawal failed');
      }
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      toast.error('Withdrawal failed');
    }
  };

  return (
    <DefaultLayout>
      <div className='p-3'>
        <h1>Withdraw Funds</h1>
        <div>
          <label>Property ID:</label>
          <input
            required
            type='number'
            value={propertyId}
            onChange={(e) => setPropertyId(parseInt(e.target.value))}
          />
          <Button type='primary' onClick={getPropertyDetails}>
            Get Property Details
          </Button>
        </div>
        {property && (
          <div className='p-3'>
            <h2>Property Details</h2>
            <div className='d-flex p-3'>
              <div>
                <Image
                  style={{ borderRadius: '10px' }}
                  src={propimage}
                  alt='property'
                  width={200}
                  height={200}
                />
              </div>
              <div className='p-3'>
                <h6>Propert Name: {property?.name}</h6>
                <h6>
                  Amount Received:{' '}
                  {ethers.utils.formatUnits(property?.received, 'ether')}
                </h6>
                <Button type='primary' onClick={handleWithdrawFunds}>
                  Withdraw Funds
                </Button>
              </div>
            </div>
            {/* Use your PropertyDetails component */}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default WithdrawFunds;
