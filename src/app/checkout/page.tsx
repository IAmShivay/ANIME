'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Lock,
  ArrowLeft,
  ShoppingBag,
  Truck,
  Shield
} from 'lucide-react'
import Navbar from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartItems, selectCartTotal, clearCart } from '@/store/slices/cartSlice'
import { selectCurrentUser, selectIsAuthenticated } from '@/store/slices/authSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const cartTotal = useSelector(selectCartTotal)
  const currentUser = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.name?.split(' ')[1] || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  })

  const [paymentMethod, setPaymentMethod] = useState('razorpay')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout')
      return
    }

    if (cartItems.length === 0) {
      router.push('/shop')
      return
    }

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [isAuthenticated, cartItems.length, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    return required.every(field => shippingInfo[field as keyof typeof shippingInfo])
  }

  const calculateShipping = () => {
    return cartTotal > 2000 ? 0 : 99 // Free shipping over ₹2000
  }

  const calculateTax = () => {
    return cartTotal * 0.18 // 18% GST
  }

  const finalTotal = cartTotal + calculateShipping() + calculateTax()

  const handlePayment = async (paymentMethod: 'razorpay' | 'cod') => {
    try {
      setLoading(true)

      // Create order on backend
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: shippingInfo,
          paymentMethod: paymentMethod,
          pricing: {
            subtotal: cartTotal,
            shipping: calculateShipping(),
            tax: calculateTax(),
            total: finalTotal
          }
        }),
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const orderData = await orderResponse.json()

      // Handle COD orders
      if (paymentMethod === 'cod') {
        dispatch(clearCart())
        toast.success('Order placed successfully! You can pay when the order is delivered.')
        router.push(`/orders/${orderData.data._id}`)
        return
      }

      // Initialize Razorpay for online payments
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

      if (!razorpayKeyId) {
        throw new Error('Razorpay configuration missing. Please try Cash on Delivery.')
      }

      const options = {
        key: razorpayKeyId,
        amount: Math.round(finalTotal * 100), // Amount in paise
        currency: 'INR',
        name: 'Bindass',
        description: 'Fashion Purchase',
        order_id: orderData.data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({
                orderId: orderData.data._id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })

            if (verifyResponse.ok) {
              dispatch(clearCart())
              toast.success('Payment successful!')
              router.push(`/orders/${orderData.data._id}`)
            } else {
              toast.error('Payment verification failed')
            }
          } catch (error) {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: {
          color: '#8B5CF6',
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        throw new Error('Payment gateway not loaded. Please refresh and try again.')
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error: any) {
      console.error('Payment error:', error)

      // Handle specific error cases
      if (error.message === 'Failed to create order') {
        // Check if the response suggests COD
        try {
          const errorResponse = await fetch('/api/orders/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              items: cartItems,
              shippingAddress: shippingInfo,
              paymentMethod: 'cod', // Try COD instead
              pricing: {
                subtotal: cartTotal,
                shipping: calculateShipping(),
                tax: calculateTax(),
                total: finalTotal
              },
              guestOrder: !localStorage.getItem('token'),
            }),
          })

          if (errorResponse.ok) {
            const orderData = await errorResponse.json()
            dispatch(clearCart())
            toast.success('Order placed with Cash on Delivery!')
            router.push(`/orders/${orderData.data._id}`)
            return
          }
        } catch (codError) {
          console.error('COD fallback failed:', codError)
        }
      }

      toast.error('Payment failed. Please try Cash on Delivery or contact support.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      if (!validateShipping()) {
        toast.error('Please fill in all required fields')
        return
      }
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      await handlePayment(paymentMethod as 'razorpay' | 'cod')
    }
  }

  if (!isAuthenticated || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-4">
                <Link href="/cart">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                  <p className="text-gray-600 mt-1">Complete your purchase</p>
                </div>
              </div>
              
              {/* Progress Steps */}
              <div className="hidden md:flex items-center space-x-4">
                {[
                  { step: 1, label: 'Shipping', icon: Truck },
                  { step: 2, label: 'Payment', icon: CreditCard },
                  { step: 3, label: 'Review', icon: Shield }
                ].map(({ step: stepNum, label, icon: Icon }) => (
                  <div key={stepNum} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step >= stepNum ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      step >= stepNum ? 'text-purple-600' : 'text-gray-600'
                    }`}>
                      {label}
                    </span>
                    {stepNum < 3 && (
                      <div className={`w-8 h-0.5 mx-4 ${
                        step > stepNum ? 'bg-purple-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Truck className="w-6 h-6 text-purple-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={shippingInfo.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={shippingInfo.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={shippingInfo.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="India">India</option>
                          <option value="USA">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="Canada">Canada</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                      >
                        Continue to Payment
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment Method */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                    </div>

                    <div className="space-y-4">
                      <div className={`border rounded-lg p-4 ${paymentMethod === 'razorpay' ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-white'}`}>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="razorpay"
                            name="paymentMethod"
                            value="razorpay"
                            checked={paymentMethod === 'razorpay'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                          />
                          <label htmlFor="razorpay" className="ml-3 flex items-center">
                            <CreditCard className="w-5 h-5 text-purple-600 mr-2" />
                            <span className="text-sm font-medium text-gray-900">Online Payment</span>
                            <span className="ml-2 text-xs text-gray-600">(Cards, UPI, Wallets, Net Banking)</span>
                          </label>
                        </div>
                        <p className="mt-2 text-xs text-gray-600 ml-7">
                          Secure payment powered by Razorpay. All major payment methods accepted.
                        </p>
                        <div className="mt-2 ml-7">
                          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                            <span>⚠️</span>
                            <span>If online payment fails, Cash on Delivery will be automatically selected.</span>
                          </div>
                        </div>
                      </div>

                      <div className={`border rounded-lg p-4 ${paymentMethod === 'cod' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="cod"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                          />
                          <label htmlFor="cod" className="ml-3 flex items-center">
                            <Truck className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-sm font-medium text-gray-900">Cash on Delivery</span>
                            <span className="ml-2 text-xs text-gray-600">(Pay when you receive)</span>
                          </label>
                        </div>
                        <p className="mt-2 text-xs text-gray-600 ml-7">
                          Pay with cash when your order is delivered to your doorstep.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <motion.button
                        type="button"
                        onClick={() => setStep(1)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back to Shipping
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                      >
                        Review Order
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review Order */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Shield className="w-6 h-6 text-purple-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>
                    </div>

                    {/* Shipping Address Review */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                      <p className="text-sm text-gray-600">
                        {shippingInfo.firstName} {shippingInfo.lastName}<br />
                        {shippingInfo.address}<br />
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                        {shippingInfo.country}
                      </p>
                    </div>

                    {/* Payment Method Review */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                      <p className="text-sm text-gray-600">Razorpay (Cards, UPI, Wallets, Net Banking)</p>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <motion.button
                        type="button"
                        onClick={() => setStep(2)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back to Payment
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50"
                      >
                        <Lock className="w-5 h-5" />
                        {loading ? 'Processing...' : `Pay ₹${finalTotal.toFixed(2)}`}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBag className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                </div>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center gap-3">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-600">
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                          {item.selectedColor && ` • Color: ${item.selectedColor}`}
                        </p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {calculateShipping() === 0 ? 'Free' : `₹${calculateShipping().toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (GST 18%)</span>
                    <span className="text-gray-900">₹{calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Secure Checkout</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
