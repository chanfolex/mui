import { parse } from 'url';

let productDataSource = [];
for (let i = 0; i < 46; i += 1) {
  productDataSource.push({
    key: i,
    name: `TradeCode ${i}`,
    category: `category ${i}`,
    type:  `Type ${i}`,
    model: `Model ${i}`,
    image: `Image ${i}`,
    description: `description ${i}`,
    pack: `Pack ${i}`,
    cost: `Cost ${i}`,
  });
}

function getProduct(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = productDataSource;

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


function postProduct(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, category, type, model, image, description, cost, pack, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      productDataSource = productDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      productDataSource.unshift({
        key: i,
        name: `${name} ${i}`,
        category: `${category} ${i}`,
        type: `${type} ${i}`,
        model: `${model} ${i}`,
        image: `${image} ${i}`,
        description: `${description} ${i}`,
        cost: `${cost} ${i}`,
        pack: `${pack} ${i}`,
      });
      break;
    case 'update':
      productDataSource = productDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { name, category, type, model, image, description, pack, cost });
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
      list: productDataSource,
      pagination: {
        total: productDataSource.length,
      },
    }
  };

  return res.json(result);
}

export default {
  'GET /api/product': getProduct,
  'POST /api/product': postProduct,
};
