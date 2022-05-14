
# SEP Backend

Backend der Gruppe Bugs Bunnies für das SEP der Hochschule Mannheim im Sommersemester 2022.


## Deployment

To deploy this project run

```bash
  npm run start
```

after calling the typescript compiler 'tsc'.

Alternative create a docker image and run it with docker compose.
A sample docker-compose file is [this](doc/full_docker-compose.yml).

Take care, you might not have access to the used docker registry.

To run this application there is also a mysql database needed.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file


`DB_HOST`         as the mysql ip

`DB_PORT`         as the mysql port

`DB_USER`         as the mysql user

`DB_PASSWORD`     as the mysql password

`DB_DATABASE`     as the mysql used database

`AES_ENC_KEY`     as the aes encryption key

`AES_IV`          as the aes initial vector
