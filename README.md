# What is NIX

Nix is a simple converter which converts your graphql query to mongodb query

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
Nix converts your `filter` query to 
```javascript
  {
    id: <value>,
    username: <value>,
    age: {
      $gt: <value>,
      $lt: <value>
    }
  }
```
check `MetaFilter` of https://www.graph.cool/docs/reference/graphql-api/query-api-nia9nushae for standard filter.

## Support operators

`$eq`, `$gt`, `$gte`, `$in`, `$lt`, `$lte`, `$ne`, `$nin`, `$regex`,

## Usage 

Use in your resolver `users.js`
```javascript
import Nix from 'nix'
const nix = new Nix()

export default ({_, { filter = {}, orderBy, skip, limit }, { Users }}) => {
  const query = nix.parse(filter);
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
import Nix from 'nix'
const nix = new Nix({
  $starts_with: val => ({$regex: new RegExp(`^${val}`, 'gi')})
})
```
