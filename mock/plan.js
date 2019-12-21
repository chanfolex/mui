import { parse } from 'url';

let planDataSource = [];
for (let i = 0; i < 46; i += 1) {
  planDataSource.push({
    key: i,
    name: `TradeCode ${i}`,
    contractNo: `contractNo ${i}`,
    deliveryTime: `deliveryTime ${i}`,
  });
}

function getPlan(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = planDataSource;

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


function postPlan(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, contractNo, deliveryTime, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      planDataSource = planDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      planDataSource.unshift({
        key: i,
        name: `${name} ${i}`,
        contractNo: `${contractNo} ${i}`,
        deliveryTime: `${deliveryTime} ${i}`,
      });
      break;
    case 'update':
      planDataSource = planDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { name });
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
      list: planDataSource,
      pagination: {
        total: planDataSource.length,
      },
    }
  };

  return res.json(result);
}

export default {
  'GET /api/purchase/plan': getPlan,
  'POST /api/purchase/plan': postPlan,
};
