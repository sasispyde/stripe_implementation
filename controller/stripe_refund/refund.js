const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('charge_id/create/', async(req,res) => {
	let charge_id = req.body.charge_id !== undefined ? unescape(req.body.charge_id) : "";
	let amount = req.body.amount !== undefined ? unescape(req.body.amount) : "";
	let reason = req.body.reason !== undefined ? unescape(req.body.reason) : "";
	let refund_application_fee = req.body.refund_application_fee !== undefined ? req.body.refund_application_fee : false;

	let refundObject = {
		charge : charge
	}

	if(amount !== "" && amount !== 0 && amount < 0) {
		refundObject['amount'] = amount;
	}
	if(reason !== "") {
		refundObject['reason'] = reason;
	}
	if(refund_application_fee !== "" && typeof refund_application_fee === "boolean") {
		refundObject['refund_application_fee'] = refund_application_fee;
	}

	if(charge_id !== "") {
		await stripe.refunds.create(refundObject, (err, response) => {
			if(err) {
				let errorMessage = err.message ?? "Failed to refund.";
				return res.send(errorMessage);
			}
			res.send(response);
		})
	} else {
		res.send("Invalid ID");
	}
})

router.post('payment_intent/create/', async(req,res) => {
	
	let payment_intent = req.body.payment_intent_id !== undefined ? unescape(req.body.payment_intent_id) : "";
	let amount = req.body.amount !== undefined ? unescape(req.body.amount) : "";
	let reason = req.body.reason !== undefined ? unescape(req.body.reason) : "";
	let refund_application_fee = req.body.refund_application_fee !== undefined ? req.body.refund_application_fee : false;

	let refundObject = {
		payment_intent : payment_intent
	}

	if(amount !== "" && amount !== 0 && amount < 0) {
		refundObject['amount'] = amount;
	}
	if(reason !== "") {
		refundObject['reason'] = reason;
	}
	if(refund_application_fee !== "" && typeof refund_application_fee === "boolean") {
		refundObject['refund_application_fee'] = refund_application_fee;
	}

	if(payment_intent !== "") {
		await stripe.refunds.create(refundObject, (err, response) => {
			if(err) {
				let errorMessage = err.message ?? "Failed to refund.";
				return res.send(errorMessage);
			}
			res.send(response);
		})
	} else {
		res.send("Invalid ID");
	}
})

router.post('/get_refund' , async(req,res) => {
	let refundId = req.body.refund_id !== undefined ? req.body.refund_id : "";

	if(refundId !== "") {
		await stripe.refunds.retrieve(refundId, (err,refundObject) => {
			if(err) {
				let errorMessage = err.message ?? "Failed to get refund object.";
				return res.send(errorMessage);
			}
			res.send(refundObject);
		});
	} else {
		res.send("Invalid ID.");
	}
})

router.post('/update', async(req,res) => {

	let refundId = req.body.refund_id !== undefined ? req.body.refund_id : "";
	let metaData = req.body.metaData !== undefined ? req.body.metaData : "";

	if(refundId !== "" && typeof metaData == "object") {
		const refund = await stripe.refunds.update(refundId,{metadata: metaData},(err,refundObject) => {
			if(err) {
				let errorMessage = err.message ?? "Failed to get refund object.";
				return res.send(errorMessage);
			}
			res.send(refundObject);
		});
	} else {
		res.send("Invalid ID.");
	}
})

module.exports = router;