import operatorBuilder from './operatorBuilder';

class GqlMongo {
  constructor(extendOperatorBuiler = {}) {
    this.operatorBuilder = Object.assign(
      {},
      operatorBuilder,
      extendOperatorBuiler,
    );
  }
  parse(filter = {}) {
    const query = { };
    Object.entries(filter).forEach(([name, value]) => {
      switch (name) {
        case 'AND': {
          const $and = value.map(v => this.parse(v));
          query.$and.push({ $and });
          break;
        }
        case 'OR': {
          const $or = value.map(v => this.parse(v));
          query.$and.push({ $or });
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
          if (!query.$and) query.$and = [];
          query.$and.push({ [nameWithoutOperator]: this.operatorBuilder[mongoOperator](value) });
        }
      }
    });
    return query;
  }
}

export default GqlMongo;
