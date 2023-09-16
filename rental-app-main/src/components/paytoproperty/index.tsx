import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { useMetaMask } from 'metamask-react';
import toast from 'react-hot-toast';
import PropertyContractService from '../../services/PropertyContract'; // Import your contract service
import { ethers } from 'ethers';

const PayToProperty: React.FC = () => {
  const { status, account, ethereum } = useMetaMask();
  const [propertyId, setPropertyId] = useState<number>(0);
  const [paymentAmount, setPaymentAmount] = useState<string>('0');
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

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentAmount(event.target.value);
  };

  const payToProperty = async () => {
    if (!propertyContractService) {
      console.error('PropertyContractService not initialized');
      return;
    }

    try {
      console.log(propertyId, paymentAmount, account);
      const success = await propertyContractService.payToProperty(
        propertyId,
        paymentAmount,
        account
      );

      if (success) {
        toast.success(
          `Paid ${paymentAmount} ETH to Property ID: ${propertyId}`
        );
      } else {
        toast.error('Payment failed');
      }
    } catch (error) {
      console.error('Error paying to property:', error);
      toast.error('Payment failed');
    }
  };

  return (
    <div>
      <h1>Pay to Property</h1>
      <div>
        <label>Property ID:</label>
        <Input
          type='number'
          value={propertyId}
          onChange={(e) => setPropertyId(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Payment Amount (ETH):</label>
        <Input
          type='number'
          value={paymentAmount}
          onChange={handlePaymentChange}
        />
      </div>
      <Button type='primary' onClick={payToProperty}>
        Pay
      </Button>
    </div>
  );
};

export default PayToProperty;
