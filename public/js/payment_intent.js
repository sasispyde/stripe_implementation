const stripePublicKey = "pk_test_51InCu2SAnsNkWaYCMOz9NS3OvOmFDwWBadEAygBvDLqysjkp75bFIEUR0x1xPqlJWVOt5h82oFYbbyAPvyW4agGj00H2tJ4sP8";
var client_secret = "pi_1IoN0jSAnsNkWaYCeh5eKeCr_secret_DJegSlANunmSlj4W9tQ9Ndk4X";

var stripe = Stripe(stripePublicKey);
var elements = stripe.elements();
var cardElement = elements.create('card', {
	'classes' : {
		"base" : "card_container"
	}
});

cardElement.mount('#card-element');

const generate_payment = () => {
	stripe.confirmCardPayment(client_secret, {
	    payment_method: {
	      	card: cardElement
	    },
	    return_url: 'http://localhost:3000/success'
  	},{
  		handleActions : false
  	}).then(function(result) {
  		if(result.paymentIntent){
	    	var action = result.paymentIntent.next_action;
	    	console.log(action);
			if (action && action.type === 'redirect_to_url') {
			    window.location = action.redirect_to_url.url;
			}
  		}
  	}).catch((err) => {
  		console.log(err);
  	})
}