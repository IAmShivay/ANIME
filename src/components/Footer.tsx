'use client'

import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-12 pt-16 pb-8">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Bindass
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-md">
                Your premier destination for anime-inspired fashion and
                streetwear. Where passion meets style in every premium product
                we create.
              </p>
              <div className="flex space-x-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 border border-white/20 hover:border-transparent"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="sr-only">{label}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-purple-400 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "New Arrivals", href: "/shop?sort=newest" },
                  { name: "Best Sellers", href: "/shop?sort=popular" },
                  { name: "Special Offers", href: "/shop?sale=true" },
                  { name: "Gift Cards", href: "/gift-cards" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-purple-400 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-purple-400 mb-4">
                Categories
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Anime Collection", href: "/shop?category=anime" },
                  { name: "Streetwear", href: "/shop?category=streetwear" },
                  { name: "Limited Editions", href: "/shop?category=limited" },
                  { name: "Accessories", href: "/shop?category=accessories" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-purple-400 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-purple-400 mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "About Us", href: "/about" },
                  { name: "Contact", href: "/contact" },
                  { name: "Careers", href: "/careers" },
                  { name: "Press", href: "/press" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-purple-400 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info - Ultra Compact */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-purple-400">Contact</h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span>Mumbai, IN</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>support@bindass.com</span>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-purple-300 hover:text-purple-200 transition-colors pt-1"
                >
                  <span>Contact Form →</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <p className="text-gray-300 text-sm">
                  © 2024 Bindass. All rights reserved.
                </p>
                <div className="hidden sm:block w-1 h-1 bg-gray-500 rounded-full"></div>
                <p className="text-gray-400 text-xs">
                  Made with ❤️ for anime fashion lovers
                </p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-end gap-4 lg:gap-6">
                {[
                  { name: "Privacy Policy", href: "/policies/privacy" },
                  { name: "Terms of Service", href: "/policies/terms" },
                  { name: "Refund Policy", href: "/policies/refund" },
                  { name: "Shipping Info", href: "/policies/shipping" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Stay Updated
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Get the latest drops and exclusive offers
                </p>
                <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </footer>
  )
}
