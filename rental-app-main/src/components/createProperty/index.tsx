import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Space } from 'antd';
import { useMetaMask } from 'metamask-react';
import toast from 'react-hot-toast';
import MetamaskModal from '../modal';
import PropertyContractService from '../../services/PropertyContract';
import { ethers } from 'ethers';
import Web3 from 'web3';

const CreateProperty = ({ onSuccess }: { onSuccess: () => void }) => {
  const { status, account, ethereum } = useMetaMask();
  const [propertyData, setPropertyData] = useState({
    name: '',
    shareholders: [], // Initialize to empty array
    percentage: [], // Initialize to empty array
    price: 0,
    owner: '',
  });

  const [shareholderInput, setShareholderInput] = useState('');
  const [percentageInput, setPercentageInput] = useState('');

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
      setPropertyData({
        ...propertyData,
        owner: account,
      });
    }
  }, [status, ethereum]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert the price field to a number if it's the "price" field
    const newValue = name === 'price' ? parseInt(value, 10) : value;

    setPropertyData({
      ...propertyData,
      [name]: newValue,
    });
  };

  const addShareholder = () => {
    if (
      shareholderInput.trim() === '' ||
      isNaN(Number(percentageInput)) ||
      percentageInput < 0 ||
      percentageInput > 100
    ) {
      // Input validation
      return;
    }

    // Convert the percentageInput to a number
    const percentage = Number(percentageInput);

    setPropertyData({
      ...propertyData,
      shareholders: [...propertyData.shareholders, shareholderInput.trim()],
      percentage: [...propertyData.percentage, percentage], // Add the percentage value
    });

    setShareholderInput('');
    setPercentageInput('');
  };

  const removeShareholder = (index) => {
    const updatedShareholders = [...propertyData.shareholders];
    const updatedPercentage = [...propertyData.percentage];

    updatedShareholders.splice(index, 1);
    updatedPercentage.splice(index, 1);

    setPropertyData({
      ...propertyData,
      shareholders: updatedShareholders,
      percentage: updatedPercentage,
    });
  };

  const columns = [
    {
      title: 'Shareholder',
      dataIndex: 'shareholder',
      key: 'shareholder',
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        <Button onClick={() => removeShareholder(index)}>Remove</Button>
      ),
    },
  ];

  const data = propertyData.shareholders.map((shareholder, index) => ({
    key: index,
    shareholder,
    percentage: propertyData.percentage[index],
  }));

  const createNewProperty = async () => {
    if (
      propertyData.shareholders.length === 0 ||
      propertyData.percentage.length === 0
    ) {
      toast.error('Shareholders and percentage arrays cannot be empty');
      throw new Error('Shareholders and percentage arrays cannot be empty');
    }
    if (!propertyContractService) {
      console.error('PropertyContractService not initialized');
      return;
    }
    try {
      // Convert the percentage array to numbers
      const percentage = propertyData.percentage.map(Number);

      const success = await propertyContractService.createProperty(
        {
          ...propertyData,
          price: ethers.BigNumber.from(propertyData.price.toString(16)),
          percentage, // Use the formatted percentage array
        },
        account
      );

      if (success) {
        // Property created successfully
        setPropertyData({
          name: '',
          shareholders: [], // Initialize to empty array
          percentage: [], // Initialize to empty array
          price: 0,
          owner: '',
        });
        onSuccess();
        toast.success('Property created successfully');
      } else {
        toast.error('Error creating property');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Error creating property');
    }
  };

  return (
    <>
      <div>
        <div>
          <label>Name:</label>
          <Input
            name='name'
            value={propertyData.name}
            onChange={handleChange}
          />
        </div>
        <Space>
          <Input
            placeholder='Shareholder'
            value={shareholderInput}
            onChange={(e) => setShareholderInput(e.target.value)}
          />
          <Input
            placeholder='Percentage'
            type='number'
            value={percentageInput}
            onChange={(e) => setPercentageInput(e.target.value)}
          />
          <Button onClick={addShareholder}>Add Shareholder</Button>
        </Space>
        <Table columns={columns} dataSource={data} />
        <div>
          <label>Price:</label>
          <Input
            type='number'
            name='price'
            value={propertyData.price}
            onChange={handleChange}
            max={'150'}
            style={{ maxWidth: '200px' }}
          />
        </div>
        <div className='d-flex justify-content-end'>
          <Button type='primary' onClick={createNewProperty}>
            Create Property
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateProperty;

// import React, { useState, useEffect } from 'react';
// import { Button } from 'antd';
// import { useMetaMask } from 'metamask-react';
// import toast from 'react-hot-toast';
// import MetamaskModal from '../modal';
// import PropertyContractService from '../../services/PropertyContract';
// import { ethers } from 'ethers';

// const CreateProperty = () => {
//   const { status, account, ethereum } = useMetaMask();
//   const [propertyId, setPropertyId] = useState<number>(0);
//   const [propertyContractService, setPropertyContractService] =
//     useState<PropertyContractService | null>(null);

//   useEffect(() => {
//     console.log(import.meta.env.VITE_CONTRACT_ADDRESS);
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

//   const createNewProperty = async () => {
//     if (!propertyContractService) {
//       console.error('PropertyContractService not initialized');
//       return;
//     }

//     const propertyData = {
//       shareholders: [
//         account,
//         '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
//         '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
//       ], // Array of shareholder addresses
//       percentage: [50, 25, 25], // Array of ownership percentage
//       price: 1, // Property price in wei (1 ETH in wei)
//       owner: account, // Owner is the connected MetaMask account
//     };
//     console.log(propertyData);
//     const success = await propertyContractService.createProperty(
//       propertyData,
//       account
//     );

//     if (success) {
//       // Property created successfully
//       toast.success('Property created successfully');
//     }
//   };

//   return (
//     <>
//       <div>
//         <h1>Create a New Property</h1>
//         <div>
//           <label>Property ID:</label>
//           <input
//             type='number'
//             value={propertyId}
//             onChange={(e) => setPropertyId(parseInt(e.target.value))}
//           />
//         </div>
//         <button onClick={createNewProperty}>Create Property</button>
//       </div>
//     </>
//   );
// };

// export default CreateProperty;
