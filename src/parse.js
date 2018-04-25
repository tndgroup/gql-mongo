import MONGO_OPERATORS from './operator';

const parse = (filter) => {
  const query = {};
  Object.entries(filter).forEach(([name, value]) => {
    switch (name) {
      case 'AND':
        if (!query.$and) query.$and = [];
        value.forEach(v => query.$and.push(parse(v)));
        break;
      case 'OR':
        if (!query.$or) query.$or = [];
        value.forEach(v => query.$or.push(parse(v)));
        break;
      default: {
        const [nameWithoutOperator, operator] = name.split('_');
        let mongoOperator = '$eq';
        if (operator) mongoOperator = `$${operator}`;
        if (!MONGO_OPERATORS.includes(mongoOperator)) {
          throw new Error(`${mongoOperator} does not supported`);
        }
        if (!query[nameWithoutOperator]) query[nameWithoutOperator] = {};
        Object.assign(query[nameWithoutOperator], {
          [mongoOperator]: value,
        });
      }
    }
  });
  return query;
};

export default parse;
