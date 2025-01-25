/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useEffect, useRef } from 'react';
import { useThemeMode } from '../../../../_metronic/partials';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import { useIntl } from 'react-intl';
// import { useIntl } from 'react-intl'

type Props = {
  chartTitle?: string;
  optionsColors?: Array<string>;
  hasLegend?: boolean;
  width?: string;
  height?: string;
  optionsDatas?: Array<number>;
  optionsLabels?: Array<string>;
  optionsLegend?: Array<string>;
};

const DashCardsWidgetLineChart: FC<Props> = ({
  chartTitle,
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
  hasLegend = false,
  width,
  height,
  optionsDatas = [],
  optionsLabels = [],
  optionsLegend = []
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();

  const intl = useIntl()

  const state = {
    options: {
      chart: {
        id: 'basic-bar',
        zoom: {
          enabled: false,
        },
      },
      legend: {
        show: hasLegend,
        customLegendItems: hasLegend ? optionsLegend : []
      },
      xaxis: {
        categories: optionsLabels,
      },
      // title: {
      //   text: 'Product Trends by Month',
      //   align: 'left'
      // },
      colors: optionsColors,
    },
    stroke: {
      curve: 'smooth',
    },
    series: optionsDatas,
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
            type="area"
            className="mx-auto"
          />
  );
};

export { DashCardsWidgetLineChart };
