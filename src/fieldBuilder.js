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

export default fields;
