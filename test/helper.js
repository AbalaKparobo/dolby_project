const server = require('../app');


after(async () => {
    server.close();
})