const express = require('express');
const {  getPortfolio, buyStockAStock, sellStockAStock, addToWatchlist, removeFromWatchlist, addAmountToVirtualBalance, getWatchlist } = require('../controllers/tradeController');
const router = express.Router();
const authenticateUser = require('../middleware/auth');
const { getRealTimePortfolioAnalysis } = require('../controllers/portfolioAnalysisController');


// router.get('/stock-value', getAStockPrice);
router.get('/portfolio', authenticateUser, getPortfolio);
router.post('/buy', authenticateUser, buyStockAStock);
router.post('/sell', authenticateUser, sellStockAStock);

// Watchlist Routes
router.get('/watchlist', authenticateUser, getWatchlist);
router.post('/watchlist/add', authenticateUser, addToWatchlist);
router.post('/watchlist/remove', authenticateUser, removeFromWatchlist);

// Virtual Balance Route
router.post('/virtual-balance/add', authenticateUser, addAmountToVirtualBalance);
router.get('/portfolio/analysis', authenticateUser, getRealTimePortfolioAnalysis);



module.exports = router;