import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCustomOrder, verifyPayment, clearCurrentOrder } from '../../store/slices/orderSlice';
import { CreditCard, Truck, MapPin, Phone, User } from 'lucide-react';
import { ButtonLoader } from '../../components/Loader';
import toast from 'react-hot-toast';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder, razorpayOrder, isLoading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    if (!currentOrder) {
      navigate('/custom');
      return;
    }
  }, [currentOrder, navigate]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'zipCode'];
    for (let field of required) {
      if (!shippingAddress[field]) {
        toast.error(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        return false;
      }
    }
    return true;
  };

  const handleRazorpayPayment = (razorpayOrderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: razorpayOrderData.amount,
      currency: razorpayOrderData.currency,
      name: 'PizzaHub',
      description: 'Custom Pizza Order',
      order_id: razorpayOrderData.id,
      handler: async function (response) {
        try {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData: {
              ...currentOrder,
              shippingAddress,
              paymentMethod: 'razorpay',
            },
          };

          const result = await dispatch(verifyPayment(verifyData));
          if (verifyPayment.fulfilled.match(result)) {
            toast.success('Payment successful! Order placed.');
            navigate('/orders/success');
          }
        } catch (error) {
          toast.error('Payment verification failed');
        }
      },
      prefill: {
        name: shippingAddress.fullName,
        email: user?.email,
        contact: shippingAddress.phone,
      },
      theme: {
        color: '#2563eb',
      },
      modal: {
        ondismiss: function() {
          toast.error('Payment cancelled');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;

    try {
      const orderData = {
        ...currentOrder.customPizza,
        shippingAddress,
        paymentMethod,
      };

      const result = await dispatch(createCustomOrder(orderData));
      if (createCustomOrder.fulfilled.match(result)) {
        if (paymentMethod === 'razorpay' && result.payload.razorpayOrder) {
          handleRazorpayPayment(result.payload.razorpayOrder);
        } else if (paymentMethod === 'cod') {
          toast.success('Order placed successfully!');
          navigate('/orders/success');
        }
      }
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  if (!currentOrder) {
    return null;
  }

  const renderOrderSummary = () => {
    const { customPizza } = currentOrder;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Base:</span>
            <span className="font-medium">{customPizza.base?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sauce:</span>
            <span className="font-medium">{customPizza.sauce?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cheese:</span>
            <span className="font-medium">{customPizza.cheese?.name}</span>
          </div>
          
          {customPizza.veggies?.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Veggies:</span>
              <span className="font-medium">
                {customPizza.veggies.map(v => v.name).join(', ')}
              </span>
            </div>
          )}
          
          {customPizza.meat?.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Meat:</span>
              <span className="font-medium">
                {customPizza.meat.map(m => m.name).join(', ')}
              </span>
            </div>
          )}
        </div>
        
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-blue-600">₹{currentOrder.totalPrice}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Delivery Address
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={handleAddressChange}
                    placeholder="Street address, apartment, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={handleAddressChange}
                    placeholder="Building, floor, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <div className="font-medium">Online Payment</div>
                    <div className="text-sm text-gray-600">Pay securely with Razorpay</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <Truck className="h-5 w-5 mr-2 text-green-600" />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when your order arrives</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {renderOrderSummary()}
            
            <button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <ButtonLoader />
              ) : (
                `Place Order - ₹${currentOrder.totalPrice}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;