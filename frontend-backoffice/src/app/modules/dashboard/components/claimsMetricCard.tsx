/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useEffect, useRef } from 'react';
import { useThemeMode } from '../../../../_metronic/partials';
// import { useIntl } from 'react-intl'
import '../DashboardStyles.css';

type Props = {
  metricTitle: string;
  metricValue: string;
  metricColor: string;
  metricBgColor: string;
};

const ClaimsMetricCard: FC<Props> = ({
  metricTitle,
  metricValue,
  metricColor,
  metricBgColor,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();

  // const intl = useIntl()

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
    // box-shadow: 0px 4px 3px -1px red

    <div
      className="w-100 metric"
      style={{
        backgroundColor: metricBgColor,
        boxShadow: '0px 4px 3px -1px ' + metricColor,
      }}
    >
      <h4>{metricTitle}</h4>
      <div className="d-flex">
        <div
          className="col-6 metric_value"
          style={{ backgroundColor: metricColor }}
        >
          {metricValue}
        </div>
      </div>
    </div>
  );
};

export { ClaimsMetricCard };
