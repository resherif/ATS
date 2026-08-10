const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');

const jobsRoute = require('./routes/jobRoutes');
const candidatesRoute = require('./routes/candidatesRoute');
const ApplicationsRoute = require('./routes/ApplicationsRoute');
app.use(express.json());
app.use(cors());
app.use('/jobs', jobsRoute);
app.use('/candidates',candidatesRoute);
app.use('/applications', ApplicationsRoute);
app.get('/', (req, res) => {
  res.status(200).json({ message: 'ATS Backend API is running successfully!' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
 })
 module.exports = app;