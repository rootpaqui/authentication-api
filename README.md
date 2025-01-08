# authentication-api

A simple REST api for authentication based on JWT.

## Prerequisites

+ Node JS installed
+ MySQL, PostgreSQL or any SQL database installed

## Installation

1. Clone the repository:
    ```bash
   git clone https://github.com/rootpaqui/authentication-api.git
    ```
2. Navigate to the project directory:
    ```bash
    cd authentication-api
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Project setup 

1. Duplicate the `.env.example` file and rename it into `.env`

2. Setup environnement variables in the `.env`:
    + You can set the `PORT` variable with your own. By default it is set to 3000

    + Replace database variables value with your actual database configurations and credentials.

    + The value of `DATABASE_DIALECT` should be one of the following based on the database you are using:
      + mysql
      + postgres
      + sqlite
      + mariadb
      + mssql
      + db2
      + snowflake
      + oracle

    + Generate the tokens values by running:
      ```bash
      npm run key:generate
      ```
      Copy and paste the values for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` variables
    
    + Run the database migrations:
      ```bash
      npm run sequelize:migrate
      ```
      > **Note:** If you have not already create your database, run `npx sequelize db:create` before running the migrations.

## Usage
After setting up the project, you can start the application by running:
```
npm run start
```
**For a list of available API endpoints, see [API Documentation](https://documenter.getpostman.com/view/39167456/2sAY55Zd1h).**
