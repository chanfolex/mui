import { parse } from 'url';

let typesDataSource = [];
for (let i = 0; i < 46; i += 1) {
  typesDataSource.push({
    id: i,
    name: `TradeCode ${i}`,
    abbr: `Pinyin ${i}`,
  });
}

function getTypes(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = typesDataSource;

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    code: 200,
    msg: '',
    data: {
      list: dataSource,
      pagination: {
        total: dataSource.length,
        pageSize,
        current: parseInt(params.currentPage, 10) || 1,
      },
    }
  };

  return res.json(result);
}


function postTypes(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, abbr, id } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      typesDataSource = typesDataSource.filter(item => id.indexOf(item.id) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      typesDataSource.unshift({
        id: i,
        name: `${name} ${i}`,
        abbr: `${abbr} ${i}`,
      });
      break;
    case 'update':
      typesDataSource = typesDataSource.map(item => {
        if (item.id === id) {
          Object.assign(item, { abbr, name });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    code: 200,
    msg: '',
    data: {
      list: typesDataSource,
      pagination: {
        total: typesDataSource.length,
      },
    }
  };

  return res.json(result);
}

export default {
  'GET /api/type': getTypes,
  'POST /api/type': postTypes,
};
