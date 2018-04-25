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

export default builders;
