const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createToken = (cardObject) => {

	let card_number = cardObject.card_number !== undefined ? cardObject.card_number : "";
	let exp_month = cardObject.exp_month !== undefined ? cardObject.exp_month : "";
	let exp_year = cardObject.exp_year !== undefined ? cardObject.exp_year : "";
	let cvc = cardObject.cvc !== undefined ? cardObject.cvc : "";
	let currency = cardObject.currency !== undefined ? cardObject.currency : "";
	let name = cardObject.name !== undefined ? cardObject.name : "";
	let address = cardObject.address !== undefined ? cardObject.address : "";

	// Card object
	let card = {
		number: card_number,
	    exp_month: exp_month,
	    exp_year: exp_year,
	    cvc: cvc,
	    currency : currency,
	    name : name,
	    address_line1 : address.line1,
	    address_line2 : address.line2,
	    address_city : address.city,
	    address_state : address.state,
	    address_zip : address.postal_code,
	    address_country : address.country
	};

	return new Promise( async(resolve,reject) => {
		const token = await stripe.tokens.create({ card: card }, (err,result) => {
			if(err) {
				let error = err.message ?? "Payment failed.";
				resolve(error);
			} else {
				resolve(result);
			}
		});
	})
}

router.post('/create', async(req,res) => {

	let cardObject = req.body;

	let customer_id = cardObject.customer_id !== undefined ? cardObject.customer_id : "";
	let default_card = cardObject.default_card !== undefined ? cardObject.default_card : false;

	let token = await createToken(cardObject);
	let tokenId = token.id;

	/*
		let tokenId = "card_1IoiPZSAnsNkWaYCD6zr682d";
		let card_number = cardObject.card_number !== undefined ? cardObject.card_number : "";
		let exp_month = cardObject.exp_month !== undefined ? cardObject.exp_month : "";
		let exp_year = cardObject.exp_year !== undefined ? cardObject.exp_year : "";
		let cvc = cardObject.cvc !== undefined ? cardObject.cvc : "";
		let currency = cardObject.currency !== undefined ? cardObject.currency : "";
		let name = cardObject.name !== undefined ? cardObject.name : "";
		let address = cardObject.address !== undefined ? cardObject.address : "";

		// Card object
		let card = {
			number: card_number,
		    exp_month: exp_month,
		    exp_year: exp_year,
		    cvc: cvc,
		    currency : currency,
		    name : name,
		    address_line1 : address.line1,
		    address_line2 : address.line2,
		    address_city : address.city,
		    address_state : address.state,
		    address_zip : address.postal_code,
		    address_country : address.country
		};
		
		card.object = "card";
	*/

	await stripe.customers.createSource(customer_id, { source : tokenId }, async(err,card) => {
		if(err) {
			return res.send(err.message ?? "Failed to create card.");
		}
		if(default_card) {
			let customerObject = {
				default_source : card.id
			}
			const updateCustomer = await stripe.customers.update( customer_id, customerObject, (err,customer) => {
				if(err) {
					let errorMessage = err.message ?? "Failed to update.";
					res.send(errorMessage);
				}
				res.send(card);
			});
		} else {
			res.send(card);
		}
	});
})

router.post('/get_card' , async(req,res) => {

	let customer_id = req.body.customer_id !== undefined ? req.body.customer_id : "";
	let card_id = req.body.card_id !== undefined ? req.body.card_id : "";

	const card = await stripe.customers.retrieveSource(customer_id,card_id, (err,response) => {
		if(err) {
			return res.send(err.message ?? "Failed yo get your card.");
		}
		res.send(response)
	});
})

router.post('/delete' , async(req,res) => {

	let customer_id = req.body.customer_id !== undefined ? req.body.customer_id : "";
	let card_id = req.body.card_id !== undefined ? req.body.card_id : "";

	const deleted = await stripe.customers.deleteSource(customer_id,card_id, (err,response) => {
		if(err) {
			return res.send(err.message ?? "Failed yo get your card.");
		}
		res.send(response)
	});
})

router.post('/update', async(req,res) => {

	let cardObject = req.body;
	let customer_id = cardObject.customer_id !== undefined ? cardObject.customer_id : "";
	let card_id = cardObject.card_id !== undefined ? cardObject.card_id : "";
	let exp_month = cardObject.exp_month !== undefined ? cardObject.exp_month : "";
	let exp_year = cardObject.exp_year !== undefined ? cardObject.exp_year : "";
	let cvc = cardObject.cvc !== undefined ? cardObject.cvc : "";
	let currency = cardObject.currency !== undefined ? cardObject.currency : "";
	let name = cardObject.name !== undefined ? cardObject.name : "";
	let address = cardObject.address !== undefined ? cardObject.address : "";

	// Card object
	let card = {
	    exp_month: exp_month,
	    exp_year: exp_year,
	    name : name,
	    address_line1 : address.line1,
	    address_line2 : address.line2,
	    address_city : address.city,
	    address_state : address.state,
	    address_zip : address.postal_code,
	    address_country : address.country
	};

	await stripe.customers.updateSource(customer_id,card_id,card, (err,resposne) => {
		if(err) {
			return res.send(err.message ?? "Failed to upadte.");
		}
		re.send(resposne);
	});
})

module.exports = router;