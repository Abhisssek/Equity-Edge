const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDB = require('./database/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());




const userRoute = require('./routes/userRoute');
const tradeRoute = require('./routes/tradeRoute');
const stockDataRoute = require('./routes/stockDataRoute');
app.use('/api/v1/user', userRoute);
app.use('/api/v1/trade', tradeRoute);
app.use('/api/v1/stocks', stockDataRoute);


connectDB()
const PORT = process.env.PORT || 5000;





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
