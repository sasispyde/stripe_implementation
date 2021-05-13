const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post("/pay/token", async(req,res) => {

	var capture = (req.body.capture !== undefined && typeof req.body.capture === "boolean") ? req.body.capture : true;

	let cardNumber 		= req.body.card_number !== undefined ? req.body.card_number : "4242424242424242";
	let cvv 			= req.body.cvc !== undefined ? req.body.cvc : "123";
	let expMonth 		= req.body.exp_month !== undefined ? req.body.exp_month : "05";
	let expYear 		= req.body.exp_year !== undefined ? req.body.exp_year : "2023";
	let amount 			= req.body.amount !== undefined ? req.body.amount : 1;
	let description 	= req.body.description !== undefined ? req.body.description : "";
	let idempotencyKey 	= uuidv4();

	let token = await createToken(cardNumber,cvv,expMonth,expYear);
	let tokenId = token.id;

	let chargeObject = {
		amount: amount * 100,
		currency: 'inr',
		source : tokenId,
		capture : capture,
		description: description
	}

	const charge = await stripe.charges.create(chargeObject,{ idempotencyKey : idempotencyKey }, (err,charge) => {
		if(err) {
			let error = err.message ?? "Payment Failed.";
			return res.send(error);
		}
		if(capture) {
			return res.send("Pre auth successfully completed");
		}
		return res.send("Payment completed");
	});
})

router.post("/pay/customer_id" , async(req,res) => {
	
	// get customer id from database;
	var customerId = "";

	var capture = (req.body.capture !== undefined && typeof req.body.capture === "boolean") ? req.body.capture : true;

	let chargeObject = {
		amount: amount * 100,
		currency: 'inr',
		customer: customerId,
		capture : capture,
		description: 'Payment using customer ID',
	}

	const charge = await stripe.charges.create(chargeObject,{ idempotencyKey : idempotencyKey }, (err,charge) => {
		if(err) {
			let error = err.message ?? "Payment Failed.";
			return res.send(error);
		}
		return res.send("Payment completed.");
	});
})

module.exports = router;