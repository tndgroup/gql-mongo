# What is gql-mongo 

gql-mongo is a simple converter which converts your `graphql` query to `mongodb` query

## Get Started 

let define your simple query: 
```graphql
  input UserFilter {
    id: ID
    username: String
    age: Integer
    age_gt: Integer
    age_lt: Integer
  }
  type Query {
    // search for users in your mongodb database
    users: (filter: UserFilter!, sortBy: UserSortBy!, limit: Integer!, skip: Integer!): UserConnection!
  }
```
GqlMongo converts your `filter` query to 
```javascript
  {
    $and: [
      { id: { $eq: <value> } },
      { username: { $eq: <value> }},
      { age: {$eq: <value>} },
      { age: {$gt: <value>} },
      { age: {$lt: <value>} }
    ]
  }
```
check `MetaFilter` of https://www.graph.cool/docs/reference/graphql-api/query-api-nia9nushae for standard filter.

## Support operators

`$eq`, `$gt`, `$gte`, `$in`, `$lt`, `$lte`, `$ne`, `$nin`, `$regex`,

## Usage 

Use in your resolver `users.js`
```javascript
import { GqlMongo } from 'qgl-mongo'
const gqlMongo = new GqlMongo()

export default ({_, { filter = {}, orderBy, skip, limit }, { Users }}) => {
  const query = gqlMongo.parse(filter);
  const users = Users.find(query);
  // handle skip limit
}
```

## Custom query
for exmaple, you want to search username which starts with `taind`. Firstly, adding new field to query
```graphql
  input UserFilter {
    id: ID
    username: String
    username_starts_with: String
    age: Integer
    age_gt: Integer
    age_lt: Integer
  }
```
then in resolver `users.js`
```javascript
import { GqlMongo } from 'qgl-mongo'
const gqlMongo = new GqlMongo({
  $starts_with: val => ({$regex: new RegExp(`^${val}`, 'gi')})
})
```
## Additional Features
GqlMongo generate query fields:

```gql
import { GqlField } from 'gql-mongo'
const gqlMongo = new GqlField()
const r = gqlMongo.parse({ age: 'Int'}) 
// { age: 'Int', age_ne: 'Int', age_in: '[Int!]', age_nin: '[Int!]', age_lt: 'Int', age_lte: 'Int', age_gt: 'Int', age_gte: 'Int' }

```

