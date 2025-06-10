'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Heart, Star, Check, CreditCard } from 'lucide-react'
import Image from 'next/image'

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000]

  const giftCardDesigns = [
    {
      id: 'anime-hero',
      name: 'Anime Hero',
      image: '/images/gift-cards/anime-hero.jpg',
      description: 'Perfect for anime enthusiasts'
    },
    {
      id: 'streetwear',
      name: 'Streetwear Vibes',
      image: '/images/gift-cards/streetwear.jpg',
      description: 'For the fashion-forward'
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      image: '/images/gift-cards/minimalist.jpg',
      description: 'Clean and elegant design'
    }
  ]

  const [selectedDesign, setSelectedDesign] = useState(giftCardDesigns[0].id)

  const benefits = [
    {
      icon: Gift,
      title: 'Perfect Gift',
      description: 'Let them choose their favorite anime fashion pieces'
    },
    {
      icon: Heart,
      title: 'Never Expires',
      description: 'Our gift cards never expire, use them anytime'
    },
    {
      icon: Star,
      title: 'Instant Delivery',
      description: 'Digital delivery within minutes of purchase'
    },
    {
      icon: Check,
      title: 'Easy to Use',
      description: 'Simple redemption process at checkout'
    }
  ]

  const handlePurchase = () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount
    // Handle gift card purchase logic here
    console.log('Purchasing gift card:', {
      amount,
      design: selectedDesign,
      recipientEmail,
      senderName,
      message
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Gift className="w-16 h-16 mx-auto mb-6 text-purple-400" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Gift <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Cards</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Give the gift of anime fashion. Perfect for any occasion, our gift cards let your loved ones choose their favorite pieces.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Card Purchase Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Purchase Gift Card
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Gift Card Details */}
              <div className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Amount
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {predefinedAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount)
                          setCustomAmount('')
                        }}
                        className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                          selectedAmount === amount && !customAmount
                            ? 'border-purple-600 bg-purple-50 text-purple-600'
                            : 'border-gray-300 hover:border-purple-300'
                        }`}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Custom amount (min ₹100)"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        setSelectedAmount(0)
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Design Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Design
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {giftCardDesigns.map((design) => (
                      <button
                        key={design.id}
                        onClick={() => setSelectedDesign(design.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          selectedDesign === design.id
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-300 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
                          <div>
                            <div className="font-medium text-gray-900">{design.name}</div>
                            <div className="text-sm text-gray-600">{design.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Recipient Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Purchase Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gift Card Value:</span>
                    <span className="font-semibold text-gray-900">
                      ₹{customAmount || selectedAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <div className="mt-8 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePurchase}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <CreditCard className="w-5 h-5" />
                Purchase Gift Card - ₹{customAmount || selectedAmount}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to give the perfect gift
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Choose Amount & Design',
                description: 'Select the gift card value and pick a beautiful design'
              },
              {
                step: '2',
                title: 'Add Personal Touch',
                description: 'Include recipient details and a personal message'
              },
              {
                step: '3',
                title: 'Instant Delivery',
                description: 'Gift card is delivered instantly to the recipient\'s email'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
