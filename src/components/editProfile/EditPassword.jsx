import axios from 'axios';
import React, { useState } from 'react';
import { Container, Title, Flex, Button, Modal, Notification } from '@mantine/core';
import { Password } from '.';
import { useDisclosure } from '@mantine/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signUpSchema } from '../../schema/schema';
import { notifications, Notifications } from '@mantine/notifications';
import { IconX, IconCheck } from '@tabler/icons-react';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atom';

const EditPassword = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const email = useRecoilValue(userState);
  const [nowPw, setNowPw] = useState(null);
  const [newPw, setNewPw] = useState(null);
  const [newConfirmPw, setNewConfirmPw] = useState(null);

  const {
    control,
    trigger,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async data => {
    console.log('data: ', data);

    try {
      const { data: alarm } = await axios.patch('/api/auth/changepw', { email, ...data });

      notifications.show({
        withCloseButton: true,
        autoClose: 3000,
        title: 'Signup Failure',
        message: alarm,
        color: 'green',
        icon: <IconCheck />,
        loading: false,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        notifications.show({
          withCloseButton: true,
          autoClose: 3000,
          title: 'Password Change Failure',
          message: error.response.data,
          color: 'red',
          icon: <IconX />,
          loading: false,
        });
      } else {
        notifications.show({
          withCloseButton: true,
          autoClose: 3000,
          title: 'Signup Failure',
          message: '알 수 없는 오류가 발생했습니다.',
          color: 'red',
          icon: <IconX />,
          loading: false,
        });
      }
    }
  };

  return (
    <Container>
      <Modal opened={opened} centered onClose={close} title="비밀번호 변경" style={{ marginTop: '10rem' }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({ nowPw, newPw, newConfirmPw });
          }}>
          <Flex direction="column" gap={10}>
            <Password label="현재 비밀번호" control={control} trigger={trigger} setPw={setNowPw} />
            <Password label="새 비밀번호" control={control} trigger={trigger} name="password" setPw={setNewPw} />
            <Password
              label="새 비밀번호 확인"
              control={control}
              trigger={trigger}
              name="confirmPassword"
              setPw={setNewConfirmPw}
            />
            <Button type="submit">제출</Button>
          </Flex>
        </form>
      </Modal>
      <Flex gap={50}>
        <Title order={2}>비밀번호</Title>
        <Button onClick={open}>수정</Button>
      </Flex>
    </Container>
  );
};

export default EditPassword;
