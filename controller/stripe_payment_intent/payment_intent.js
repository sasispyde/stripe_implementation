const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post("/create", async(req,res) => {

	let amount = ( req.body.amount !== undefined && !isNaN(req.body.amount) ) ? (req.body.amount * 100) : 0;
	let currency = req.body.currency !== undefined ? req.body.currency : "inr";
	let confirm = req.body.confirm !== undefined ? req.body.confirm : false;
	let customer_id = req.body.customer_id !== undefined ? req.body.customer_id : "";
	let description = req.body.description !== undefined ? req.body.description : "";
	let receipt_email = req.body.email !== undefined ? req.body.email : "";
	let payment_method_types = req.body.payment_method_types !== undefined ? req.body.payment_method_types : ['card'];

	let paymentIntentObject = {
		"amount" : amount,
		"currency" : currency,
		"payment_method_types" : payment_method_types
	}

	if(customer_id !== null && customer_id !== "") {
		paymentIntentObject['customer'] = customer_id;
	}
	if(receipt_email !== null && receipt_email !== "") {
		paymentIntentObject['receipt_email'] = receipt_email;
	}
	if(confirm !== null && confirm !== true) {
		paymentIntentObject['confirm'] = confirm;
	}

	await stripe.paymentIntents.create(paymentIntentObject, (err,paymentIntent) => {
		if(err) {
			let errorMessage = err.message ?? "Failed to create payment intent.";
			return res.send(errorMessage);
		}
		const { client_secret, id, amount } = paymentIntent;
		res.send(paymentIntent);
	})
})

router.post('/get_payment_intent', async(req,res) => {
	let paymentIntentId = req.body.paymenet_intent_id !== "undefined" ? req.body.paymenet_intent_id : "";

	if(paymentIntentId !== undefined) {
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId,(err,response) => {
			if(err) {
				let errorMessage = err.message ?? "Failed to reterive payment intent.";
				return res.send(errorMessage);
			}
			res.send(response);
		});
	} else {
		res.send("Inavlid ID.");
	}
})

router.post('/cancel', async(req,res) => {
	let paymentIntentId = req.body.paymenet_intent_id !== undefined ? req.body.paymenet_intent_id : "";
	let cancellation_reason = req.body.cancellation_reason !== undefined ? req.body.cancellation_reason : "";

	if(paymentIntentId !== "") {
		await stripe.paymentIntents.cancel(paymentIntentId, (err,response) => {
			if(err) {
				let errorMessage = err.message ?? "Failed to cancel payemnt intent";
				res.send(errorMessage);
			}
			res.send(response);
		})
	} else {
		res.send("Inavlid ID.");
	}
})

router.post("/update", async(req,res) => {

	let paymentIntentId = req.body.paymenet_intent_id !== undefined ? req.body.paymenet_intent_id : "";
	let amount = ( req.body.amount !== undefined && !isNaN(req.body.amount) ) ? (req.body.amount * 100) : 0;
	let currency = req.body.currency !== undefined ? req.body.currency : "inr";
	let confirm = req.body.confirm !== undefined ? req.body.confirm : false;
	let customer_id = req.body.customer_id !== undefined ? req.body.customer_id : "";
	let description = req.body.description !== undefined ? req.body.description : "";
	let receipt_email = req.body.email !== undefined ? req.body.email : "";
	let payment_method_types = req.body.payment_method_types !== undefined ? req.body.payment_method_types : ['card'];

	let paymentIntentObject = {
		"amount" : amount,
		"currency" : currency,
		"payment_method_types" : payment_method_types
	}

	if(customer_id !== null && customer_id !== "") {
		paymentIntentObject['customer'] = customer_id;
	}
	if(receipt_email !== null && receipt_email !== "") {
		paymentIntentObject['receipt_email'] = receipt_email;
	}
	if(confirm !== null && confirm !== true) {
		paymentIntentObject['confirm'] = confirm;
	}

	if(paymentIntentId !== "") {
		await stripe.paymentIntents.update('pi_1DoRqy2eZvKYlo2CctvKTojD', paymentIntentObject, (err,paymentIntent) => {
			if(err) {
				let errorMessage = err.message ?? "Failed to create payment intent.";
				return res.send(errorMessage);
			}
			res.send(paymentIntent);
		});
	} else {
		res.send("Invalid ID");
	}
})

router.post('/confirm' , (req,res) => {
	res.send("Success");
})

router.post('/capture' , (req,res) => {
	res.send("Success");
})

module.exports = router;