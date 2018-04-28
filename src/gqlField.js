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
    const filter = {};
    const sortBy = [];
    const supportTypes = Object.keys(this.fieldBuiler);
    Object.entries(fieldWithType).forEach(([name, type]) => {
      if (!supportTypes.includes(type)) {
        throw new Error(`type ${type} hasn't been supported yet`);
      }
      sortBy.push(`${name}_ASC`);
      sortBy.push(`${name}_DESC`);
      Object.entries(this.fieldBuiler[type]).forEach(([compoundType, operators]) => {
        operators.forEach((operator) => {
          const generatedName = operator ? `${name}_${operator}` : name;
          filter[generatedName] = compoundType;
        });
      });
    });
    return {
      toFilter: () => filter,
      toSortBy: () => sortBy,
      toSortByString: () => sortBy.join('\n'),
      toFilterString: () => Object.entries(filter).map(([name, type]) => `${name}: ${type}`).join('\n'),
    };
  }
}

export default GqlField;
