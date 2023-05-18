import {
  Container,
  Card,
  Image,
  Text,
  Badge,
  Group,
  Flex,
  useMantineColorScheme,
  Title,
  Overlay,
  Transition,
  Skeleton,
} from '@mantine/core';
import styled from '@emotion/styled';
import { useState, Suspense } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcons, DetailModalWrapper, ModalSkeleton } from '../../common';
import genres from '../../../constants/genres';
import MoreButton from '../../common/MoreButton';

const Img = styled(Image)`
  overflow: hidden;

  &.mantine-Image-root {
    height: 100%;
    .mantine-Image-figure {
      height: 100%;
      .mantine-Image-imageWrapper {
        height: 100%;
        overflow: hidden;
        .mantine-Image-image {
          height: 100% !important;
          fill: cover;
        }
      }
    }
  }
`;

const Footer = styled(Group)`
  margin-top: var(--mantine-spacing-md);
  align-items: flex-start;
  flex-direction: column;
`;

const Poster = ({ id, title, originalTitle, posterPath, overview, date, genreIds, mediaType }) => {
  const { colorScheme } = useMantineColorScheme();
  const [hovered, setHovered] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const dark = colorScheme === 'dark';

  const openHoverCard = () => setHovered(true);
  const closeHoverCard = () => setHovered(false);

  return (
    <>
      <Card p="0" radius="md" onMouseEnter={openHoverCard} onMouseLeave={closeHoverCard}>
        <Img
          radius="md"
          src={posterPath ? `https://image.tmdb.org/t/p/w342${posterPath}` : 'https://placehold.co/252x378?text=TDB'}
        />
        <Transition mounted={hovered} transition="fade" duration={400} timingFunction="ease">
          {styles => (
            <Overlay style={styles} display="flex" c={dark ? 'dark.9' : 'gray.1'} p="xl" opacity="0.85">
              <Flex direction={'column'} align="baseline" justify="space-between" opacity="none">
                <MoreButton open={open} pos="absolute" right="0.9375rem" top="0.625rem" />
                <Container m="0" mt="xl" p="0" mb="md">
                  <Title fz="lg" fw={600} lineClamp={1} c="gray.1">
                    {title}
                  </Title>
                  <Text fz="sm" lineClamp={1} c="gray.1">
                    {originalTitle}
                  </Text>
                  <Text fz="xs" fw={200} c="gray.1">
                    {date}
                  </Text>
                  <Text w="100%" mt="md" fz="xs" c="dimmed" lineClamp={3}>
                    {overview}
                  </Text>
                  <Flex wrap="wrap" mt="lg">
                    {genreIds.map(id => (
                      <Badge color={genres[mediaType][id].color} key={id}>
                        {genres[mediaType][id].name}
                      </Badge>
                    ))}
                  </Flex>
                </Container>
                <Footer position="apart">
                  <Suspense fallback={<Skeleton h={16} />}>
                    <ActionIcons size={16} id={id} type={mediaType} />
                  </Suspense>
                </Footer>
              </Flex>
            </Overlay>
          )}
        </Transition>
      </Card>
      {opened && (
        <Suspense fallback={<ModalSkeleton />}>
          <DetailModalWrapper opened={opened} close={close} id={id} type={mediaType} />
        </Suspense>
      )}
    </>
  );
};

export default Poster;
