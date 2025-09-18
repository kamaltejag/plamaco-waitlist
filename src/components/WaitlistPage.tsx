import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [signupCount, setSignupCount] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Fetch actual signup count
    fetchSignupCount();
  }, []);

  const fetchSignupCount = async () => {
    try {
      const { count, error } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching signup count:", error);
        setSignupCount(0);
        return;
      }

      if (count !== null) {
        setSignupCount(count);
      }
    } catch (err) {
      console.error("Exception in fetchSignupCount:", err);
      setSignupCount(0);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("waitlist")
        .insert([{ email, created_at: new Date().toISOString() }]);

      if (error) {
        // Handle duplicate email error specifically
        if (
          error.code === "23505" ||
          error.message.includes("duplicate key value")
        ) {
          setError("You're already on the waitlist!");
        } else {
          throw error;
        }
        return;
      }

      setShowSuccessModal(true);
      setEmail("");
      setSignupCount((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-primaryBg)] relative">
      <div
        className={`${
          showSuccessModal ? "blur-sm" : ""
        } transition-all duration-300`}
      >
        <main className="max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          <div className="h-screen flex items-center justify-center relative">
            {/* Center Blob Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="blob-dynamic"
                style={{
                  width: "800px",
                  height: "700px",
                  backgroundColor: "#87A96B08",
                  backgroundImage:
                    "linear-gradient(135deg, #87A96B06 0%, #87A96B12 100%)",
                }}
              ></div>
            </div>

            {/* Centered Content */}
            <div className="text-center max-w-2xl mx-auto z-10 px-6 relative">
              <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-8">
                Plamaco
              </h1>
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-[#6B7280] via-[#9CA3AF] to-[#6B7280] bg-clip-text text-transparent font-medium tracking-normal">
                  Never wonder what to cook{" "}
                </span>
                <span className="text-6xl lg:text-7xl bg-gradient-to-r from-[#E09145] via-[#D68B3A] to-[#C07B2F] bg-clip-text text-transparent font-black tracking-wider drop-shadow-lg relative">
                  AGAIN
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#E09145] to-[#C07B2F] rounded-full"></span>
                </span>
              </h2>
              <p className="text-xl mb-8 text-[var(--color-textSecondary)] leading-relaxed max-w-lg mx-auto">
                Plamaco helps you decide what to cook with your available pantry
                ingredients while reducing food waste.
              </p>

              {/* Waitlist Form */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4 text-[var(--color-textPrimary)]">
                  Join the Waitlist
                </h3>
                <p className="text-[var(--color-textSecondary)] mb-6">
                  Be the first to know when I launch.
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
                      "Join Waitlist"
                    )}
                  </Button>
                </form>

                {signupCount > 0 && (
                  <div className="flex items-center justify-center gap-2 text-sm mt-4">
                    <svg
                      className="w-4 h-4 text-[var(--color-primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="font-medium text-[var(--color-primary)]">
                      {signupCount.toLocaleString()} {signupCount === 1 ? 'person' : 'people'} in waitlist
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Scroll indicator - Positioned at bottom of hero section */}
            <button
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30 hover:opacity-70 transition-opacity cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-[var(--color-textSecondary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>

          {/* How It Works Section */}
          <div className="py-12 mb-5">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-4 text-[var(--color-textPrimary)]">
                How <span className="text-[var(--color-primary)]">Plamaco</span>{" "}
                Works
              </h3>
              <p className="text-lg text-[var(--color-textSecondary)] max-w-2xl mx-auto">
                Simple steps to transform your kitchen and reduce food waste
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                </div>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-[var(--color-primary)]/10">
                  <svg
                    className="w-8 h-8 text-[var(--color-primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-3 text-[var(--color-textPrimary)]">
                  Track Your Pantry
                </h4>
                <p className="text-[var(--color-textSecondary)]">
                  Easily scan and organize your ingredients with smart inventory
                  tracking
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-[var(--color-secondary)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                </div>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-[var(--color-secondary)]/10">
                  <svg
                    className="w-8 h-8 text-[var(--color-secondary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-3 text-[var(--color-textPrimary)]">
                  Discover Recipes
                </h4>
                <p className="text-[var(--color-textSecondary)]">
                  Get personalized recipe suggestions based on what you already
                  have
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                </div>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-[var(--color-accent)]/10">
                  <svg
                    className="w-8 h-8 text-[var(--color-accent)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-3 text-[var(--color-textPrimary)]">
                  Reduce Food Waste
                </h4>
                <p className="text-[var(--color-textSecondary)]">
                  Save money and help the environment by using ingredients
                  efficiently
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12" style={{ backgroundColor: "#FAF7F0" }}>
            <div className="py-16 px-6">
              <h3 className="text-3xl font-bold text-center mb-12 text-[var(--color-textPrimary)]">
                Frequently Asked Questions
              </h3>
              <div className="max-w-3xl mx-auto space-y-4">
                {[
                  {
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    ),
                    iconColor: "#E09145",
                    borderColor: "#E09145",
                    bgGradient: "linear-gradient(135deg, #E0914505 0%, #E0914512 100%)",
                    hoverBgGradient: "linear-gradient(135deg, #E0914508 0%, #E0914518 100%)",
                    borderWidth: "5px",
                    question: "How does Plamaco help reduce food waste?",
                    answer:
                      "Plamaco tracks your pantry items and suggests recipes based on ingredients that are about to expire, helping you use everything before it goes bad.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                    iconColor: "#E09145",
                    borderColor: "#E09145",
                    bgGradient: "linear-gradient(135deg, #E0914505 0%, #E0914512 100%)",
                    hoverBgGradient: "linear-gradient(135deg, #E0914508 0%, #E0914518 100%)",
                    borderWidth: "5px",
                    question: "Will there be a mobile app?",
                    answer:
                      "Yes! I'm launching with mobile apps for both iOS and Android so you can manage your kitchen from anywhere.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    ),
                    iconColor: "#E09145",
                    borderColor: "#E09145",
                    bgGradient: "linear-gradient(135deg, #E0914505 0%, #E0914512 100%)",
                    hoverBgGradient: "linear-gradient(135deg, #E0914508 0%, #E0914518 100%)",
                    borderWidth: "5px",
                    question: "How does Plamaco suggest recipes?",
                    answer:
                      "Plamaco analyzes your available pantry ingredients and suggests personalized recipes that help you make the most of what you already have.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11a7.5 7.5 0 11-5.44 0M12 12h.01M12 17h.01M12 21v-1m8.2-9l-.7-.7M3.8 8l-.7.7m17.4 9.9l-.7-.7M4.9 19.1l-.7-.7"
                        />
                      </svg>
                    ),
                    iconColor: "#E09145",
                    borderColor: "#E09145",
                    bgGradient: "linear-gradient(135deg, #E0914505 0%, #E0914512 100%)",
                    hoverBgGradient: "linear-gradient(135deg, #E0914508 0%, #E0914518 100%)",
                    borderWidth: "5px",
                    question: "How do I add items to my pantry?",
                    answer:
                      "Plamaco supports barcode scanning for quick item entry and receipt/bill scanning to bulk add multiple ingredients from your grocery shopping trips.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    ),
                    iconColor: "#E09145",
                    borderColor: "#E09145",
                    bgGradient: "linear-gradient(135deg, #E0914505 0%, #E0914512 100%)",
                    hoverBgGradient: "linear-gradient(135deg, #E0914508 0%, #E0914518 100%)",
                    borderWidth: "5px",
                    question: "Can I track expiration dates?",
                    answer:
                      "Yes! Plamaco automatically tracks expiration dates, sends notifications a few days before items expire, and prioritizes recipe suggestions using ingredients that are close to expiring.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] group"
                    style={{
                      background: faq.bgGradient,
                      borderLeft: `${faq.borderWidth} solid ${faq.borderColor}`,
                      borderTop: "1px solid #E5E7EB",
                      borderRight: "1px solid #E5E7EB",
                      borderBottom: "1px solid #E5E7EB",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = faq.hoverBgGradient;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = faq.bgGradient;
                    }}
                  >
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                      className="w-full p-6 text-left transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                            style={{
                              backgroundColor: `${faq.iconColor}20`,
                              color: faq.iconColor,
                              boxShadow: `0 0 0 1px ${faq.iconColor}15`,
                            }}
                          >
                            {faq.icon}
                          </div>
                          <h4 className="text-lg font-semibold text-[var(--color-textPrimary)]">
                            {faq.question}
                          </h4>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-all duration-300 group-hover:text-gray-600 ${
                            openFaq === index ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                        <div className="ml-14 pl-4 border-l-2 border-gray-200">
                          <p className="text-[var(--color-textSecondary)] leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #FAF7F0 0%, #F8F6F0 50%, #FAF7F0 100%)"
          }}
        >
          {/* Subtle decorative elements */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute top-0 left-0 w-32 h-32 rounded-full"
              style={{
                background: "radial-gradient(circle, #87A96B08 0%, transparent 70%)",
                transform: "translate(-50%, -50%)"
              }}
            ></div>
            <div
              className="absolute bottom-0 right-0 w-40 h-40 rounded-full"
              style={{
                background: "radial-gradient(circle, #5B9BD508 0%, transparent 70%)",
                transform: "translate(50%, 50%)"
              }}
            ></div>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
            {/* Subtle separator line */}
            <div
              className="w-full h-px mb-6 opacity-20"
              style={{
                background: "linear-gradient(90deg, transparent 0%, #87A96B 20%, #5B9BD5 40%, #E09145 60%, #8B7CB6 80%, transparent 100%)"
              }}
            ></div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="text-lg font-semibold text-[var(--color-primary)] mb-1">
                  Plamaco
                </div>
                <div className="text-sm text-gray-500 text-center md:text-left">
                  © {currentYear} Plamaco. All rights reserved.
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-3">
                <a
                  href="mailto:kamal.teja@plamaco.com"
                  className="group flex items-center gap-3 font-medium transition-all duration-200 text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 px-4 py-3 rounded-xl hover:bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/30"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)]/15 to-[var(--color-primary)]/25 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg
                      className="w-5 h-5 text-[var(--color-primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500 group-hover:text-gray-600">Reach out to me at</span>
                    <span className="font-semibold">kamal.teja@plamaco.com</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 pointer-events-none">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative pointer-events-auto shadow-2xl border">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-[var(--color-primary)]">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-[var(--color-textPrimary)]">
                You're on the list!
              </h2>
              <p className="text-lg mb-6 text-[var(--color-textSecondary)]">
                {signupCount === 1
                  ? "Thanks for joining! Can't wait to share Plamaco with you."
                  : `Thanks for joining ${signupCount > 2
                      ? `${(signupCount - 1).toLocaleString()} others who`
                      : signupCount === 2
                      ? "another person who"
                      : ""} can't wait for Plamaco.`}
              </p>
              <p className="text-base mb-6 text-[var(--color-textSecondary)]">
                I'll notify you as soon as I launch. Get ready to transform
                your kitchen!
              </p>
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
