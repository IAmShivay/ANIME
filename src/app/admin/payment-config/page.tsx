'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PaymentConfigPage() {
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const testRazorpayConfig = async () => {
    setTesting(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/test-razorpay')
      const result = await response.json()
      setTestResult(result)
      
      if (result.success) {
        toast.success('Razorpay configuration is working!')
      } else {
        toast.error('Razorpay configuration failed')
      }
    } catch (error) {
      console.error('Test failed:', error)
      setTestResult({
        success: false,
        error: 'Failed to test configuration',
        details: { message: error }
      })
      toast.error('Test failed')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Configuration</h1>
          
          {/* Razorpay Configuration Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Razorpay Configuration</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Setup Instructions:</h3>
              <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
                <li>Sign up at <a href="https://dashboard.razorpay.com/" target="_blank" rel="noopener noreferrer" className="underline">Razorpay Dashboard</a></li>
                <li>Go to Settings → API Keys</li>
                <li>Generate Test API Keys</li>
                <li>Update your .env.local file with the keys</li>
                <li>Restart your development server</li>
                <li>Test the configuration below</li>
              </ol>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Environment Variables Required:</h4>
              <pre className="text-sm text-gray-600 bg-white p-3 rounded border">
{`RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id`}
              </pre>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={testRazorpayConfig}
              disabled={testing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Testing Configuration...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Test Razorpay Configuration
                </>
              )}
            </motion.button>
          </div>

          {/* Test Results */}
          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Results</h3>
              
              <div className={`rounded-lg p-4 border ${
                testResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${
                    testResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResult.success ? 'Configuration Valid' : 'Configuration Failed'}
                  </span>
                </div>
                
                {testResult.success ? (
                  <div className="text-green-700 text-sm">
                    <p>✅ Razorpay API connection successful</p>
                    <p>✅ Test order created: {testResult.testOrderId}</p>
                    <p>✅ Key ID: {testResult.keyId}</p>
                  </div>
                ) : (
                  <div className="text-red-700 text-sm">
                    <p><strong>Error:</strong> {testResult.error}</p>
                    {testResult.details && (
                      <div className="mt-2">
                        <p><strong>Details:</strong></p>
                        <ul className="list-disc list-inside ml-4">
                          {testResult.details.statusCode && (
                            <li>Status Code: {testResult.details.statusCode}</li>
                          )}
                          {testResult.details.errorCode && (
                            <li>Error Code: {testResult.details.errorCode}</li>
                          )}
                          {testResult.details.description && (
                            <li>Description: {testResult.details.description}</li>
                          )}
                          {testResult.details.message && (
                            <li>Message: {testResult.details.message}</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Current Status */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Current Status</span>
            </div>
            <p className="text-yellow-700 text-sm">
              The application is configured to automatically fall back to Cash on Delivery (COD) 
              if Razorpay payment fails. This ensures customers can still complete their orders 
              even if online payment is not available.
            </p>
          </div>

          {/* Alternative Payment Methods */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Payment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">💳 Online Payment (Razorpay)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Credit/Debit Cards</li>
                  <li>• UPI (PhonePe, GPay, Paytm)</li>
                  <li>• Net Banking</li>
                  <li>• Digital Wallets</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">🚚 Cash on Delivery</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Pay when order is delivered</li>
                  <li>• No advance payment required</li>
                  <li>• Available across India</li>
                  <li>• Secure and reliable</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
