const express = require('express');

const app = express();
const PORT = process.env.PORT || 9090




app.listen(PORT, err => {
    err? console.log(err) : console.log("Start server on port " + PORT)
})