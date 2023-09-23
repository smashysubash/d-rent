// import React, { useState, useEffect } from 'react';
// import { Button, Input } from 'antd';
// import { useMetaMask } from 'metamask-react';
// import toast from 'react-hot-toast';
// import PropertyContractService from '../../services/PropertyContract'; // Import your contract service
// import { ethers } from 'ethers';

// const PayToProperty: React.FC = () => {
//   const { status, account, ethereum } = useMetaMask();
//   const [propertyId, setPropertyId] = useState<number>(0);
//   const [paymentAmount, setPaymentAmount] = useState<string>('0');
//   const [propertyContractService, setPropertyContractService] =
//     useState<PropertyContractService | null>(null);

//   useEffect(() => {
//     if (status === 'connected' && ethereum) {
//       const provider = new ethers.providers.Web3Provider(ethereum);
//       const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; // Replace with your actual contract address
//       const propertyService = new PropertyContractService(
//         provider,
//         contractAddress
//       );
//       setPropertyContractService(propertyService);
//     }
//   }, [status, ethereum]);

//   const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPaymentAmount(event.target.value);
//   };

//   const payToProperty = async () => {
//     if (!propertyContractService) {
//       console.error('PropertyContractService not initialized');
//       return;
//     }

//     try {
//       console.log(propertyId, paymentAmount, account);
//       const success = await propertyContractService.payToProperty(
//         propertyId,
//         paymentAmount,
//         account
//       );

//       if (success) {
//         toast.success(
//           `Paid ${paymentAmount} ETH to Property ID: ${propertyId}`
//         );
//       } else {
//         toast.error('Payment failed');
//       }
//     } catch (error) {
//       console.error('Error paying to property:', error);
//       toast.error('Payment failed');
//     }
//   };

//   return (
//     <div>
//       <h1>Pay to Property</h1>
//       <div>
//         <label>Property ID:</label>
//         <Input
//           type='number'
//           value={propertyId}
//           onChange={(e) => setPropertyId(parseInt(e.target.value))}
//         />
//       </div>
//       <div>
//         <label>Payment Amount (ETH):</label>
//         <Input
//           type='number'
//           value={paymentAmount}
//           onChange={handlePaymentChange}
//         />
//       </div>
//       <Button type='primary' onClick={payToProperty}>
//         Pay
//       </Button>
//     </div>
//   );
// };

// export default PayToProperty;

import React, { useState, useEffect } from 'react';
import { useMetaMask } from 'metamask-react';
import PropertyContractService from '../../services/PropertyContract';
import { ethers } from 'ethers';
import { Button, Image } from 'antd';

import propimage from '../../assets/property.jpg';
import toast from 'react-hot-toast';

const PayRent = () => {
  const { status, account, ethereum } = useMetaMask();
  const [propertyId, setPropertyId] = useState(0);
  const [property, setProperty] = useState(null);
  const [amount, setAmount] = useState(0);
  const [propertyContractService, setPropertyContractService] =
    useState<PropertyContractService | null>(null);
  console.log(propertyId);
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
    if (propertyContractService) {
      try {
        const propertyDetails = await propertyContractService.getPropertyById(
          propertyId
        );

        if (propertyDetails) {
          setProperty(propertyDetails);
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    }
  };

  const handlePayRent = async () => {
    console.log('amount', property?.price);
    try {
      const success = await propertyContractService.payToProperty(
        propertyId,
        parseInt(property?.price, 16),
        account
      );

      if (success) {
        // Payment successful
        // You can add additional logic or UI updates here
        console.log('Payment successful');
        toast.success('Payment successful');
      }
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };
  console.log(property?.price);
  return (
    <div>
      <h1>Pay Rent</h1>
      <div className='p-3'>
        <label>Property ID:</label>
        <input
          type='number'
          value={propertyId}
          onChange={(e) => setPropertyId(parseInt(e.target.value))}
        />
        <div className='p-2'>
          <Button type='primary' onClick={getPropertyDetails}>
            Get Property Details
          </Button>
        </div>
      </div>
      {property && (
        <div className='p-3'>
          <h2>Property Details</h2>
          <div className='d-flex '>
            <div className='p-3'>
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
              <label>Amount to Pay (in ETH):</label>
              <input
                type='number'
                value={parseInt(property?.price, 16)}
                disabled
              />
              <div className='p-2'>
                <Button type='primary' onClick={handlePayRent}>
                  Pay Rent
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayRent;
