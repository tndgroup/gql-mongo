import { expect } from 'chai';
import parse from '../index';

describe('nix', () => {
  it('should be ok', () => {
    expect(1).to.equal(1)
  });
  it('AND/OR', () => {
    const r = parse({
      name: 'taind',
      AND: [{ age_gte: 10, age_lte: 20 }],
      OR: [{ age_gte: 10, age_lte: 20 }],
    });
    expect(r).to.deep.equal({
      name: { $eq: 'taind' },
      $and: [{ age: { $gte: 10, $lte: 20 } }],
      $or: [{ age: { $gte: 10, $lte: 20 } }],
    });
  });
  it('throw error', () => {
    try {
      parse({ name: 'taind', age: 10, age_starts_with: 5 });
      expect(true).to.equal(false);
    } catch (e) {
      expect(true).to.equal(true);
    }
  });
  it('one level', () => {
    const r = parse({ name: 'taind', age: 10, age_gte: 5 });
    expect(r).to.deep.equal({
      name: {
        $eq: 'taind',
      },
      age: {
        $eq: 10,
        $gte: 5,
      },
    });
  });
});
