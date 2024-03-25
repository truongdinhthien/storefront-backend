# Storefront Backend Project

This project contributes to the curriculum of the Udacity Full-Stack JavaScript Nanodegree program.

This repository includes [REQUIREMENT.md](REQUIREMENTS.md). This file defines the data that the API must provide to the frontend application, along with the expected formats for data exchanged between the front-end and back-end

## Built with

- **typeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **express**: Fast, unopinionated, minimalist web framework for Node.js.
- **pg**: Official PostgreSQL client library for Node.js
- **db-migrate**: Lightweight library designed to facilitate database migrations 
- **jasmine**: Behavior-driven development (BDD) testing framework for JavaScript.
- **dotenv**: Managing environment variables
- **Jsonwebtoken**: Popular library for creating, verifying, and managing JSON Web Tokens (JWTs)

## How to start

### Setup env

Clone the `.env.sample` file to `.env` and update the sensitive data that marked as `###`
```
## Environment
NODE_ENV=development

## SERVER
PORT=5500

## HASH PASSWORD
PASSWORD_HASH_SALT_ROUNDS=10
PASSWORD_HASH_SUFFIX=secret_suffix

## AUTH
SECRET_KEY=secretkey

## DATABASE
DB_USER=###
DB_HOST=###
DB_NAME=###
DB_PASSWORD=###
DB_PORT=###
DB_SSL=false

## DATABASE TEST
DB_USER_TEST=###
DB_HOST_TEST=###
DB_NAME_TEST=###
DB_PASSWORD_TEST=###
DB_PORT_TEST=###
DB_SSL_TEST=false
```
**Note**: The `DB_SSL` setting typically defaults to `false` for local databases, but it should be set to true when deploying the application to the cloud.

### Development server

Run `npm run watch` for a dev server. By using `tsc-watch`, the server is automatically reload when file source is changed

### Build

Run `npm run build` to build the source code then run `npm run start` to start the server

### Running tests

Run `npm run test` to execute the test via `jasmine-ts`

### Migration

Run `npm run migration up` to run the migration files in `migrations` folder