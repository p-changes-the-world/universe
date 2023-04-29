import { IconHeart, IconHistory, IconMovie } from '@tabler/icons-react';
import {
  Container,
  Card,
  Image,
  Text,
  ActionIcon,
  Badge,
  Group,
  Flex,
  useMantineTheme,
  SimpleGrid,
  rem,
} from '@mantine/core';
import styled from '@emotion/styled';
import { useCallback, useState, Suspense } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useSortByPopularityInfinityQuery } from '../../hooks/queries';
import useObserver from '../../hooks/useObserver';
import { ActionIcons, ScrollObserver } from '../common';
import genres from '../../constants/genres';
import PosterSkeleton from './PosterSkeleton';
import DetailModal from '../common/Detail/DetailModal';

const CardGrid = styled(SimpleGrid)`
  position: relative;
  grid-template-columns: repeat(5, 15.75rem);
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  padding: 0;
  &:hover > div {
    opacity: 90%;
  }
  &:hover > div:last-child {
    opacity: 100%;
  }
`;

const Cover = styled(Container)`
  position: absolute;
  background-color: ${({ theme }) => `var(--mantine-color-${theme.colorScheme === 'dark' ? 'dark-9' : 'gray-1'})`};
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0%;
  transition: 0.3s ease;
`;

const HoverContainer = styled(Container)`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: 0.3s ease;
`;

const Title = styled(Text)`
  display: 'block';
  margin-top: var(--mantine-spacing-lg);
  margin-bottom: rem(5);
`;

const Footer = styled(Group)`
  margin-top: var(--mantine-spacing-md);
  align-items: flex-start;
  flex-direction: column;
`;

const Poster = ({
  setModalState,
  open,
  id,
  title,
  originalTitle,
  posterPath,
  backdropPath,
  overview,
  date,
  genreIds,
  mediaType,
}) => {
  const genre = mediaType === 'movie' ? genres.movie : genres.tv;

  const handlePosterClick = () => {
    const genreLists = genreIds?.map(id => genre[id].name);

    const data = { id, title, backdropPath, posterPath, overview, genreLists, mediaType };

    setModalState(data);
    open();
  };

  return (
    <StyledCard w={252} h={355} radius="md" onClick={handlePosterClick}>
      <Image
        src={posterPath ? `https://image.tmdb.org/t/p/w342${posterPath}` : 'https://placehold.co/252x378?text=TDB'}
      />
      <Cover />
      <HoverContainer p={'xl'} w={252}>
        <Flex direction={'column'} align={'baseline'} justify={'space-between'}>
          <Container m={0} p={0} mb={'md'}>
            <Title fz="xl" fw={600} lineClamp={1}>
              {title}
            </Title>
            <Text fz="md" color="dimmed" lineClamp={1}>
              {originalTitle}
            </Text>
            <Text fw={200} fz={'xs'}>
              {date}
            </Text>
            <Text w="100%" mt="md" fz="xs" color="dimmed" lineClamp={5}>
              {overview}
            </Text>
          </Container>
          <Footer position="apart">
            <Flex w={'100%'} wrap={'wrap'}>
              {genreIds.map(id => (
                <Badge color={genres[mediaType][id].color} key={id}>
                  {genres[mediaType][id].name}
                </Badge>
              ))}
            </Flex>
            <ActionIcons size={'1rem'} id={id} type={mediaType} />
          </Footer>
        </Flex>
      </HoverContainer>
    </StyledCard>
  );
};

const observeOption = { rootMargin: '50%' };

const Posters = ({ mediaType }) => {
  const { isSuccess, data: content, hasNextPage, fetchNextPage } = useSortByPopularityInfinityQuery(mediaType);

  const [opened, { open, close }] = useDisclosure(false);
  const [modalState, setModalState] = useState({
    id: '',
    title: '',
    backgroundPath: '',
    posterPath: '',
    overview: '',
    genreLists: [],
    mediaType: '',
  });

  const getNextPage = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const observerRef = useObserver(getNextPage, hasNextPage, observeOption);

  const movie = mediaType === 'movie';

  return (
    <>
      <CardGrid
        cols={5}
        w={rem(1324)}
        verticalSpacing="sm"
        breakpoints={[
          { maxWidth: '100rem', cols: 5 },
          { maxWidth: '48rem', cols: 2 },
          { maxWidth: '36rem', cols: 1 },
        ]}>
        {isSuccess &&
          content.map(
            ({
              id,
              title,
              name,
              original_title: originalTitle,
              original_name: originalName,
              poster_path: posterPath,
              backdrop_path: backdropPath,
              genre_ids: genreIds,
              overview,
              release_date: releaseDate,
              first_air_date: firstAirDate,
            }) => (
              <Poster
                open={open}
                setModalState={setModalState}
                key={id}
                id={id}
                title={movie ? title : name}
                originalTitle={movie ? originalTitle : originalName}
                posterPath={posterPath}
                backdropPath={backdropPath}
                genreIds={genreIds}
                overview={overview}
                date={movie ? releaseDate : firstAirDate}
                mediaType={mediaType}
              />
            )
          )}
      </CardGrid>
      {opened && (
        <Suspense
          fallback={
            <div style={{ position: 'absolute', width: '100px', height: '200px', backgroundColor: '#fff' }}></div>
          }>
          <DetailModal opened={opened} close={close} movie={modalState} />
        </Suspense>
      )}
      <ScrollObserver loader={<PosterSkeleton />} hasNextPage={hasNextPage} observer={observerRef} />
    </>
  );
};
export default Posters;
