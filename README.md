# Recruitify

## New developer guide

This is a guide that all new Recruitify developers must follow to setup their development environment.

### Installing dependencies

Installs all NPM dependencies

```bash
npm install
```

### Starting services

Starts MariaDB in a Docker container.

```bash
docker-compose up -d
```

### Running migrations

This creates database schema.

```bash
adonis migration:run
```

### Inserting test data

Inserting test data

```bash
mysql -u root -p -h 127.0.0.1 recruitify < database/testdata.sql
```

### Booting HTTP server

Starts the HTTP server at localhost:3333.

```bash
adonis serve --dev
```

## API documentation

(Link to the documentation)[/API.md]

## Production

The service is deployed as an Heroku app. Please ask Fredrik for login.
