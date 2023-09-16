import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import metamaskimg from '../../assets/metamask.png';
import { DownloadOutlined, LinkOutlined } from '@ant-design/icons';
import { useMetaMask } from 'metamask-react';
import toast from 'react-hot-toast';

const MetamaskModal: React.FC = () => {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    console.log(status);
    if (status === 'notConnected') {
      showModal();
      console.log('triggered');
    }
    if (status === 'connected') {
      toast.success('Wallet Connected Successfully!');
      setOpen(false);
      console.log(account);
      console.log(chainId);
      console.log(ethereum);
    }
  }, [status]);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  return (
    <>
      <Modal
        title='Connect To Metamask'
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[]}
        maskClosable={false}
      >
        <p
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={metamaskimg} width={'50%'} />
          <Button
            type='primary'
            shape='round'
            icon={<LinkOutlined />}
            size={'large'}
            onClick={connect}
          >
            Connect
          </Button>
        </p>
      </Modal>
    </>
  );
};

export default MetamaskModal;
