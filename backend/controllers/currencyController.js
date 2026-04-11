const axios = require('axios');

// @desc    Convert currency
// @route   GET /api/currency/:from/:to/:amount
// @access  Private
exports.convertCurrency = async (req, res) => {
    try {
        const { from, to, amount } = req.params;
        const apiKey = process.env.EXCHANGE_RATE_API_KEY;

        if (!apiKey) {
            // Fallback for simple testing if key is missing (optional)
            return res.status(500).json({ message: 'Currency conversion service key is missing.' });
        }

        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`;
        const response = await axios.get(url);

        if (response.data.result === 'success') {
            res.status(200).json({
                base: from,
                target: to,
                amount: parseFloat(amount),
                convertedAmount: response.data.conversion_result,
                rate: response.data.conversion_rate,
                lastUpdate: response.data.time_last_update_utc
            });
        } else {
            res.status(400).json({ message: 'Currency conversion failed.' });
        }
    } catch (error) {
        console.error('Currency Conversion Error:', error.message);
        res.status(500).json({ message: 'Server error during currency conversion.' });
    }
};
