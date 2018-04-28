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
    expect(r.toQuery()).to.deep.equal({
      $and: [
        { name: { $eq: 'taind' } },
        {
          $and: [
            { $and: [{ age: { $gte: 10 } }, { age: { $lte: 20 } }] },
          ],
        },
        {
          $or: [
            { $and: [{ age: { $gte: 10 } }, { age: { $lte: 20 } }] },
          ],
        },
      ],
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
    expect(r.toQuery()).to.deep.equal({
      $and: [
        { name: { $eq: 'taind' } },
        { age: { $eq: 10 } },
        { age: { $gte: 5 } },
      ],
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
    expect(r.toQuery()).to.deep.equal({
      $and: [
        { name: { $eq: 'taind' } },
        { name: { $regex: /^tai/gi } },
      ],
    });
  });
});
