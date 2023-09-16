import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout';
import MetamaskModal from '../modal';
import CreateProperty from '../createProperty';
import PayToProperty from '../paytoproperty';
import { getContractBalance } from '../../services/contractbalance';
import WithdrawProperty from '../withdrawproperty';

export const Dashboard = () => {
  const [balance, setbalance] = useState('loading...');

  useEffect(() => {
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    getContractBalance(contractAddress)
      .then((balance) => {
        setbalance(balance);
        console.log(`Contract balance: ${balance} ETH`);
      })
      .catch((error) => {
        setbalance('error fetching balance');
        console.error('Error fetching contract balance:', error);
      });
  }, []);

  return (
    <>
      <MetamaskModal />
      <DefaultLayout>
        <div>Dashboard</div>
        <div className='p-3'>contract balance: {balance}</div>
        <hr></hr>
        <div className='p-3'>
          <CreateProperty />
        </div>
        <hr></hr>
        <div className='p-3'>
          <PayToProperty />
        </div>
        <hr></hr>{' '}
        <div className='p-3'>
          <WithdrawProperty />
        </div>
        <hr></hr>
      </DefaultLayout>
    </>
  );
};
