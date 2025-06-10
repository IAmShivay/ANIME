'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Edit, 
  Save, 
  Eye,
  Plus,
  Trash2,
  Calendar,
  User,
  Globe,
  Lock
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { TableSkeleton } from '@/components/ui/SkeletonLoader'
import toast from 'react-hot-toast'

interface Policy {
  _id: string
  type: string
  title: string
  content: string
  isPublished: boolean
  lastUpdated: string
  updatedBy: string
}

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)
  const [viewingPolicy, setViewingPolicy] = useState<Policy | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const policyTypes = [
    { value: 'privacy', label: 'Privacy Policy' },
    { value: 'terms', label: 'Terms of Service' },
    { value: 'shipping', label: 'Shipping Policy' },
    { value: 'return', label: 'Return Policy' },
    { value: 'refund', label: 'Refund Policy' },
    { value: 'cookie', label: 'Cookie Policy' }
  ]

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      setLoading(true)
      // Mock data for now - replace with actual API call
      const mockPolicies: Policy[] = [
        {
          _id: '1',
          type: 'privacy',
          title: 'Privacy Policy',
          content: 'This Privacy Policy describes how Bindass collects, uses, and protects your personal information...',
          isPublished: true,
          lastUpdated: '2024-01-15T10:30:00Z',
          updatedBy: 'Admin User'
        },
        {
          _id: '2',
          type: 'terms',
          title: 'Terms of Service',
          content: 'These Terms of Service govern your use of the Bindass website and services...',
          isPublished: true,
          lastUpdated: '2024-01-14T15:20:00Z',
          updatedBy: 'Admin User'
        },
        {
          _id: '3',
          type: 'shipping',
          title: 'Shipping Policy',
          content: 'We offer fast and reliable shipping options for all our anime fashion products...',
          isPublished: true,
          lastUpdated: '2024-01-13T09:15:00Z',
          updatedBy: 'Admin User'
        },
        {
          _id: '4',
          type: 'return',
          title: 'Return Policy',
          content: 'We want you to be completely satisfied with your purchase. If you are not happy...',
          isPublished: false,
          lastUpdated: '2024-01-12T14:45:00Z',
          updatedBy: 'Admin User'
        }
      ]
      setPolicies(mockPolicies)
    } catch (error) {
      console.error('Error fetching policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePolicy = async (policy: Policy) => {
    try {
      // Mock save - replace with actual API call
      if (isCreating) {
        const newPolicy = {
          ...policy,
          _id: Date.now().toString(),
          lastUpdated: new Date().toISOString(),
          updatedBy: 'Admin User'
        }
        setPolicies(prev => [...prev, newPolicy])
        setIsCreating(false)
        toast.success('Policy created successfully!')
      } else {
        setPolicies(prev => prev.map(p =>
          p._id === policy._id
            ? { ...policy, lastUpdated: new Date().toISOString(), updatedBy: 'Admin User' }
            : p
        ))
        toast.success('Policy updated successfully!')
      }
      setEditingPolicy(null)
    } catch (error) {
      console.error('Error saving policy:', error)
      toast.error('Failed to save policy')
    }
  }

  const handleDeletePolicy = async (policyId: string) => {
    if (confirm('Are you sure you want to delete this policy?')) {
      try {
        // Mock delete - replace with actual API call
        setPolicies(prev => prev.filter(p => p._id !== policyId))
        toast.success('Policy deleted successfully!')
      } catch (error) {
        console.error('Error deleting policy:', error)
        toast.error('Failed to delete policy')
      }
    }
  }

  const togglePublishStatus = async (policyId: string) => {
    try {
      // Mock toggle - replace with actual API call
      const policy = policies.find(p => p._id === policyId)
      setPolicies(prev => prev.map(p =>
        p._id === policyId
          ? { ...p, isPublished: !p.isPublished, lastUpdated: new Date().toISOString() }
          : p
      ))
      toast.success(`Policy ${policy?.isPublished ? 'unpublished' : 'published'} successfully!`)
    } catch (error) {
      console.error('Error toggling publish status:', error)
      toast.error('Failed to update publish status')
    }
  }

  const startCreating = () => {
    setEditingPolicy({
      _id: '',
      type: 'privacy',
      title: '',
      content: '',
      isPublished: false,
      lastUpdated: '',
      updatedBy: ''
    })
    setIsCreating(true)
  }

  if (loading) {
    return (
      <AdminLayout>
        <TableSkeleton rows={6} columns={5} title="Policies Management" />
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
              <h1 className="text-3xl font-bold text-gray-900">Policies Management</h1>
              <p className="text-gray-600 mt-1">Manage your website policies and legal documents</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startCreating}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Create Policy
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Policies', value: policies.length, icon: FileText, color: 'bg-blue-500' },
            { label: 'Published', value: policies.filter(p => p.isPublished).length, icon: Globe, color: 'bg-green-500' },
            { label: 'Draft', value: policies.filter(p => !p.isPublished).length, icon: Lock, color: 'bg-yellow-500' },
            { label: 'Last Updated', value: 'Today', icon: Calendar, color: 'bg-purple-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Policies List */}
        {!editingPolicy && !viewingPolicy ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Policy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {policies.map((policy) => (
                    <motion.tr
                      key={policy._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{policy.title}</div>
                            <div className="text-sm text-gray-500">
                              {policy.content.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {policyTypes.find(t => t.value === policy.type)?.label || policy.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => togglePublishStatus(policy._id)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            policy.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {policy.isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{new Date(policy.lastUpdated).toLocaleDateString()}</div>
                        <div className="text-xs">by {policy.updatedBy}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingPolicy(policy)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Edit Policy"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setViewingPolicy(policy)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Policy"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePolicy(policy._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {policies.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
                <p className="text-gray-600 mb-4">Create your first policy to get started</p>
                <button
                  onClick={startCreating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create Policy
                </button>
              </div>
            )}
          </div>
        ) : viewingPolicy ? (
          /* Policy Viewer */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                View Policy: {viewingPolicy.title}
              </h3>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditingPolicy(viewingPolicy)
                    setViewingPolicy(null)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </motion.button>
                <button
                  onClick={() => setViewingPolicy(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Type
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    {policyTypes.find(t => t.value === viewingPolicy.type)?.label || viewingPolicy.type}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      viewingPolicy.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {viewingPolicy.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  {viewingPolicy.title}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                  <div className="whitespace-pre-wrap text-sm text-gray-700">
                    {viewingPolicy.content}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Updated
                  </label>
                  <div className="text-sm text-gray-600">
                    {new Date(viewingPolicy.lastUpdated).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Updated By
                  </label>
                  <div className="text-sm text-gray-600">
                    {viewingPolicy.updatedBy}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Policy Editor */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isCreating ? 'Create New Policy' : 'Edit Policy'}
              </h3>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSavePolicy(editingPolicy)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="w-4 h-4" />
                  Save
                </motion.button>
                <button
                  onClick={() => {
                    setEditingPolicy(null)
                    setIsCreating(false)
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Type
                  </label>
                  <select
                    value={editingPolicy.type}
                    onChange={(e) => setEditingPolicy({...editingPolicy, type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {policyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingPolicy.title}
                    onChange={(e) => setEditingPolicy({...editingPolicy, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter policy title"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  rows={15}
                  value={editingPolicy.content}
                  onChange={(e) => setEditingPolicy({...editingPolicy, content: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter policy content..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={editingPolicy.isPublished}
                  onChange={(e) => setEditingPolicy({...editingPolicy, isPublished: e.target.checked})}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                  Publish this policy immediately
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  )
}
