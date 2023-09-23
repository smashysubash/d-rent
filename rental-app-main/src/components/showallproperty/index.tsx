// import React, { useState, useEffect } from 'react';
// import { useMetaMask } from 'metamask-react';
// import PropertyContractService from '../../services/PropertyContract'; // Import your PropertyContractService
// import { ethers } from 'ethers';

// const ShowAllProperties: React.FC = () => {
//   const { status, account, ethereum } = useMetaMask();
//   const [propertyContractService, setPropertyContractService] =
//     useState<PropertyContractService | null>(null);
//   const [myProperties, setMyProperties] = useState<any[]>([]); // Adjust the type according to your property structure

//   useEffect(() => {
//     if (status === 'connected' && ethereum) {
//       const provider = new ethers.providers.Web3Provider(ethereum); // Use ethers provider
//       const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; // Replace with your actual contract address
//       const propertyService = new PropertyContractService(
//         provider,
//         contractAddress
//       );
//       setPropertyContractService(propertyService);
//     }
//   }, [status, ethereum]);

//   useEffect(() => {
//     async function fetchMyProperties() {
//       if (propertyContractService) {
//         try {
//           // Call the getMyProperty function on your contract service
//           const myProps = await propertyContractService.getMyProperty(account);

//           const formattedProps = myProps.map((property: any) => ({
//             ...property,
//             price: property.price._hex, // Assuming owner is an Ethereum address object
//           }));

//           setMyProperties(formattedProps);
//         } catch (error) {
//           console.error('Error fetching properties:', error);
//         }
//       }
//     }

//     if (account) {
//       fetchMyProperties();
//     }
//   }, [propertyContractService, account]);

//   return (
//     <div>
//       <h1>My Properties</h1>
//       <ul>
//         {myProperties.map((property, index) => (
//           <li key={index}>
//             Property ID: {property.pid}, Owner: {property.owner}, Price:
//             {parseInt(property.price, 16)}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ShowAllProperties;

import React, { useState, useEffect } from 'react';
import { useMetaMask } from 'metamask-react';
import PropertyContractService from '../../services/PropertyContract';
import { ethers } from 'ethers';
import { Button, Card, Empty } from 'antd';
import propimage from '../../assets/property.jpg';

const ShowAllProperties: React.FC = ({
  addpropertyclick,
  reload,
}: {
  addpropertyclick: () => void;
}) => {
  const { status, account, ethereum } = useMetaMask();
  const [propertyContractService, setPropertyContractService] =
    useState<PropertyContractService | null>(null);
  const [myProperties, setMyProperties] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'connected' && ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      const propertyService = new PropertyContractService(
        provider,
        contractAddress
      );
      setPropertyContractService(propertyService);
    }
  }, [status, ethereum]);

  useEffect(() => {
    async function fetchMyProperties() {
      if (propertyContractService) {
        try {
          const myProps = await propertyContractService.getMyProperty(account);

          const formattedProps = myProps.map((property: any) => ({
            ...property,
            price: parseInt(property.price._hex, 16),
            received: parseInt(property.received._hex, 16),
          }));
          console.log(formattedProps);
          setMyProperties(formattedProps);
        } catch (error) {
          console.error('Error fetching properties:', error);
        }
      }
    }

    if (account) {
      fetchMyProperties();
    }
  }, [propertyContractService, account]);

  return (
    <div>
      <h1>My Properties</h1>
      <div className='d-flex justify-content-end '>
        <Button
          type='primary'
          size={'large'}
          onClick={() => addpropertyclick()}
        >
          Add Property
        </Button>
      </div>
      {myProperties.length === 0 ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '60vh',
          }}
        >
          <Empty />;
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {myProperties.map((property, index) => (
            <Card
              key={index}
              hoverable
              style={{ width: 250, margin: '10px' }}
              cover={<img alt='property' src={propimage} />}
            >
              <h5
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {property.name}
              </h5>
              <h5>Property ID: {property.pid}</h5>
              <p>Price: {parseInt(property.price, 16)} ETH</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowAllProperties;
