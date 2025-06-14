'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Calendar, FileText } from 'lucide-react'

interface Policy {
  _id: string
  type: string
  title: string
  content: string
  lastUpdated: string
  version: string
}

interface PolicyPageProps {
  params: {
    type: string
  }
}

export default function PolicyPage({ params }: PolicyPageProps) {
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPolicy()
  }, [params.type])

  const fetchPolicy = async () => {
    try {
      const response = await fetch(`/api/policies?type=${params.type}&active=true`)
      const data = await response.json()

      if (data.success && data.data.length > 0) {
        setPolicy(data.data[0])
      } else {
        setError('Policy not found')
      }
    } catch (err) {
      setError('Failed to load policy')
    } finally {
      setLoading(false)
    }
  }

  const getPolicyTypeTitle = (type: string) => {
    switch (type) {
      case 'privacy':
        return 'Privacy Policy'
      case 'terms':
        return 'Terms of Service'
      case 'refund':
        return 'Refund Policy'
      case 'shipping':
        return 'Shipping Policy'
      default:
        return 'Policy'
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !policy) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Policy Not Found</h1>
            <p className="text-gray-600">{error || 'The requested policy could not be found.'}</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {policy.title || getPolicyTypeTitle(params.type)}
              </h1>
              <div className="flex items-center justify-center gap-6 text-purple-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Last updated: {new Date(policy.lastUpdated).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>Version {policy.version}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 md:p-12"
            >
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: policy.content }}
              />
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h3>
              <p className="text-gray-600 mb-6">
                If you have any questions about this policy, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:support@animescience.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Email Support
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 font-medium rounded-lg border border-purple-600 hover:bg-purple-50 transition-colors"
                >
                  Contact Form
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
