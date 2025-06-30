const getLivePriceFromFinancialData = require('../utils/stockApi');
const User = require('../models/userSchema');
const Trade = require('../models/tradeSchema');

exports.buyStockAStock = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid symbol or quantity' });
    }

    const price = await getLivePriceFromFinancialData(symbol);
    if (!price || isNaN(price)) {
      return res.status(400).json({ error: 'Unable to fetch stock price' });
    }

    const totalCost = parseFloat((price * quantity).toFixed(2));
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.virtualBalance < totalCost) {
      return res.status(400).json({ error: 'Insufficient virtual balance' });
    }

    const { symbols, quantities, avgPrices } = user.portfolio;
    const index = symbols.indexOf(symbol);

    if (index !== -1) {
      const existingQty = quantities[index];
      const existingAvg = avgPrices[index];
      const newQty = existingQty + quantity;
      const newAvg = parseFloat(
        ((existingAvg * existingQty + price * quantity) / newQty).toFixed(2)
      );
      user.portfolio.quantities[index] = newQty;
      user.portfolio.avgPrices[index] = newAvg;
    } else {
      user.portfolio.symbols.push(symbol);
      user.portfolio.quantities.push(quantity);
      user.portfolio.avgPrices.push(parseFloat(price.toFixed(2)));
    }

    user.virtualBalance = parseFloat((user.virtualBalance - totalCost).toFixed(2));

    // Recalculate totalValueOfStock
    user.portfolio.totalValueOfStock = user.portfolio.quantities.reduce((total, qty, i) => {
      return total + qty * user.portfolio.avgPrices[i];
    }, 0);
    user.portfolio.totalValueOfStock = parseFloat(user.portfolio.totalValueOfStock.toFixed(2));

    await user.save();

    // Log trade
    await Trade.create({
      userId,
      symbol,
      quantity,
      price,
      type: 'buy',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return res.status(200).json({
      message: `Successfully bought ${quantity} shares of ${symbol}`,
      currentBalance: user.virtualBalance,
      portfolio: user.portfolio
    });
  } catch (error) {
    console.error('Buy stock error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.sellStockAStock = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid symbol or quantity' });
    }

    const price = await getLivePriceFromFinancialData(symbol);
    if (!price || isNaN(price)) {
      return res.status(400).json({ error: 'Unable to fetch stock price' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { symbols, quantities, avgPrices } = user.portfolio;
    const index = symbols.indexOf(symbol);

    if (index === -1 || quantities[index] < quantity) {
      return res.status(400).json({ error: 'Insufficient shares to sell' });
    }

    if (quantities[index] === quantity) {
      symbols.splice(index, 1);
      quantities.splice(index, 1);
      avgPrices.splice(index, 1);
    } else {
      quantities[index] -= quantity;
    }

    const totalProceeds = parseFloat((price * quantity).toFixed(2));
    user.virtualBalance = parseFloat((user.virtualBalance + totalProceeds).toFixed(2));

    // Recalculate totalValueOfStock
    user.portfolio.totalValueOfStock = user.portfolio.quantities.reduce((total, qty, i) => {
      return total + qty * user.portfolio.avgPrices[i];
    }, 0);
    user.portfolio.totalValueOfStock = parseFloat(user.portfolio.totalValueOfStock.toFixed(2));

    await user.save();

    // Log trade
    await Trade.create({
      userId,
      symbol,
      quantity,
      price,
      type: 'sell',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return res.status(200).json({
      message: `Successfully sold ${quantity} shares of ${symbol}`,
      currentBalance: user.virtualBalance,
      portfolio: user.portfolio
    });
  } catch (error) {
    console.error('Sell stock error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json({
      message: 'Portfolio retrieved successfully',
      portfolio: user.portfolio,
      virtualBalance: user.virtualBalance
    });
  } catch (error) {
    console.error('Get portfolio error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol } = req.body;

    if (!symbol) return res.status(400).json({ error: 'Stock symbol is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.watchlist.includes(symbol)) {
      return res.status(400).json({ error: 'Stock already in watchlist' });
    }

    user.watchlist.push(symbol);
    await user.save();

    return res.status(200).json({
      message: `Successfully added ${symbol} to watchlist`,
      watchlist: user.watchlist
    });
  } catch (error) {
    console.error('Add to watchlist error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol } = req.body;

    if (!symbol) return res.status(400).json({ error: 'Stock symbol is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const index = user.watchlist.indexOf(symbol);
    if (index === -1) {
      return res.status(400).json({ error: 'Stock not in watchlist' });
    }

    user.watchlist.splice(index, 1);
    await user.save();

    return res.status(200).json({
      message: `Successfully removed ${symbol} from watchlist`,
      watchlist: user.watchlist
    });
  } catch (error) {
    console.error('Remove from watchlist error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json({
      message: 'Watchlist retrieved successfully',
      watchlist: user.watchlist
    });
  } catch (error) {
    console.error('Get watchlist error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.addAmountToVirtualBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.virtualBalance = parseFloat((user.virtualBalance + amount).toFixed(2));
    await user.save();

    return res.status(200).json({
      message: `Successfully added ${amount} to virtual balance`,
      currentBalance: user.virtualBalance
    });
  } catch (error) {
    console.error('Add amount error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Optional: get user's trade history
exports.getUserTrades = async (req, res) => {
  try {
    const userId = req.user.id;
    const trades = await Trade.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ trades });
  } catch (error) {
    console.error('Get trades error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
