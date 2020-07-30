# Metamask Backend

Limitiations
- If the server is not running, it will not go back and get missing data
- Could have the server check what the most recent block number and load all missing data on GET blocks call.

How to Run Server:
Initial Postgres DB from db/init.sql
node app.js