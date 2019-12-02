# Upvest Coding test

Coding test developed for Upvest position as a Technical Account, with the goal of building a service for querying a blockchain dataset (details can be found [here](https://gist.github.com/rpip/71f1423acbbfcaf9333f837897698bf0)).

Requirements for the public API:

- :heavy_check_mark: List all transactions with pagination (30 results per page)
- :heavy_check_mark: Fetch a single transaction
- :warning: Get the balance of a contract address
- :heavy_check_mark: List transactions occurring between X & Y dates
- :heavy_check_mark: Fetch details for a single block
- :warning: Get the balance of an address
- :heavy_check_mark: Fetch details of an address
- :warning: API supports filtering and sorting results

This solution was developed on Linux Ubuntu 16.0.4 using mainly NodeJS as the main language, Express framework to handle requests and Mongoose/MongoDB as the NoSQL-paradigm database. More details can be found in the [*package.json* file](https://github.com/davikawasaki/upvest-test/blob/master/package.json).

[Test the demo version online!](https://upvest-blockchain-api.herokuapp.com/)

## Endpoints

- [GET v1/status](https://upvest-blockchain-api.herokuapp.com/v1/status): Check the status of the API

- [GET v1/transactions](https://upvest-blockchain-api.herokuapp.com/v1/transactions): Get a list of all transactions available. Has a list of queries available:
    - page (default 1): set the page to access in a catalogue list (https://upvest-blockchain-api.herokuapp.com/v1/transactions?page=1)
    - limit (default 30): set the limit of records to be return in a single page (https://upvest-blockchain-api.herokuapp.com/v1/transactions?limit=30) 
    - sortBy (default 1): set the sorting of the records ascending (as 1) or descending (as 0) (https://upvest-blockchain-api.herokuapp.com/v1/transactions?sortBy=1)
    - startDate: filter transactions after a start date and before an end date (https://upvest-blockchain-api.herokuapp.com/v1/transactions?startDate=2018-11-09T05:45:30.779970Z&endDate=2019-11-09T05:45:40.779970Z)
    - endDate: filter transactions after a start date and before an end date (https://upvest-blockchain-api.herokuapp.com/v1/transactions?startDate=2018-11-09T05:45:30.779970Z&endDate=2019-11-09T05:45:40.779970Z)

- [GET v1/transactions/:hash](https://upvest-blockchain-api.herokuapp.com/v1/transactions/9a9000f4f9740bc47402e717d3b73c47f2f326b67f48621e930c546496a5fb61): Get a specific transaction and its respective data. Just replace the :hash parameter with the desired transaction hash.

- [GET v1/blocks](https://upvest-blockchain-api.herokuapp.com/v1/blocks): Get a list of all blocks available. Has a list of queries available:
    - page (default 1): set the page to access in a catalogue list (https://upvest-blockchain-api.herokuapp.com/v1/blocks?page=1)
    - limit (default 30): set the limit of records to be return in a single page (https://upvest-blockchain-api.herokuapp.com/v1/blocks?limit=30) 
    - sortBy (default 1): set the sorting of the records ascending (as 1) or descending (as 0) (https://upvest-blockchain-api.herokuapp.com/v1/blocks?sortBy=1)

- [GET v1/blocks/:hash](https://upvest-blockchain-api.herokuapp.com/v1/blocks/0x440be8bedf080e8a27e811bc86cf4a736520968be0f8911b5649d5d2fc125c8a): Get a specific block and its respective data. Just replace the :hash parameter with the desired block hash.

- [GET v1/addresses](https://upvest-blockchain-api.herokuapp.com/v1/addresses): Get a list of all addresses available. Has a list of queries available:
    - page (default 1): set the page to access in a catalogue list (https://upvest-blockchain-api.herokuapp.com/v1/addresses?page=1)
    - limit (default 30): set the limit of records to be return in a single page (https://upvest-blockchain-api.herokuapp.com/v1/addresses?limit=30) 
    - sortBy (default 1): set the sorting of the records ascending (as 1) or descending (as 0) (https://upvest-blockchain-api.herokuapp.com/v1/addresses?sortBy=1)

- [GET v1/addresses/:hash](https://upvest-blockchain-api.herokuapp.com/v1/addresses/0x5ba27c6227f809c650a9c2bef9d6705b9e9d6fe7): Get a specific address and its respective data. Just replace the :hash parameter with the desired address hash.

- [GET v1/addresses/balance/:hash](https://upvest-blockchain-api.herokuapp.com/v1/addresses/balance/0x5ba27c6227f809c650a9c2bef9d6705b9e9d6fe7): Get the balance from a specific address. Just replace the :hash parameter with the desired address hash.

- [GET v1/contracts](https://upvest-blockchain-api.herokuapp.com/v1/contracts): Get a list of all contracts available. Has a list of queries available:
    - page (default 1): set the page to access in a catalogue list (https://upvest-blockchain-api.herokuapp.com/v1/contracts?page=1)
    - limit (default 30): set the limit of records to be return in a single page (https://upvest-blockchain-api.herokuapp.com/v1/contracts?limit=30) 
    - sortBy (default 1): set the sorting of the records ascending (as 1) or descending (as 0) (https://upvest-blockchain-api.herokuapp.com/v1/contracts?sortBy=1)

- [GET v1/contracts/:hash](https://upvest-blockchain-api.herokuapp.com/v1/contracts/0x20fe562d797a42dcb3399062ae9546cd06f63280): Get a specific contract and its respective data. Just replace the :hash parameter with the desired contract hash.

- [GET v1/contracts/balance/:hash](https://upvest-blockchain-api.herokuapp.com/v1/contracts/balance/0x20fe562d797a42dcb3399062ae9546cd06f63280): Get the balance from a specific contract. Just replace the :hash parameter with the desired contract hash.

## Considerations upon criterias

- Resilience (e.g. what happens if an error occurs?)

> For this criteria, some middlewares and errors were set (i.e. generic handler) to cover the most important errors, such as 404, 400 and 500.

- Performance (e.g. are there bottlenecks that can be identified without even load testing the application?)

> Just by looking through the Mongoose models, controllers and migrations, one could be able to see possible mistreated errors (e.g. I/O requests that are not wrapped on try/catches), long database queries or requests (i.e. migrations not using batches).

- Clarity (e.g. can I just open the project and get a good insight on the application structure? Is there clear intent in function names?)

> Following a model-controller architecture, the main part of the API is well-structured and was designed to have the responsibilities well-segmented. Thinking already about scalability, the application is organized into routes and versions, allowing to evolve it in a relative easy way (the counterpoint on this is the need to replicate multiple controller, model and routes files).

- Security (e.g. are there ways that the public API could be abused?)

> Despite not having a token authentication system (e.g. OAuth), its edges are considerably well-covered through the usage of DDoS blockers as well as a whitelist to block/allow certain addresses, complementing the CORS rules.

- Knowledge of the chosen language (e.g. do you demonstrate knowledge of core libraries, and idiomatic coding constructs?)

> In terms of syntax and patterns, it's thought to use the modern functionalities (i.e. arrow functions, async/await), but some parts could've been better, especially in terms of callbacks and promises.

- Usage of dependencies (e.g. is it worth pulling in an entire package just for a single function?)

> In that term, the planning phase considered using the less quantity of resources as possible, handling the most possible through custom functions or leveraging what the existent libraries can offer (e.g. transaction timestamps verifications done with MongoDB own APIs instead of pulling Moment library).

- Commit history (e.g. are commit messages clear? does each commit represent a unique and individual change?)

> For any type of project, it's always planned to summarize the goal of the commits, as well as uniting files inside one commit that represent a specific standalone functionality or module.

## Bottlenecks and Problems

Some issues were faced throughout the development period and were partially or not resolved. Below some explanations can be found for the issues discovered:

1\. **Migration problems:** through the usage of Mongoose APIs, the CSV files provided were properly manipulated and inserted through separated migrations. However, due to the broadness location of some important information (e.g. timestamp for transactions located in the balance file), this data manipulation were elaborated in a first glance through multiple updates, which aren't the best performatic. This was perceived when running through the approximate 400k+ lines inside the ETH balance CSV file, process errors which were not properly handled and can be seen below:

```bash
(node:12078) UnhandledPromiseRejectionWarning: MongoError: pool is draining, new operations prohibited
    at Pool.write (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/core/connection/pool.js:845:8)
    at _command (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/core/wireprotocol/command.js:120:10)
    at command (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/core/wireprotocol/command.js:26:5)
    at Object.query (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/core/wireprotocol/query.js:57:3)
    at Server.query (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/core/topologies/server.js:639:16)
    at FindOperation.execute (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/operations/find.js:24:12)
    at topology.selectServer (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/operations/execute_operation.js:163:17)
    at Server.selectServer (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/core/topologies/server.js:827:3)
    at Server.selectServer (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/topologies/topology_base.js:363:32)
    at executeWithServerSelection (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/operations/execute_operation.js:150:12)
    at executeOperation (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/operations/execute_operation.js:81:16)
    at Cursor._initializeCursor (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/core/cursor.js:545:7)
    at Cursor._initializeCursor (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/cursor.js:191:11)
    at nextFunction (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/core/cursor.js:748:10)
    at Cursor._next (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/core/cursor.js:202:5)
    at nextObject (/home/kawasaki/Git/tests/upvest-test/node_modules/mongodb/lib/operations/common_functions.js:235:10)
```

2\. **Unhandled promises:** some functions weren't properly written with try/catch wrappers, especially inside async/await ones, or even some promises were unhandled, which resulted in the following unpredictable errors (or even crash the whole application, unfortunately):

```bash
(node:12078) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)

(node:12078) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 16)

(node:12078) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

3\. **Contract balance calculation**: this might be lack of know-how with blockchain topics, but the total calculation for each contract were zero. Although it might raise a red flag upon a wrong calculation logic, a brief look over transactions associated to a specific contract (as it can be seen on an example in the [website Etherscan](https://ropsten.etherscan.io/txs?a=0xe12aea94b74eee8a2504e9f26c7f64c2c09e66be), where the contract *0xe12Aea94b74EEE8a2504E9f26c7f64c2c09E66BE* has a balance of zero with all transactions being moved with a value of zero ETH) can show that these results might not being tampered or wrong.

4\. **Lack of relationships between models**: due to the NoSQL-paradigm choice to store the CSV data and also to time constraints, a decision was made upon leveraging the full power of NoSQL relational databases, where the data can be replicated (e.g. blocks and transactions hashes) as long it makes sense to publish in production. In terms of scalability, on the other hand, some of these relations would be set in stone instead of denying the data integrity.

5\. **Modularity**: some controllers have almost the same code methods, which could be refactored into a *BaseController* (i.e. something similar to [this](https://github.com/conteumconto/api.conteumconto.com/blob/master/src/controllers/Base.Controller.js)) and afterwards be inherited by all of them, reusing code and making it more mainteanable.

## How to Run

- Make sure you have NodeJS 8.15.1+ and npm installed:

```bash
node -v  # v8.15.1
npm -v   # 6.4.1
```

- Install the libraries used in the project:

```bash
npm i
```

- Make sure you have MongoDB installed on your computer before running the necessary migrations:

```bash
npm run migrations
```

- Start the development application on port 3000:

```bash
npm start
```