# SEP Backend

Backend of the group "Bugs Bunnies" for the SEP of the "Hochschule Mannheim" in the summer semester 2022.

## Deployment

To deploy this project run

```bash
  npm run start-ts
```

To run the typescript compiler run

```bash
  npm run build
```

To run the generated javascript project

```bash
  npm run start
```

For testing (jest framework) run

```bash
  npm run test
```

Alternative create a docker image and run it with docker compose.
A sample docker-compose file is [this](doc/full_docker-compose.yml).

Take care, you might not have access to the used docker registry and build an image.

To run this application there is also a mysql database needed with TLS.

This application is developed for a mysql flex database from Azure.

The required tables will be created on start.

To create a docker image execute

```bash
  docker build -t {registry}/{user}/{image-name}:version-tag .
```

where registry and user are not necessary. You need to call the typescript compiler first, because there is no
multistaged build yet.

or

```bash
  npm run build-docker
```

## Api

The Api is described [here](./swagger.yml).

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

#### Productive Environment

`DB_HOST`         as the mysql ip

`DB_PORT`         as the mysql port

`DB_USER`         as the mysql user

`DB_PASSWORD`     as the mysql password

`DB_DATABASE`     as the mysql used database

`AES_ENC_KEY`     as the aes encryption key

`AES_IV`          as the aes initial vector

`DEBUG`           to enable debug informations, e.g. backend.*

#### Testing Environment

`TEST_DB`         set for db testing

`DB_HOST`         as the mysql ip

`DB_PORT`         as the mysql port

`DB_USER`         as the mysql user

`DB_PASSWORD`     as the mysql password

`DB_DATABASE`     as the mysql used database

`DEBUG`           to enable debug informations, e.g. backend.*

