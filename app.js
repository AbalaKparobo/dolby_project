const express = require('express');
const cors = require('cors');
const createError = require('http-errors')

const videoRoutes = require('./routes/videoRoutes');

const app = express();
const PORT = process.env.PORT || 9090

app.use(cors());
app.use(express.json());

app.use("/v1/api", videoRoutes);

app.use(function(req, res, next) {
    next(createError(404));
  });

// error handler
app.use(function(err, req, res, next) {
    message = err.message;
    error = req.app.get("env") === "development" ? err : {};
    status = err.status || 500;
    message = error ? error : message
    res.status(status).send( message);
  });

const server =  app.listen(PORT, err => {
    console.log( err || "Start server on port " + PORT)
})

module.exports = server;