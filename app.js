const express = require('express');
const cors = require('cors');
const videoRoutes = require('./routes/videoRoutes');
const AWSConnect = require('./configs/awsConnection');

const app = express();
const PORT = process.env.PORT || 9090

app.use(cors());
app.use(express.json());

app.use("/api", videoRoutes);

app.listen(PORT, err => {
    // AWSConnect.connectS3();
    console.log( err || "Start server on port " + PORT)
})