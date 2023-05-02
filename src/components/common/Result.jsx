import React, { Suspense } from 'react';
import parse from 'html-react-parser';
import { Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { DetailModalWrapper } from '.';

const Result = ({ id, title, name, reg, type }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Text key={id} mb="sm" fw={400} onClick={open}>
        {parse((title || name).replace(reg, match => `<b>${match}</b>`))}
      </Text>
      {opened && (
        <Suspense
          fallback={
            <div style={{ position: 'absolute', width: '100px', height: '200px', backgroundColor: '#fff' }}></div>
          }>
          <DetailModalWrapper opened={opened} close={close} id={id} type={type} />
        </Suspense>
      )}
    </>
  );
};

export default Result;
