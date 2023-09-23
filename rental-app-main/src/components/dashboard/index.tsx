import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout';
import MetamaskModal from '../modal';
import CreateProperty from '../createProperty';
import PayToProperty from '../paytoproperty';
import { getContractBalance } from '../../services/contractbalance';
import WithdrawProperty from '../withdrawproperty';
import ShowAllProperties from '../showallproperty';
import { Button, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import createprop from '../../assets/cproperty.svg';
import payrent from '../../assets/pay.svg';
import withdraw from '../../assets/split.svg';
//svg related for cretae property from https://www.svgrepo.com/svg/3031/house

export const Dashboard = () => {
  const [balance, setbalance] = useState('loading...');
  const navigate = useNavigate();

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
      <DefaultLayout>
        <div>Dashboard</div>
        <div className='p-3'>contract balance: {balance}</div>
        <hr></hr>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div className='p-3'>
            <Button
              type='primary'
              onClick={() => {
                navigate('/properties');
              }}
              style={{ width: '150px', height: '150px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Image src={createprop} preview={false} width={50} />
                Create Property
              </div>
            </Button>
          </div>
          <div className='p-3'>
            <Button
              type='primary'
              onClick={() => {
                navigate('/rentals');
              }}
              style={{ width: '150px', height: '150px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Image src={payrent} preview={false} width={50} />
                Pay Rent
              </div>
            </Button>
          </div>
          <div className='p-3'>
            <Button
              type='primary'
              onClick={() => {
                navigate('/withdraw');
              }}
              style={{ width: '150px', height: '150px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Image src={withdraw} preview={false} width={50} />
                Withdraw Funds
              </div>
            </Button>
          </div>
          <div className='p-3'>
            <Button
              type='primary'
              onClick={() => {
                navigate('/rentals');
              }}
              style={{ width: '150px', height: '150px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Image src={createprop} preview={false} width={50} />
                Show All Properties
              </div>
            </Button>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};
