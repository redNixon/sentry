import React from 'react';

import theme from 'app/utils/theme';

import BaseChart from './baseChart';
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
    const {chartData, xAxisData, ...props} = this.props;
    const series = Object.entries(chartData).map(this.defineSeries);

    return (
      <BaseChart
        {...props}
        options={{
          xAxis: XAxis({
            type: 'category',
            data: xAxisData,
            boundaryGap: false,
          }),
          yAxis: YAxis({}),
          series,
        }}
      />
    );
  }
}
