const router = require('express').Router();

const testCustomerId = "cus_JQu0AS1oVEbkZ5";

const createToken = (cardNumber,cvv,expMonth,expYear) => {
	const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
	// Card object
	let card = {
		number: cardNumber,
	    exp_month: expMonth,
	    exp_year: expYear,
	    cvc: cvv
	};

	return new Promise( async(resolve,reject) => {
		const token = await Stripe.tokens.create({ card: card }, (err,result) => {
			if(err) {
				let error = err.message ?? "Payment failed.";
				resolve(error);
			} else {
				resolve(result);
			}
		});
	})
}

router.post('/get_customer' , async(req,res) => {

	const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

	let customerId = req.body.customer_id != undefined ? req.body.customer_id : "";

	if( customerId !== undefined && customerId !== "" && customerId !== null ) {
		const customer = await stripe.customers.retrieve(customerId,(err,customer) => {
			if(err) {
				let errorMessage = err.message ?? "Invalid ID.";
				return res.send(errorMessage)
			}
			res.send(customer);
		});
	} else {
		res.send("Invalid ID.");
	}
})

router.post('/create' , async(req,res) => {

	const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

	let email 		= req.body.email !== undefined ? unescape(req.body.email) : "";
	let name 		= req.body.name !== undefined ? unescape(req.body.name) : "";
	let phone 		= req.body.phone !== undefined ? unescape(req.body.phone) : "";
	let address 	= req.body.address !== undefined ? req.body.address : "";
	let description = req.body.description !== undefined ? unescape(req.body.description) : "";
	let cardDetails = req.body.card_details !== undefined ? req.body.card_details : {};

	let customerObject = {
		'email' 				: email,
		'name'  				: name,
		'phone' 				: phone,
		'description' 			: description,
		'address[line1]'		: address.line1,
		'address[line2]'		: address.line2,
		'address[city]'			: address.city,
		'address[state]'		: address.state,
		'address[postal_code]'	: address.postal_code,
		'address[country]'		: address.country,
	};
	if(Object.keys(cardDetails).length !== 0) {

		let cardNumber = "4242424242424242";
		let cvv= "123";
		let expMonth = "05";
		let expYear = "2023";

		const token = await createToken(cardNumber,cvv,expMonth,expYear);
		customerObject['source'] = token.id;
	}

	let customer = await stripe.customers.create(customerObject,(err,customer) => {
		if(err) {
			let errorMessage = err.message ?? "Failed to create customer.";
			console.log(err);
			return res.send(errorMessage);
		}
		/*
			let customerId = customer.id;
			console.log(customerId);
		*/
		res.send(customer);
	})
});

router.post('/delete' , async(req,res) => {

	const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

	let customerId = req.body.customer_id != undefined ? req.body.customer_id : "";

	if( customerId !== undefined && customerId !== "" && customerId !== null) {
		const deleted = await stripe.customers.del(customerId, (err,response) => {
			if(err) {
				let errorMessage = err.message ?? "Please try again.";
				return res.send(errorMessage);
			}
			res.send(response);
		});
	} else {
		res.send("Invalid ID.");
	}
})

router.post('/update', async(req,res) => {

	let stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

	let customerId = req.body.customer_id != undefined ? req.body.customer_id : "";

	if( customerId !== undefined && customerId !== "" && customerId !== null) {

		let email 		= req.body.email !== undefined ? unescape(req.body.email) : "";
		let name 		= req.body.name !== undefined ? unescape(req.body.name) : "";
		let phone 		= req.body.phone !== undefined ? unescape(req.body.phone) : "";
		let address 	= req.body.address !== undefined ? req.body.address : "";
		let description = req.body.description !== undefined ? unescape(req.body.description) : "";
		let cardDetails = req.body.card_details !== undefined ? req.body.card_details : {};

		let customerObject = {};
		if(email != "") customerObject['email'] = email;
		if(name != "") customerObject['name'] = name;
		if(phone != "") customerObject['phone'] = phone;
		if(description != "") customerObject['description'] = description;

		if(address !== undefined && address !== null) {

			if(address.line1 !== undefined && address.line1 !== null && address.line1) {
				customerObject['address[line1]'] = address.line1;
			}

			if(address.line2 !== undefined && address.line2 !== null && address.line2) {
				customerObject['address[line2]'] = address.line2;
			}

			if(address.city !== undefined && address.city !== null && address.city) {
				customerObject['address[city]'] = address.city;
			}

			if(address.state !== undefined && address.state !== null && address.state) {
				customerObject['address[state]'] = address.state;
			}

			if(address.postal_code !== undefined && address.postal_code !== null && address.postal_code) {
				customerObject['address[postal_code]'] = address.postal_code;
			}
		
			if(address.country !== undefined && address.country !== null && address.country) {
				customerObject['address[country]'] = address.country;
			}
		}

		/*
			let customerObject = {
				'email' 				: email,
				'name'  				: name,
				'phone' 				: phone,
				'description' 			: description,
				'address[line1]'		: address.line1,
				'address[line2]'		: address.line2,
				'address[city]'			: address.city,
				'address[state]'		: address.state,
				'address[postal_code]'	: address.postal_code,
				'address[country]'		: address.country,
			};
			console.log(customerObject);
		*/

		if(Object.keys(cardDetails).length !== 0) {

			let cardNumber = "4242424242424242";
			let cvv= "123";
			let expMonth = "05";
			let expYear = "2023";

			const token = await createToken(cardNumber,cvv,expMonth,expYear);
			customerObject['source'] = token.id;
		}

		const updateCustomer = await stripe.customers.update( customerId,customerObject, (err,customer) => {
			if(err) {
				let errorMessage = err.message ?? "Failed to update.";
				res.send(errorMessage);
			}
			res.send(customer);
		});
	} else {
		res.send("Invalid ID.");
	}
})

module.exports = router;