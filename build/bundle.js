'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
      {},
      builders,
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

const fields = {
  Int: {
    Int: ['', 'ne', 'lt', 'lte', 'gt', 'gte'],
    '[Int!]': ['in', 'nin'],
  },
  Float: {
    Float: ['', 'ne', 'lt', 'lte', 'gt', 'gte'],
    '[Float!]': ['in', 'nin'],
  },
  Boolean: {
    Boolean: ['', 'ne'],
  },
  String: {
    String: ['', 'ne', 'lt', 'lte', 'gt', 'gte', 'regex'],
    '[String!]': ['in', 'nin'],
  },
  ID: {
    ID: ['', 'ne', 'lt', 'lte', 'gt', 'gte', 'regex'],
    '[ID!]': ['in', 'nin'],
  },
  Enum: {
    Enum: ['', 'ne'],
    '[Enum!]': ['in', 'nin'],
  },
};

class GqlField {
  constructor(extendFieldBuilder = {}) {
    this.fieldBuiler = Object.assign(
      {},
      fields,
      extendFieldBuilder,
    );
  }
  parse(fieldWithType = {}) {
    const query = {};
    const supportTypes = Object.keys(this.fieldBuiler);
    Object.entries(fieldWithType).forEach(([name, type]) => {
      if (!supportTypes.includes(type)) {
        throw new Error(`type ${type} hasn't been supported yet`);
      }
      Object.entries(this.fieldBuiler[type]).forEach(([compoundType, operators]) => {
        operators.forEach((operator) => {
          const generatedName = operator ? `${name}_${operator}` : name;
          query[generatedName] = compoundType;
        });
      });
    });
    return query;
  }
}

GqlField.toString = (fieldWithType = {}) => Object
  .entries(fieldWithType).map(([name, type]) =>`${name}: ${type}`).join('\n');

exports.GqlMongo = GqlMongo;
exports.GqlField = GqlField;
