import React from 'react';

import theme from 'app/utils/theme';

import BaseChart from './baseChart';
import Tooltip from './components/tooltip';
import XAxis from './components/xAxis';
import YAxis from './components/yAxis';
import LineSeries from './series/lineSeries';

export default class LineChart extends React.Component {
  static propTypes = {
    ...BaseChart.propTypes,
  };

  defineSeries = ([key, value], idx) => {
    return LineSeries({
      name: key,
      data: value,
      color: theme.charts.colors[idx],
    });
  };

  render() {
    const {chartData, dates, ...props} = this.props;
    const series = Object.entries(chartData).map(this.defineSeries);

    return (
      <BaseChart
        {...props}
        options={{
          tooltip: Tooltip(),
          title: {},
          legend: {},
          grid: {
            top: 24,
            bottom: 40,
            left: '10%',
            right: '10%',
          },
          xAxis: XAxis({
            type: 'category',
            data: dates,
            boundaryGap: false,
          }),
          yAxis: YAxis({}),
          series,
        }}
      />
    );
  }
}
