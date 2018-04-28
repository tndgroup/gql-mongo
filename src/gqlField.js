import fieldBuiler from './fieldBuilder';

class GqlField {
  constructor(extendFieldBuilder = {}) {
    this.fieldBuiler = Object.assign(
      {},
      fieldBuiler,
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

export default GqlField;
