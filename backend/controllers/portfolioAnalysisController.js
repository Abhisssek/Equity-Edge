const getLivePriceFromFinancialData = require('../utils/stockApi');
const User = require('../models/userSchema');

exports.getRealTimePortfolioAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { symbols, quantities, avgPrices } = user.portfolio;
    const analysis = [];

    let totalInvested = 0;
    let totalCurrentValue = 0;

    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      const quantity = quantities[i];
      const avgPrice = avgPrices[i];

      const currentPrice = await getLivePriceFromFinancialData(symbol);

      if (!currentPrice || isNaN(currentPrice)) {
        analysis.push({
          symbol,
          error: 'Could not fetch current price'
        });
        continue;
      }

      const invested = parseFloat((avgPrice * quantity).toFixed(2));
      const currentValue = parseFloat((currentPrice * quantity).toFixed(2));
      const profit = parseFloat((currentValue - invested).toFixed(2));
      const profitPercent = parseFloat(((profit / invested) * 100).toFixed(2));

      totalInvested += invested;
      totalCurrentValue += currentValue;

      analysis.push({
        symbol,
        quantity,
        avgPrice,
        currentPrice,
        invested,
        currentValue,
        profit,
        profitPercent
      });
    }

    const totalProfit = parseFloat((totalCurrentValue - totalInvested).toFixed(2));
    const totalProfitPercent = parseFloat(((totalProfit / totalInvested) * 100).toFixed(2));

    return res.status(200).json({
      message: 'Real-time portfolio analysis',
      analysis,
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      totalCurrentValue: parseFloat(totalCurrentValue.toFixed(2)),
      totalProfit,
      totalProfitPercent
    });

  } catch (error) {
    console.error('Real-time portfolio analysis error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
