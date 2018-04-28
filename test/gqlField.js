import { expect } from 'chai';
import { GqlField } from '../index';

describe('GqlField', () => {
  it('new Types', () => {
    const gqlField = new GqlField({
      Date: {
        Date: ['', 'ne'],
        '[Date!]': ['in'],
      },
    });
    const r = gqlField.parse({
      createdAt: 'Date',
    });
    expect(r.toFilter()).to.deep.equal({
      createdAt: 'Date',
      createdAt_ne: 'Date',
      createdAt_in: '[Date!]',
    });
  })
  it('sortBy', () => {
    const gqlField = new GqlField();
    const r = gqlField.parse({
      age: 'Float',
      yob: 'Int',
    });
    expect(r.toSortBy()).to.deep.equal(['age_ASC', 'age_DESC', 'yob_ASC', 'yob_DESC']);
  })
  it('support Types', () => {
    const gqlField = new GqlField();
    const r = gqlField.parse({
      age: 'Float',
      yob: 'Int',
    });
    expect(r.toFilter()).to.deep.equal({
      age: 'Float',
      age_ne: 'Float',
      age_in: '[Float!]',
      age_nin: '[Float!]',
      age_lt: 'Float',
      age_lte: 'Float',
      age_gt: 'Float',
      age_gte: 'Float',
      yob: 'Int',
      yob_ne: 'Int',
      yob_in: '[Int!]',
      yob_nin: '[Int!]',
      yob_lt: 'Int',
      yob_lte: 'Int',
      yob_gt: 'Int',
      yob_gte: 'Int',
    });
  });
});
