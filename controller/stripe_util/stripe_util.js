const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// To get the current balance of an account; ( Admin account );
router.get('/current_balance', async(req,res) => {
	await stripe.balance.retrieve(function(err, balance) {
	  	if(err) {
			let error = err.message ?? "Payment failed.";
			return res.send(error);
	  	}
	  	return res.send(balance);
	});
})

module.exports = router;