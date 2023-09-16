import React, { useEffect, useState } from 'react';
import { useMetaMask } from 'metamask-react';
import PropertyContractService from '../../services/PropertyContract'; // Import your contract service
import { ethers } from 'ethers';

const WithdrawProperty = () => {
  const { status, account, ethereum } = useMetaMask();
  const [propertyId, setPropertyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
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

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      if (!propertyId) {
        alert('Please enter a valid property ID.');
        return;
      }
      // Call the withdraw function
      const success = await propertyContractService.withdraw(
        propertyId,
        account
      );

      if (success) {
        setWithdrawn(true);
      } else {
        alert(
          'Withdrawal failed. Please check the property ID or try again later.'
        );
      }
    } catch (error) {
      console.error('Error withdrawing from property:', error);
      alert('An error occurred while withdrawing. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Withdraw from Property</h2>
      <label>Property ID:</label>
      <input
        type='text'
        value={propertyId}
        onChange={(e) => setPropertyId(e.target.value)}
      />
      <button onClick={handleWithdraw} disabled={loading || withdrawn}>
        Withdraw
      </button>
      {withdrawn && <p>Withdrawn successfully!</p>}
    </div>
  );
};

export default WithdrawProperty;
