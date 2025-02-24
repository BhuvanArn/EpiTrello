# EpiTrello

EpiTrello is a web application that allows users to manage their tasks in a board. It was developed as a project to simulate professionnal work for EPITECH.

## Server

The server is a REST API developed with Node.js and Express. It uses a PostgreSQL database to store the data.

## Client

The client is a web application developed with React.

## Requirements

- Node.js
- PostgreSQL
- Docker (optional)

You must have multiples environment variables set in a `.env` file at the root of the project:

```
POSTGRES_DB=your_database
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=your_host
POSTGRES_PORT=your_postgres_port
CLIENT_PORT=yout_client_port
SERVER_PORT=your_server_port
```

In the client directory, you must have a `.env` file with the following content:

```markdown
REACT_APP_API_URL=the_url_of_your_server
PORT=your_client_port

<!-- secrets vars -->
REACT_APP_GOOGLE_CLIENT_ID=the_google_client_id
REACT_APP_GOOGLE_CLIENT_SECRET=the_google_client_secret
```

In the server directory, you must have a `.env` file with the following content:

```markdown
SERVER_PORT=your_server_port
POSTGRES_DB=your_database
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=your_host
POSTGRES_PORT=your_postgres_port
JWT_SECRET=the_jwt_secret

EMAIL_USER=epitrello.no.reply@gmail.com
EMAIL_PASSWORD=the_email_password
```

## Launch

To launch the full application, you must run the following commands:

```bash
docker-compose up
```

If you want to run the server and the client separately, you can run the following commands:

```bash
cd server
npm install
npm start
```

```bash
cd client
npm install
npm start
```

If launched without docker-compose, you will have to create the postgres database by yourself.

## Authors

- [Bhuvan Arnaud](bhuvan.arnaud@epitech.eu)
