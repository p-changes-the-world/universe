import ReactApexChart from 'react-apexcharts';
import { Text, Group, useMantineColorScheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDeviceAnalytics } from '@tabler/icons-react';
import styled from '@emotion/styled';
import { useStatsByMonthly } from '../../hooks/statistics';

const Icon = styled(IconDeviceAnalytics)`
  color: ${({ theme }) => (theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4])};
`;

const Diff = styled(Text)`
  align-items: center;
`;

const getMaxMonth = datas => {
  let max = -1;
  let maxMonth = [];
  datas.forEach((data, idx) => {
    if (data > max) {
      max = data;
      maxMonth = [idx + 1];
    } else if (data === max) {
      max = data;
      maxMonth.push(idx + 1);
    }
  });
  return maxMonth.join(', ');
};

const StatsByMonthly = () => {
  const xsmallScreen = useMediaQuery('(max-width: 30rem)');

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const monthlyData = useStatsByMonthly();

  const total = monthlyData.reduce((acc, cur) => acc + cur, 0);
  const maxMonth = getMaxMonth(monthlyData);

  const chartData = {
    options: {
      chart: {
        id: 'monthly-line',
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      colors: ['#A17FFB'],
      grid: {
        borderColor: 'transparent',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        title: {
          text: 'Month',
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
      stroke: {
        curve: 'smooth',
        lineCap: 'butt',
        width: 3,
      },
    },
    series: [
      {
        name: 'series-monthly',
        data: monthlyData,
      },
    ],
  };

  return (
    <>
      <Group position="apart" mt={7}>
        <Group align="flex-end" spacing="xs">
          <Text fz={xsmallScreen ? 'sm' : 'lg'} fw={700} align="left">
            올해는 총{' '}
            <Text fw={900} c={dark ? 'violet.2' : 'violet.9'} span>
              {total}
            </Text>
            건의 컨텐츠를 감상했어요.
          </Text>
        </Group>
        <Icon size="1.4rem" stroke={1.5} />
      </Group>
      <Diff c="teal" fz={xsmallScreen ? 'xs' : 'sm'} fw={700} display="flex">
        {total === 0 ? '지금부터 컨텐츠를 감상해보세요!' : `${maxMonth}월에 가장 많은 컨텐츠를 감상했어요.`}
      </Diff>
      <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={250} />
    </>
  );
};

export default StatsByMonthly;
