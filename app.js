// Import section
const express = require('express');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const path = require('path');

// Controller import section;
const customer = require('./controller/stripe_customer/customer');
const payment = require('./controller/stripe_payments/payment');
const stripeUtil = require('./controller/stripe_util/stripe_util');
const paymentIntent = require('./controller/stripe_payment_intent/payment_intent');
const refund = require('./controller/stripe_refund/refund');
const card = require('./controller/stripe_card/card');

// assign to variable
const app = express();

// static folders and usage's and port's';
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
const port = 3000 || process.env.PORT;

// view engine
app.set('views', './views');
app.set('view engine', 'ejs');

// split the code into MVC (Model - View - Controller) pattern;
app.use('/customer',customer);
app.use('/stripe',payment);
app.use('/util',stripeUtil);
app.use('/payment_intent',paymentIntent);
app.use('/refund',refund);
app.use('/card',card);

// For checking the payment intent in client side;
app.get('/', (req,res) => {
	res.render('stripe_payment_intent');
})

app.get('/success', (req,res) => {
	res.render('success');
})

app.get('/failure', (req,res) => {
	res.render('failure');
})

/*
// check mongodb connection;
app.get('/check', (req,res) => {
	const MongoClient = require('mongodb').MongoClient;
	const uri = "mongodb+srv://fakeApisAdmin:balkeesh@mern.0zgaj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
	  const collection = client.db("fakeapis").collection("users");
	  console.log(collection);
	  client.close();
	  res.end("Success");
	});
})
*/

// server listening
app.listen(port,() => {
  console.log(`Server is listening on port ${port}`);
})
