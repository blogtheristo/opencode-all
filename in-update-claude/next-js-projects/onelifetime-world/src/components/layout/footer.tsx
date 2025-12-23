import Link from 'next/link'
import { Github, Linkedin, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/mission" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Mission
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://dws10.com" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  DWS IQ Platform
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Climate Impact
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Investors</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/investors" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Investor Relations
                </Link>
              </li>
              <li>
                <Link href="/investors/deck" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Pitch Deck
                </Link>
              </li>
              <li>
                <Link href="/investors/financials" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Financials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Contact IR
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  GDPR Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Lifetime Oy. Building a sustainable future through AI.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/blogtheristo" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/in/ristopaarni" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/LifetimeWorld" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
