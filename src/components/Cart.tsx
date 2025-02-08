import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PaymentForm from './PaymentForm';

interface CartProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface CheckoutForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

type CheckoutStep = 'cart' | 'details' | 'payment' | 'confirmation';

const Cart: React.FC<CartProps> = ({ isOpen, setIsOpen }) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<CheckoutForm>>({});
  
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const validateForm = () => {
    const errors: Partial<CheckoutForm> = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.phone)) {
      errors.phone = 'Veuillez entrer un numéro de téléphone français valide';
    }
    
    if (!formData.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Veuillez entrer une adresse email valide';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCheckoutStep('payment');
    }
  };

  const handlePaymentSuccess = () => {
    setCheckoutStep('confirmation');
    // Here you would typically:
    // 1. Save the order to your backend
    // 2. Clear the cart
    // 3. Send confirmation email
    setTimeout(() => {
      setIsOpen(false);
      setCheckoutStep('cart');
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof CheckoutForm]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {checkoutStep === 'cart' && 'Votre Commande'}
                  {checkoutStep === 'details' && 'Informations de livraison'}
                  {checkoutStep === 'payment' && 'Paiement'}
                  {checkoutStep === 'confirmation' && 'Commande Confirmée !'}
                </h2>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setCheckoutStep('cart');
                  }}
                  className="ml-3 h-7 flex items-center"
                >
                  <X className="h-6 w-6 text-gray-400 hover:text-gray-500" />
                </button>
              </div>

              {checkoutStep === 'cart' && (
                <div className="mt-8">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">Votre panier est vide</p>
                      <p className="text-gray-400 mt-2">Ajoutez des articles du menu pour commencer votre commande</p>
                    </div>
                  ) : (
                    <div className="flow-root">
                      <ul className="-my-6 divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <li key={item.id} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">{(item.price * item.quantity).toFixed(2)} €</p>
                                </div>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center">
                                  <button
                                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                    className="px-2 py-1 border rounded-l hover:bg-gray-50"
                                  >
                                    -
                                  </button>
                                  <span className="px-4 py-1 border-t border-b min-w-[40px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-2 py-1 border rounded-r hover:bg-gray-50"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="font-medium text-red-600 hover:text-red-500"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {checkoutStep === 'details' && (
                <form onSubmit={handleDetailsSubmit} className="mt-8">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                          formErrors.firstName ? 'border-red-500' : ''
                        }`}
                      />
                      {formErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                          formErrors.lastName ? 'border-red-500' : ''
                        }`}
                      />
                      {formErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+33 6 12 34 56 78"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                          formErrors.phone ? 'border-red-500' : ''
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                          formErrors.email ? 'border-red-500' : ''
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}

              {checkoutStep === 'payment' && (
                <div className="mt-8">
                  <PaymentForm
                    amount={total}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setCheckoutStep('details')}
                  />
                </div>
              )}

              {checkoutStep === 'confirmation' && (
                <div className="mt-8 text-center">
                  <div className="rounded-full bg-green-100 p-3 mx-auto w-16 h-16 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Order Confirmed!</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Thank you for your order. We'll send you an email confirmation shortly.
                  </p>
                </div>
              )}
            </div>

            {checkoutStep === 'cart' && cartItems.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>{total.toFixed(2)} €</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  L'heure de retrait sera confirmée après le paiement.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setCheckoutStep('details')}
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Commander
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    ou{' '}
                    <button
                      type="button"
                      className="text-red-600 font-medium hover:text-red-500"
                      onClick={() => setIsOpen(false)}
                    >
                      Continuer les achats
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;