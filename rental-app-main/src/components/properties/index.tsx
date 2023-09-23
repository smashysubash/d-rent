import React, { useState } from 'react';
import DefaultLayout from '../layout';
import ShowAllProperties from '../showallproperty';
import { Modal } from 'antd';
import CreateProperty from '../createProperty';

export const Properties = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
    window.location.reload();
  };
  const addpropertyclick = () => {
    console.log('add property clicked');
    setOpen(true);
  };
  return (
    <DefaultLayout>
      <ShowAllProperties addpropertyclick={addpropertyclick} />
      <Modal
        title='Create Property'
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={780}
        footer={null}
      >
        <CreateProperty onSuccess={handleCancel} />
      </Modal>
    </DefaultLayout>
  );
};
