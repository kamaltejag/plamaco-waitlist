import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { colorTheme } from '@/lib/colors'

export function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [signupCount, setSignupCount] = useState(1247) // Starting with a reasonable number

  useEffect(() => {
    // Fetch actual signup count
    fetchSignupCount()
  }, [])

  const fetchSignupCount = async () => {
    try {
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

      if (count !== null) {
        setSignupCount(count + 1200) // Add base number for social proof
      }
    } catch (err) {
      // Keep default count if fetch fails
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, created_at: new Date().toISOString() }])

      if (error) throw error

      setIsSuccess(true)
      setEmail('')
      setSignupCount(prev => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--color-primaryBg)]">
        <header className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">
              Plamaco
            </h1>
          </div>
        </header>

        <main className="flex items-center justify-center px-6 py-20">
          <div className="max-w-lg text-center">
            <div className="w-16 h-16 mx-auto mb-8 rounded-full flex items-center justify-center bg-[var(--color-primary)]">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-6 text-[var(--color-textPrimary)]">
              You're on the list!
            </h2>
            <p className="text-xl mb-8 text-[var(--color-textSecondary)]">
              Thanks for joining <span className="font-semibold text-[var(--color-primary)]">{signupCount.toLocaleString()}</span> others who can't wait for Plamaco.
            </p>
            <p className="text-lg mb-8 text-[var(--color-textSecondary)]">
              We'll notify you as soon as we launch. Get ready to transform your kitchen!
            </p>
            <Button
              onClick={() => setIsSuccess(false)}
              variant="outline"
              className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
            >
              Sign up another email
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-primaryBg)]">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            Plamaco
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-5xl font-bold mb-6 text-[var(--color-textPrimary)] leading-tight">
              Never wonder what to cook again
            </h2>
            <p className="text-xl mb-8 text-[var(--color-textSecondary)] leading-relaxed">
              Plamaco helps you decide what to cook with your available pantry ingredients while reducing food waste.
            </p>

            {/* Inline Waitlist Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-[var(--color-textPrimary)]">
                Join the Waitlist
              </h3>
              <p className="text-[var(--color-textSecondary)] mb-6">
                Be the first to know when we launch and get early access.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                </div>

                {error && (
                  <div className="text-sm p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full h-12 text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 rounded-lg font-semibold"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Joining...
                    </div>
                  ) : (
                    'Join Waitlist'
                  )}
                </Button>
              </form>

              <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-textSecondary)] mt-4">
                <span>{signupCount.toLocaleString()} people waiting</span>
                <span>•</span>
                <span>Launching Q2 2025</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src="/images/Cooking Illustration.svg"
              alt="Cooking illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-[var(--color-textPrimary)]">
            What Plamaco Does
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center bg-[var(--color-primary)]/10">
                <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-[var(--color-textPrimary)]">
                Track Your Pantry
              </h4>
              <p className="text-[var(--color-textSecondary)]">
                Easily manage what you have at home with smart inventory tracking
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center bg-[var(--color-secondary)]/10">
                <svg className="w-8 h-8 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-[var(--color-textPrimary)]">
                Discover Recipes
              </h4>
              <p className="text-[var(--color-textSecondary)]">
                Get personalized recipe suggestions based on what you already have
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center bg-[var(--color-accent)]/10">
                <svg className="w-8 h-8 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-[var(--color-textPrimary)]">
                Reduce Food Waste
              </h4>
              <p className="text-[var(--color-textSecondary)]">
                Make the most of your ingredients and help the environment
              </p>
            </div>
          </div>
        </div>

        {/* Additional Features with Images */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/images/Groceries Illustration.svg"
              alt="Groceries illustration"
              className="w-full max-w-sm h-auto mx-auto"
            />
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-4 text-[var(--color-textPrimary)]">
              Smart Inventory Management
            </h4>
            <p className="text-lg text-[var(--color-textSecondary)] mb-6">
              Keep track of your ingredients, their expiration dates, and quantities.
              Get notifications when items are running low or about to expire.
            </p>
            <ul className="space-y-3 text-[var(--color-textSecondary)]">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
                Barcode scanning for easy entry
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
                Expiration date tracking
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
                Smart notifications
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-[var(--color-textSecondary)]">
            © 2024 Plamaco. Smart food management for everyone.
          </p>
        </div>
      </footer>
    </div>
  )
}