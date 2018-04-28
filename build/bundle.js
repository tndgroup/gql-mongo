'use strict';

const simpleBuiler = operator => value => ({ [operator]: value });
const builders = {};
const mongoOperators = [
  '$eq',
  '$gt',
  '$gte',
  '$in',
  '$lt',
  '$lte',
  '$ne',
  '$nin',
  '$regex',
];
mongoOperators.forEach((m) => {
  builders[m] = simpleBuiler(m);
});

class GqlMongo {
  constructor(extendOperatorBuiler = {}) {
    this.operatorBuilder = Object.assign(
      builders,
      extendOperatorBuiler,
    );
  }
  parse(filter = {}) {
    const query = {};
    Object.entries(filter).forEach(([name, value]) => {
      switch (name) {
        case 'AND': {
          if (!query.$and) query.$and = [];
          value.forEach(v => query.$and.push(this.parse(v)));
          break;
        }
        case 'OR': {
          if (!query.$or) query.$or = [];
          value.forEach(v => query.$or.push(this.parse(v)));
          break;
        }
        default: {
          const [nameWithoutOperator, ...rest] = name.split('_');
          const operator = rest.join('_');
          let mongoOperator = '$eq';
          if (operator) mongoOperator = `$${operator}`;
          if (!this.operatorBuilder[mongoOperator]) {
            throw new Error(`${mongoOperator} does not supported`);
          }
          if (!query[nameWithoutOperator]) query[nameWithoutOperator] = { $and: [] };
          query[nameWithoutOperator].$and.push(this.operatorBuilder[mongoOperator](value));
        }
      }
    });
    return query;
  }
}

module.exports = GqlMongo;
