
# TabbyUrl

TabbyUrl is a simple demo for a URL shortener app backend using GraphQL and Typescript.

## Live Preview

The GraphQL backend can be previewed here: 
[https://tabby-url.mechacat.app/graphql](https://tabby-url.mechacat.app/graphql)

You can also use [Apollo Studio Explorer](https://studio.apollographql.com/sandbox/explorer) to view and query the schema.

## Usage
### Setup
- Clone the repo
- `yarn` to install dependencies
- `docker-compose up -d` to build and start the database instance (Docker Compose is required)
- `yarn migrate:latest` to run the DB setup migrations
- Create `.env` file using `.env-sample` as reference

### Development
- `yarn dev` to run in development mode
- `yarn codegen` or `yarn codegen:watch` to update GraphQL Typescript types after modifying the schema
- `yarn test` or `yarn test:watch` to run tests

### Build
- `yarn start` to build and run
- `yarn build` to build only

## Details
### Project Description

This submission is intended to demonstrate an application using GraphQL and Typescript. Project structure is intended to incorporate elements of Clean Architecture to improve code quality, maintainability and allow for future modifications or improvements as would happen in real-world scenarios.

### Scope
- This project only covers the backend and no frontend is included. It is not intended to be a fully robust product-ready application, only to incorporate enough to demonstrate the intent for some of the code design.
- The code is covered by tests at the various levels to demonstrate some of the testing approaches but is not intended to have full coverage.
- Additional comments are included inline to explain certain choices made.
- Authentication is not implemented, but there are stubs to indicate where and how authentication validation would take place.

### Assumptions
- Only URLs are accepted to be shortened, and not other kinds of data
- The client would have fully validated the incoming URL so the endpoint will reject incomplete or invalid URLs.
- The short URL ID will be 7 characters long.
- Custom URLs are not supported.

### Notes
- MySQL was used as the database because of existing skill familiarity

## Challenges

If the app encounters high usage numbers (e.g. 10,000 people trying to shorten URLS), several potential bottlenecks would arise:
- Due to the nature of GraphQL using a single `/graphql` endpoint for all requests it would be more difficult to scale or rate-limit requests by function like a traditional REST API and is a single point of failure.
- When a short url ID is generated, the app needs to check the database to confirm that it is a unique string before allowing it to be saved. This means multiple requests per shorten and would impact performance (see related section below)
- The medium for storing the data would play a significant factor -- for example currently a MySQL database is used, which would have limits for connections and get impacted on slow or long-running queries.

To work around these bottlenecks, several potential actions could be taken (not a comprehensive list):
- The application could be considered for load-balancing across multiple instances, but this would come with additional challenges of maintaining data coherency (e.g. two application instances generating the same id and creating a race condition when saving the data).
- The data access portion was split into its own layer separate from the business logic to allow for changing the data storage and retrieval strategy without affecting the other logic. This would possibly make it easier to introduce caching or other tiered storage strategies that could be more tailored to the higher usage counts.
- Similarly, the infrastructure layer is separated out from the controller to allow for moving portions of the functions out to other microservices or to introduce queues for handling distributed requests to offload performance challenges to other services more tailored to tackle them.

If there are a large number of new links a month, for example 500 million, the performance characteristics will change:
- If maintaining storage only in the database, then it will get progressively slower per request as the number of records needing to be scanned to check for each link grows at a fast pace. This would slow down the average time for each request and subsequently tie up the database connections in increasingly lengthy queries.
- Storage size will also be a challenge, as both the data and index size will increase significantly. Additionally, while the data types of the tables does not matter on a small scale, for mass scale the size of data per link has a big impact (eg 7 characters per short id vs 8 characters)
