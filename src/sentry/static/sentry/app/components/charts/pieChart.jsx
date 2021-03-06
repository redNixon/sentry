import PropTypes from 'prop-types';
import React from 'react';

import PieSeries from './series/pieSeries';
import BaseChart from './baseChart';

class PieChart extends React.Component {
  static propTypes = {
    // We passthrough all props exception `options`
    ...BaseChart.propTypes,

    name: PropTypes.string,

    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.number,
      })
    ),
  };

  render() {
    const {name, data, ...props} = this.props;
    if (!data.length) return null;

    return (
      <BaseChart
        {...props}
        options={{
          series: [
            PieSeries({
              name,
              data,
              avoidLabelOverlap: false,
              label: {
                normal: {
                  formatter: '{b}\n{d}%',
                  show: false,
                  position: 'center',
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '18',
                  },
                },
              },
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
            }),
          ],
        }}
      />
    );
  }
}

export default PieChart;
