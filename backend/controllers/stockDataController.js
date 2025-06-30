const axios = require('axios');
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// Get Stock Profile
exports.getStockProfile = async (req, res) => {
  const symbol = req.body.symbol;
  const module = req.body.module || 'asset-profile';

  if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

  const options = {
    method: 'GET',
    url: 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules',
    params: { ticker: symbol, module },
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error fetching stock profile: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get Financial Data
exports.getFinancialData = async (req, res) => {
  const symbol = req.body.symbol;

  if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

  const options = {
    method: 'GET',
    url: 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules',
    params: { ticker: symbol, module: 'financial-data' },
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error fetching financial data: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get Historical Data
exports.getHistoricalData = async (req, res) => {
  const symbol = req.body.symbol;
  const interval = req.body.interval || '5m';

  if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

  const options = {
    method: 'GET',
    url: 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history',
    params: { symbol, interval, diffandsplits: 'false' },
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error fetching historical data: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
