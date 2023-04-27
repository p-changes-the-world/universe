import { useState } from 'react';
import { Chip, Flex, Title, ActionIcon } from '@mantine/core';
import { IconDiscountCheck } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { PROVIDERS } from '../../constants';

const SubscriptionEditor = ({ providers, onClick }) => {
  const providersNames = providers?.map(provider => provider.provider_name);

  const [selectedProviders, setSelectedProviders] = useState(providersNames);

  const { register, handleSubmit } = useForm();

  const onSubmit = (data, e) => {
    e.preventDefault();

    onClick();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex justify="space-between" align="center" mb={10}>
        <Title order={5} fw={400}>
          구독중인 서비스를 선택해주세요.
        </Title>
        <ActionIcon component="button" type="submit" variant="transparent" align="center">
          <IconDiscountCheck size="1rem" />
        </ActionIcon>
      </Flex>
      <Chip.Group multiple value={selectedProviders} onChange={setSelectedProviders}>
        <Flex gap={3} wrap="wrap">
          {PROVIDERS.map(provider => (
            <Chip key={provider.id} value={provider.provider_name} {...register(`${provider.provider_name}`)}>
              {provider.provider_name}
            </Chip>
          ))}
        </Flex>
      </Chip.Group>
    </form>
  );
};

export default SubscriptionEditor;
