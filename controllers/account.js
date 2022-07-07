const asyncWraper = require('../middleware/asyncWraper');
const Payment = require('../models/payment');


module.exports.getAllProducts = asyncWraper(async (req, res, next) => {
    let { body: { ID, Amount, Currency, CustomerEmail, SplitInfo } } = req;

    if (SplitInfo.length < 1 && SplitInfo > 20) {
        throw new Error;
    }

    const payment = await Payment.create({ _id: ID, Amount, Currency, CustomerEmail, SplitInfo });


    let Balance = Amount;
    let SplitBreakdown = [];
    SplitInfo = SplitInfo || []

    sortedData = SplitInfo.sort((a, b) => {
        let fa = a.SplitType.toLowerCase(),
            fb = b.SplitType.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });


    const ratioData = sortedData.filter((name) => name.SplitType.toUpperCase() === 'RATIO');

    let BalanceAfterSplit = 0

    for (let i = 0; i < sortedData.length; i++) {
        if (sortedData[i].SplitType.toUpperCase() === "FLAT") {
            Balance = Balance - sortedData[i].SplitValue;
            let obj = { SplitEntityId: sortedData[i].SplitEntityId, Amount: sortedData[i].SplitValue };
            SplitBreakdown.push(obj);
        }
        else if (sortedData[i].SplitType.toUpperCase() === "PERCENTAGE") {
            let SplitAmount = (sortedData[i].SplitValue / 100) * Balance;
            Balance = Balance - SplitAmount;
            let obj = {
                SplitEntityId: sortedData[i].SplitEntityId,
                Amount: SplitAmount > Balance && SplitAmount === 0 ? 0 : SplitAmount
            };
            SplitBreakdown.push(obj);
        }
        else if (ratioData.length > 1) {
            if (sortedData[i].SplitType.toUpperCase() === "RATIO") {
                const totalRatio = ratioData.reduce((n, { SplitValue }) => n + SplitValue, 0);
                let ratioBalance = BalanceAfterSplit || Balance;
                let SplitAmount = (sortedData[i].SplitValue / totalRatio) * Balance;
                BalanceAfterSplit = ratioBalance - SplitAmount;
                let obj = { SplitEntityId: sortedData[i].SplitEntityId, Amount: SplitAmount > Balance && SplitAmount === 0 ? 0 : SplitAmount };
                SplitBreakdown.push(obj);
            }
        }
    }
    Balance = BalanceAfterSplit
    if (Balance < 0) {
        Balance = 0
    }

    res.status(200).json({ ID: ID, Balance: Balance, SplitBreakdown: SplitBreakdown })
})

