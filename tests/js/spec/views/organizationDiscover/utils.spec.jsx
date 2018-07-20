import {
  getQueryFromQueryString,
  getQueryStringFromQuery,
} from 'app/views/organizationDiscover/utils';
import moment from 'moment/moment';

const queryString =
  '?aggregations=%5B%5B%22count()%22%2Cnull%2C%22count%22%5D%2C%5B%22topK(5)%22%2C%22os_build%22%2C%22topK_5_os_build%22%5D%5D&conditions=%5B%5D&end=%222018-07-10T01%3A18%3A04%22&fields=%5B%22event_id%22%2C%22timestamp%22%5D&limit=1000&orderby=%22-timestamp%22&projects=%5B8%5D&start=%222018-06-26T01%3A18%3A04%22';

const query = {
  aggregations: [['count()', null, 'count'], ['topK(5)', 'os_build', 'topK_5_os_build']],
  conditions: [],
  end: '2018-07-10T01:18:04',
  fields: ['event_id', 'timestamp'],
  limit: 1000,
  orderby: '-timestamp',
  projects: [8],
  start: '2018-06-26T01:18:04',
};

describe('get query from URL query string', function() {
  it('returns empty object if empty query string', function() {
    expect(getQueryFromQueryString('')).toEqual({});
  });

  it('handles aggregations', function() {
    expect(getQueryFromQueryString(queryString)).toEqual(query);
  });
});

describe('get query URL string from query', function() {
  it('parses query from query string', function() {
    expect(getQueryStringFromQuery(query)).toEqual(queryString);
  });
});

const sampleQueryData = [
  {
    'exception_stacks.type': 'ZeroDivisionError',
    platform: 'python',
    count: 6,
    time: 1531094400,
  },
  {
    'exception_stacks.type': 'Type Error',
    platform: 'javascript',
    count: 6,
    time: 1531094400,
  },
  {
    'exception_stacks.type': 'Exception',
    platform: 'php',
    count: 6,
    time: 1531094400,
  },
  {
    'exception_stacks.type': 'SnubaError',
    platform: 'python',
    count: 14,
    time: 1531094400,
  },
  {
    'exception_stacks.type': 'ZeroDivisionError',
    platform: 'python',
    count: 20,
    time: 1532070000,
  },
  {
    'exception_stacks.type': 'Type Error',
    platform: 'javascript',
    count: 5,
    time: 1532070000,
  },
  {
    'exception_stacks.type': 'Exception',
    platform: 'php',
    count: 8,
    time: 1532070000,
  },
  {
    'exception_stacks.type': 'SnubaError',
    platform: 'python',
    count: 30,
    time: 1532070000,
  },
];

const fields = ['platform', 'exception_stacks.type'];

function getLabel(value) {
  if (typeof value === 'object') {
    try {
      value = JSON.stringify(value);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  return value;
}

function getDataForChart(queryData, groupbyFields) {
  // const {aggregations} = this.props.query;
  // const aggregate = aggregations[0][2];
  const aggregate = 'count';

  const rawDates = [...new Set(queryData.map(entry => entry.time))];

  const formattedDates = rawDates.map(time => moment(time * 1000).format('MM-DD'));

  const output = {};
  queryData.forEach(data => {
    const key = groupbyFields.map(field => getLabel(data[field])).join(',');
    const val = getLabel(data[aggregate]);
    const idx = rawDates.indexOf(data.time);

    if (!(key in output)) {
      output[key] = {};
    }
    output[key][idx] = val;
  });

  // If there is no data for that series in that time period, fill it with null
  const data = {};
  Object.entries(output).forEach(([line, val]) => {
    data[line] = new Array(rawDates.length).fill(null);
    Object.entries(val).forEach(([idx, count]) => {
      data[line][idx] = count;
    });
  });

  return {
    chartData: data,
    dates: formattedDates,
  };
}

describe('getDataForChart()', function() {
  const expectedData = {
    chartData: {
      'javascript,Type Error': [6, 5],
      'php,Exception': [6, 8],
      'python,SnubaError': [14, 30],
      'python,ZeroDivisionError': [6, 20],
    },
    dates: ['07-08', '07-20'],
  };

  expect(getDataForChart(sampleQueryData, fields)).toEqual(expectedData);
});
