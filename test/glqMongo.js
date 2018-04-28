import { expect } from 'chai';
import { GqlMongo } from '../index';

describe('gql-mongo', () => {
  it('should be ok', () => {
    expect(1).to.equal(1)
  });
  it('AND/OR', () => {
    const gqlMongo = new GqlMongo();
    const r = gqlMongo.parse({
      name: 'taind',
      AND: [{ age_gte: 10, age_lte: 20 }],
      OR: [{ age_gte: 10, age_lte: 20 }],
    });
    expect(r).to.deep.equal({
      name: {
        $and: [
          { $eq: 'taind' },
        ],
      },
      $and: [{ age: { $and: [{ $gte: 10 }, { $lte: 20 }] } }],
      $or: [{ age: { $and: [{ $gte: 10 }, { $lte: 20 }] } }],
    });
  });
  it('throw error', () => {
    const gqlMongo = new GqlMongo();
    try {
      gqlMongo.parse({ name: 'taind', age: 10, age_starts_with: 5 });
      expect(true).to.equal(false);
    } catch (e) {
      expect(true).to.equal(true);
    }
  });
  it('one level', () => {
    const gqlMongo = new GqlMongo();
    const r = gqlMongo.parse({ name: 'taind', age: 10, age_gte: 5 });
    expect(r).to.deep.equal({
      name: {
        $and: [
          { $eq: 'taind' },
        ],
      },
      age: {
        $and: [
          { $eq: 10 },
          { $gte: 5 },
        ],
      },
    });
  });
  it('extend operator', () => {
    const gqlMongo = new GqlMongo({
      $starts_with: val => ({ $regex: new RegExp(`^${val}`, 'gi') }),
    });
    const r = gqlMongo.parse({
      name: 'taind',
      name_starts_with: 'tai',
    });
    expect(r).to.deep.equal({
      name: {
        $and: [
          { $eq: 'taind' },
          { $regex: /^tai/gi },
        ],
      },
    });
  });
});