const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    virtualBalance: {
        type: Number,
        default: 0,
    },
    portfolio:{
        symbols: {
            type: [String],
            default: []
        },
        quantities: {
            type: [Number],
            default: []
        },
        avgPrices: {
            type: [Number],
            default: []
        },
        totalValueOfStock: {
            type: Number,
            default: 0
        }
    },
    watchlist: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;