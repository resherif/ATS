const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');

const jobsRoute = require('./routes/jobRoutes');
const candidatesRoute = require('./routes/candidatesRoute');
const ApplicationsRoute = require('./routes/ApplicationsRoute');
app.use(express.json());
app.use(cors());
app.use('/api/jobs', jobsRoute);
app.use('/api/candidates',candidatesRoute);
app.use('/api/applications',ApplicationsRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
 })
 module.exports = app;