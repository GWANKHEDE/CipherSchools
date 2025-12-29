const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectMongoDB } = require('./config/db');
const { AppError } = require('./utils/errorHandler');
const { globalErrorHandler } = require('./utils/errorHandler');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/execute', require('./routes/execution'));
app.use('/api/hint', require('./routes/hints'));

app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

connectMongoDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
