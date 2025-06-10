'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, 
  Globe, 
  DollarSign, 
  Settings as SettingsIcon,
  Mail,
  CreditCard,
  Search as SearchIcon,
  Plus,
  Trash2,
  Star,
  Check
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentCurrency, setCurrentCurrency } from '@/store/slices/settingsSlice'
import toast from 'react-hot-toast'
import { SettingsSkeleton } from '@/components/ui/SkeletonLoader'

interface Currency {
  code: string
  symbol: string
  name: string
  exchangeRate: number
}

interface Settings {
  siteName: string
  siteDescription: string
  defaultCurrency: Currency
  supportedCurrencies: Currency[]
  taxRate: number
  shippingRate: number
  freeShippingThreshold: number
  paymentSettings: {
    razorpayEnabled: boolean
    codEnabled: boolean
  }
}

export default function AdminSettingsPage() {
  const dispatch = useDispatch()
  const currentCurrency = useSelector(selectCurrentCurrency)
  
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    symbol: '',
    name: '',
    exchangeRate: 1
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return
    
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        toast.success('Settings saved successfully')
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const addCurrency = async () => {
    if (!newCurrency.code || !newCurrency.symbol || !newCurrency.name) {
      toast.error('Please fill all currency fields')
      return
    }

    try {
      const response = await fetch('/api/admin/settings/currency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          action: 'add',
          currency: newCurrency
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data.data)
        setNewCurrency({ code: '', symbol: '', name: '', exchangeRate: 1 })
        toast.success('Currency added successfully')
      } else {
        toast.error('Failed to add currency')
      }
    } catch (error) {
      console.error('Error adding currency:', error)
      toast.error('Failed to add currency')
    }
  }

  const setDefaultCurrency = async (currency: Currency) => {
    try {
      const response = await fetch('/api/admin/settings/currency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          action: 'setDefault',
          currency
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data.data)
        dispatch(setCurrentCurrency(currency))
        toast.success('Default currency updated')
      } else {
        toast.error('Failed to update default currency')
      }
    } catch (error) {
      console.error('Error setting default currency:', error)
      toast.error('Failed to update default currency')
    }
  }

  const removeCurrency = async (currency: Currency) => {
    try {
      const response = await fetch('/api/admin/settings/currency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          action: 'remove',
          currency
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data.data)
        toast.success('Currency removed successfully')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to remove currency')
      }
    } catch (error) {
      console.error('Error removing currency:', error)
      toast.error('Failed to remove currency')
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'currency', label: 'Currency', icon: DollarSign },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'email', label: 'Email', icon: Mail },
  ]

  if (loading) {
    return (
      <AdminLayout>
        <SettingsSkeleton />
      </AdminLayout>
    )
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <SettingsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load settings</h3>
            <button
              onClick={fetchSettings}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your store settings and configuration</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={settings.taxRate * 100}
                        onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value) / 100})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping Rate ({settings.defaultCurrency.symbol})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={settings.shippingRate}
                        onChange={(e) => setSettings({...settings, shippingRate: parseFloat(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Free Shipping Threshold ({settings.defaultCurrency.symbol})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={settings.freeShippingThreshold}
                        onChange={(e) => setSettings({...settings, freeShippingThreshold: parseFloat(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      rows={3}
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Currency Settings */}
              {activeTab === 'currency' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Currency Settings</h3>
                  
                  {/* Default Currency */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Default Currency</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">{settings.defaultCurrency.symbol}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{settings.defaultCurrency.name}</p>
                          <p className="text-sm text-gray-600">{settings.defaultCurrency.code}</p>
                        </div>
                        <div className="ml-auto">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Default
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supported Currencies */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Supported Currencies</h4>
                    <div className="space-y-3">
                      {settings.supportedCurrencies.map((currency) => (
                        <div key={currency.code} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-bold">{currency.symbol}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{currency.name}</p>
                                <p className="text-sm text-gray-600">{currency.code} • Rate: {currency.exchangeRate}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {currency.code !== settings.defaultCurrency.code && (
                                <>
                                  <button
                                    onClick={() => setDefaultCurrency(currency)}
                                    className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                                  >
                                    Set Default
                                  </button>
                                  <button
                                    onClick={() => removeCurrency(currency)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Currency */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Add New Currency</h4>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Code (e.g., USD)"
                          value={newCurrency.code}
                          onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value.toUpperCase()})}
                          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Symbol (e.g., $)"
                          value={newCurrency.symbol}
                          onChange={(e) => setNewCurrency({...newCurrency, symbol: e.target.value})}
                          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Name (e.g., US Dollar)"
                          value={newCurrency.name}
                          onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
                          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          step="0.000001"
                          min="0"
                          placeholder="Exchange Rate"
                          value={newCurrency.exchangeRate}
                          onChange={(e) => setNewCurrency({...newCurrency, exchangeRate: parseFloat(e.target.value)})}
                          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={addCurrency}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        <Plus className="w-4 h-4" />
                        Add Currency
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Razorpay</h4>
                        <p className="text-sm text-gray-600">Online payment gateway</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.paymentSettings.razorpayEnabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            paymentSettings: {
                              ...settings.paymentSettings,
                              razorpayEnabled: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Cash on Delivery</h4>
                        <p className="text-sm text-gray-600">Pay when order is delivered</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.paymentSettings.codEnabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            paymentSettings: {
                              ...settings.paymentSettings,
                              codEnabled: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Email Settings</h3>
                  <div className="text-center py-12">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Email Configuration</h3>
                    <p className="text-gray-600">Email settings will be available in the next update</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
