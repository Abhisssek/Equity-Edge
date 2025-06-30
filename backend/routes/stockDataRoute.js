const express = require('express');
const {
  getStockProfile,
  getFinancialData,
  getHistoricalData
} = require('../controllers/stockDataController');

const isAuth = require('../middleware/auth');
const router = express.Router();

// Public routes (no authentication needed)
router.get('/profile',isAuth, getStockProfile);          // ?symbol=TCS.NS&module=asset-profile
router.get('/financial',isAuth, getFinancialData);       // ?symbol=TCS.NS
router.get('/historical',isAuth, getHistoricalData);     // ?symbol=TCS.NS&interval=5m

module.exports = router;
