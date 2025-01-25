/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useEffect, useRef } from 'react';
import { useThemeMode } from '../../../../_metronic/partials';
import Chart from 'react-apexcharts';
// import { useIntl } from 'react-intl'

type Props = {
  chartTitle?: string;
  optionsColors?: Array<string>;
  hasLegend?: boolean;
  width?: string;
  height?: string;
  optionsDatas?: Array<number>;
  optionsLabels?: Array<string>;
};

const DashCardsWidgetBarChart: FC<Props> = ({
  chartTitle,
  // optionsColors = ['#17c653', '#e67900'],
  optionsColors = [
    '#17c653',
    '#e67900',
    '#e64a19',
    '#ffc857',
    '#3a5081',
    '#9a031e',
    '#58a4b0',
    '#9c27b0',
    '#69d2e7',
    '#491e06',
  ],
  width,
  height,
  hasLegend = false,
  optionsDatas = [],
  optionsLabels = [],
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();

  // const intl = useIntl()

  const state = {
    // options: {
    //   legend: {
    //     show: false
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   labels: optionsLabels,
    //   colors: optionsColors
    // },
    // series: optionsDatas,
    // labels: optionsLabels,
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: optionsLabels,
      },
      colors: optionsColors,
      legend: {
        show: hasLegend
      },
      dataLabels: {
        enabled: false
      },
    },
    // series: optionsDatas,
    series: [
      {
        // name: "series-1",
        data: optionsDatas,
      },
    ],
  };

  useEffect(() => {
    refreshChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const refreshChart = () => {
    if (!chartRef.current) {
      return;
    }
  };

  return (
    <Chart
    options={state.options}
    series={state.series}
    width={width}
    height={height}
    type="bar"
    className="mx-auto"
  />
  );
};

export { DashCardsWidgetBarChart };
