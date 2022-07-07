const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    _id: Number,
    Amount: {
        type: Number,
        min: [0, 'Amount cannot be less than zero'],
        required: [true, 'Amount is required']
    },
    Currency: {
        type: String,
        default: 'NGN',
        set(value) {
            return this.a;
        },
    },
    CustomerEmail: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    SplitInfo: [
        {
            SplitType: {
                type: String,
                uppercase: true,
                enum: {
                    values: ['FLAT', 'RATIO', 'PERCENTAGE'],
                    message: '{VALUE} is not supported'
                }
            },
            SplitValue: {
                type: Number,
                required: [true, 'SplitValue is required']
            },
            SplitEntityId: {
                type: String,
                required: [true, 'SplitEntityId is required']
            }
        },
    ]
}, { _id: false });

module.exports = mongoose.model('Payment', PaymentSchema);


