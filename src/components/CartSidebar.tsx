'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartItems, selectCartTotal, selectCartIsOpen, toggleCart, updateQuantity, removeFromCart } from '@/store/slices/cartSlice'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export const CartSidebar = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const cartTotal = useSelector(selectCartTotal)
  const isOpen = useSelector(selectCartIsOpen)

  const handleClose = () => {
    dispatch(toggleCart())
  }

  const handleUpdateQuantity = (id: string, quantity: number, size?: string, color?: string) => {
    dispatch(updateQuantity({ id, quantity, size, color }))
  }

  const handleRemoveItem = (id: string, size?: string, color?: string) => {
    dispatch(removeFromCart({ id, size, color }))
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping Cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={handleClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Cart Items */}
                      <div className="mt-8">
                        <div className="flow-root">
                          {cartItems.length === 0 ? (
                            <div className="text-center py-12">
                              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                              <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                              <p className="mt-1 text-sm text-gray-500">Start adding some items to your cart!</p>
                              <div className="mt-6">
                                <Link
                                  href="/shop"
                                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                  onClick={handleClose}
                                >
                                  Continue Shopping
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              <AnimatePresence>
                                {cartItems.map((item) => (
                                  <motion.li
                                    key={`${item.id}-${item.size}-${item.color}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex py-6"
                                  >
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={96}
                                        height={96}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>
                                            <Link href={`/products/${item.id}`} onClick={handleClose}>
                                              {item.name}
                                            </Link>
                                          </h3>
                                          <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500">
                                          {item.size && <span>Size: {item.size}</span>}
                                          {item.size && item.color && <span className="mx-2">•</span>}
                                          {item.color && <span>Color: {item.color}</span>}
                                        </div>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                          <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                                            disabled={item.quantity <= 1}
                                            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            <Minus className="h-4 w-4" />
                                          </button>
                                          <span className="font-medium">{item.quantity}</span>
                                          <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                                            disabled={item.quantity >= item.maxQuantity}
                                            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            <Plus className="h-4 w-4" />
                                          </button>
                                        </div>

                                        <div className="flex">
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                                            className="font-medium text-red-600 hover:text-red-500 p-1"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.li>
                                ))}
                              </AnimatePresence>
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>${cartTotal.toFixed(2)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                        <div className="mt-6">
                          <Link
                            href="/checkout"
                            className="flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-pink-700"
                            onClick={handleClose}
                          >
                            Checkout
                          </Link>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            or{' '}
                            <button
                              type="button"
                              className="font-medium text-purple-600 hover:text-purple-500"
                              onClick={handleClose}
                            >
                              Continue Shopping
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
