The repo contains the code for
backend Node.js API.

The API provide CRUD functionality
to interact with a user data stored in a file.

This API can be further integrated with MongoDB replacing the file.

Project Structure.
Node.js-API:.
│   Readme.md
│
└───uptime-monitor-backend-API
    │   index.js ->(Main File)
    │
    ├───.data
    │   ├───test
    │   └───users (files are stored in this folder)
    │           1234567892.json
    │           5551113332.json
    │           5551113343.json
    │
    ├───https ->(Contains all the certificates for a https server)
    │       cert.pem
    │       key.pem
    │       keyGeneration.txt
    │
    └───lib
            config.js   ->(launching port 3000 http and 5000 for https)
            data.js     ->(low level functions to interact with user files)
            handlers.js ->(CRUD functions for handlers)
            helpers.js  ->(contains a hash function for unique user id)
