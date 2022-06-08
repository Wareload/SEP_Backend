
# SEP Backend

Backend of the group "Bugs Bunnies" for the SEP of the "Hochschule Mannheim" in the summer semester 2022.


## Deployment

To deploy this project run

```bash
  npm run start
```

after calling the typescript compiler with the npm build command.

```bash
  npm run build
```

Alternative create a docker image and run it with docker compose.
A sample docker-compose file is [this](doc/full_docker-compose.yml).

Take care, you might not have access to the used docker registry and build an image.

To run this application there is also a mysql database needed.

This application is developed for a mysql flex database from Azure, so their ssl certificate has to be stored in cert and named "cert.pem"

To create a docker image execute

```bash
  docker build -t {registry}/{user}/{image-name}:version-tag .
```
 where registry and user are not necessary. 

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file


`DB_HOST`         as the mysql ip

`DB_PORT`         as the mysql port

`DB_USER`         as the mysql user

`DB_PASSWORD`     as the mysql password

`DB_DATABASE`     as the mysql used database

`AES_ENC_KEY`     as the aes encryption key

`AES_IV`          as the aes initial vector

## Testing 

This application uses "jest" as testing framework.

All tests can be run using:

```bash
  npm run test
```
