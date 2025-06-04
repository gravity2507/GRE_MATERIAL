// Google Pay configuration
const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
};

const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
        'gateway': 'example',
        'gatewayMerchantId': 'exampleGatewayMerchantId'
    }
};

const allowedCardNetworks = ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks
    }
};

const cardPaymentMethod = Object.assign(
    {tokenizationSpecification: tokenizationSpecification},
    baseCardPaymentMethod
);

let paymentsClient = null;

function initializeGooglePay(plan) {
    paymentsClient = new google.payments.api.PaymentsClient({
        environment: 'TEST' // Change to 'PRODUCTION' for live environment
    });
    
    const isReadyToPayRequest = Object.assign({}, baseRequest);
    isReadyToPayRequest.allowedPaymentMethods = [baseCardPaymentMethod];
    
    paymentsClient.isReadyToPay(isReadyToPayRequest)
        .then(function(response) {
            if (response.result) {
                createAndAddButton(plan);
            } else {
                console.log('Google Pay is not available');
            }
        })
        .catch(function(err) {
            console.error('Error checking Google Pay readiness:', err);
        });
}

function createAndAddButton(plan) {
    const buttonOptions = {
        onClick: function() {
            onGooglePaymentButtonClicked(plan);
        }
    };
    
    const button = paymentsClient.createButton(buttonOptions);
    document.getElementById('gpay-button').appendChild(button);
}

function onGooglePaymentButtonClicked(plan) {
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    
    // Set up payment details based on selected plan
    const price = plan === 'monthly' ? '9.99' : '49.99';
    const description = plan === 'monthly' ? '1 Month GRE Premium Access' : '6 Months GRE Premium Access';
    
    paymentDataRequest.transactionInfo = {
        totalPriceStatus: 'FINAL',
        totalPrice: price,
        currencyCode: 'USD',
        countryCode: 'US'
    };
    
    paymentDataRequest.merchantInfo = {
        merchantName: 'GRE Master',
        merchantId: 'BCR2DN4TXL66Y2XN' // Your merchant ID
    };
    
    paymentsClient.loadPaymentData(paymentDataRequest)
        .then(function(paymentData) {
            processPayment(paymentData, plan);
        })
        .catch(function(err) {
            console.error('Error processing payment:', err);
            alert('Payment failed. Please try again.');
        });
}

function processPayment(paymentData, plan) {
    // In a real app, you would send this to your server for processing
    console.log('Payment data:', paymentData);
    
    // For demo purposes, we'll just show a success message
    document.getElementById('payment-modal').style.display = 'none';
    alert(`Payment successful! You now have ${plan === 'monthly' ? '1 month' : '6 months'} of premium access.`);
    
    // Here you would unlock premium features in your app
    // For example, set a flag in localStorage:
    localStorage.setItem('premiumUser', 'true');
    localStorage.setItem('premiumExpiry', calculateExpiryDate(plan));
    
    // Update the UI to reflect premium status
    updatePremiumUI();
}

function calculateExpiryDate(plan) {
    const now = new Date();
    if (plan === 'monthly') {
        now.setMonth(now.getMonth() + 1);
    } else {
        now.setMonth(now.getMonth() + 6);
    }
    return now.toISOString();
}

function updatePremiumUI() {
    // Update UI elements to show premium features
    const premiumBtn = document.querySelector('.premium-btn');
    if (premiumBtn) {
        premiumBtn.textContent = 'Premium Member';
        premiumBtn.style.backgroundColor = '#4CAF50';
    }
    
    // Unlock premium content sections
    // ...
}