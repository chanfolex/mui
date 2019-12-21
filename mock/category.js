import { parse } from 'url';

let categoryDataSource = [];
for (let i = 0; i < 46; i += 1) {
  categoryDataSource.push({
    key: i,
    name: `TradeCode ${i}`,
    pinyin: `Pinyin ${i}`,
  });
}

function getCategory(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = categoryDataSource;

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


function postCategory(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, pinyin, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      categoryDataSource = categoryDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      categoryDataSource.unshift({
        key: i,
        name: `${name} ${i}`,
        pinyin: `${pinyin} ${i}`,
      });
      break;
    case 'update':
      categoryDataSource = categoryDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { pinyin, name });
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
      list: categoryDataSource,
      pagination: {
        total: categoryDataSource.length,
      },
    }
  };

  return res.json(result);
}

export default {
  'GET /api/category': getCategory,
  'POST /api/category': postCategory,
};
