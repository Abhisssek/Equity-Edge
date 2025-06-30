const axios = require('axios');
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

const getLivePriceFromFinancialData = async (symbol) => {
  if (!symbol) {
    console.error('No symbol provided for fetching live price');
    return null;
  }

  const formattedSymbol = symbol.toUpperCase();
  // console.log(`Fetching live price for symbol: ${formattedSymbol}`);

  try {
    const options = {
      method: 'GET',
      url: 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules',
      params: { ticker: formattedSymbol, module: 'financial-data' },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);

    const price = response.data?.body?.currentPrice?.raw;

    if (!price) {
      console.warn(`Price not found in API response for ${formattedSymbol}`);
    } 

    return price || null;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}: ${error.message}`);
    return null;
  }
};

module.exports = getLivePriceFromFinancialData;
