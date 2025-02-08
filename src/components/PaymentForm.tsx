import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('your_publishable_key');

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Here you would typically:
      // 1. Call your backend to create a payment intent
      // 2. Use the client secret to confirm the payment
      // For demo purposes, we'll simulate a successful payment
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-lg">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
            <p className="mt-1 text-sm text-gray-500">
              Total amount: ${amount.toFixed(2)}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                id="card-number"
                placeholder="4242 4242 4242 4242"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiry"
                  placeholder="MM/YY"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  maxLength={5}
                />
              </div>

              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  placeholder="123"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  maxLength={3}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 ${
              isProcessing ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-full shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;