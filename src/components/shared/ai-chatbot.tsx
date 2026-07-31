"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type Message = {
  role: "user" | "assistant"
  content: string
}

const QUICK_PROMPTS: Record<string, string[]> = {
  English: ["🔧 Need a Plumber", "⚡ Find Electrician", "🧹 Cleaning Service", "🪚 Need Carpenter"],
  Hindi:   ["🔧 Plumber chahiye", "⚡ Electrician dhundho", "🧹 Cleaning service", "🪚 Carpenter chahiye"],
  Marathi: ["🔧 Plumber pahije", "⚡ Electrician shodha", "🧹 Cleaning service", "🪚 Carpenter pahije"],
}

export function AIChatbot() {
  const [language, setLanguage] = useState<"English" | "Hindi" | "Marathi" | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showLoginBtn, setShowLoginBtn] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isOpen && language) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, language])

  const handleLanguageSelect = (lang: "English" | "Hindi" | "Marathi") => {
    setLanguage(lang)
    setShowLoginBtn(false)
    setMessages([{
      role: "assistant",
      content:
        lang === "English"
          ? "Hello! 👋 I'm NeighbourHub AI. Which service are you looking for?"
          : lang === "Hindi"
          ? "नमस्ते! 👋 मैं NeighbourHub AI हूं। आपको कौनसी service चाहिए?"
          : "नमस्कार! 👋 मी NeighbourHub AI आहे. तुम्हाला कोणती service हवी आहे?",
    }])
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage = text.trim()
    setInput("")
    setShowLoginBtn(false)

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          userMessage,
          language,
        }),
      })

      const data = await res.json()

      if (data.success) {
        const assistantMsg = data.message

        // Login check
        if (assistantMsg.includes("Please login first")) {
          setMessages(prev => [...prev, { role: "assistant", content: assistantMsg }])
          setShowLoginBtn(true)
          return
        }

        // Booking redirect
        const bookingMatch = assistantMsg.match(/\[BOOK:(\/booking[^\]]+)\]/)
        if (bookingMatch) {
          const cleanMessage = assistantMsg.replace(/\[BOOK:[^\]]+\]/, "").trim()
          setMessages(prev => [...prev, { role: "assistant", content: cleanMessage }])
          setTimeout(() => {
            router.push(bookingMatch[1])
            setIsOpen(false)
          }, 1500)
        } else {
          setMessages(prev => [...prev, { role: "assistant", content: assistantMsg }])
        }
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content:
              language === "Hindi"
                ? "माफ करें, कुछ problem हुई। Please try again!"
                : language === "Marathi"
                ? "माफ करा, काहीतरी problem झाली. Please try again!"
                : "Sorry, something went wrong. Please try again!",
          },
        ])
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again!" },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const parseMessage = (text: string) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/\*\*(.*?)\*\*/).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center relative"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 right-0 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: "520px" }}>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-poppins font-semibold text-white text-sm">
                    NeighbourHub AI
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    <p className="text-xs text-white/80">Online — Ready to help</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {language && (
                  <button
                    onClick={() => {
                      setLanguage(null)
                      setMessages([])
                      setShowLoginBtn(false)
                    }}
                    className="text-xs text-white/70 hover:text-white px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    🌐 Lang
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Language selector */}
            {!language ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-poppins font-semibold text-foreground mb-1">
                  Welcome to NeighbourHub AI!
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Please select your preferred language
                </p>
                <div className="grid grid-cols-1 gap-3 w-full">
                  {[
                    { lang: "English" as const, label: "🇬🇧 English", sub: "Continue in English" },
                    { lang: "Hindi" as const, label: "🇮🇳 हिंदी", sub: "हिंदी में जारी रखें" },
                    { lang: "Marathi" as const, label: "🏳️ मराठी", sub: "मराठीत सुरू ठेवा" },
                  ].map(({ lang, label, sub }) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageSelect(lang)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-accent transition-all text-left">
                      <span className="text-2xl">{label.split(" ")[0]}</span>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {label.split(" ").slice(1).join(" ")}
                        </p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i}
                      className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        msg.role === "assistant" ? "text-white" : "bg-secondary"
                      )}
                        style={msg.role === "assistant" ? {
                          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                        } : {}}>
                        {msg.role === "assistant"
                          ? <Bot className="w-3.5 h-3.5 text-white" />
                          : <User className="w-3.5 h-3.5 text-muted-foreground" />}
                      </div>
                      <div className={cn(
                        "max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed",
                        msg.role === "assistant"
                          ? "bg-secondary text-foreground rounded-tl-none"
                          : "text-white rounded-tr-none"
                      )}
                        style={msg.role === "user" ? {
                          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                        } : {}}>
                        {parseMessage(msg.content)}
                      </div>
                    </div>
                  ))}

                  {/* Login button — after login check message */}
                  {showLoginBtn && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <button
                        onClick={() => {
                          router.push("/login")
                          setIsOpen(false)
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                        🔐 Sign In to Continue
                      </button>
                    </div>
                  )}

                  {/* Loading */}
                  {isLoading && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-secondary px-4 py-3 rounded-2xl rounded-tl-none">
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <motion.div key={i}
                              className="w-2 h-2 bg-muted-foreground rounded-full"
                              animate={{ y: [0, -6, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick prompts */}
                {messages.length === 1 && language && (
                  <div className="px-4 pb-2 flex gap-2 flex-wrap flex-shrink-0">
                    {QUICK_PROMPTS[language].map(prompt => (
                      <button key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary hover:bg-accent transition-colors text-foreground">
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit}
                  className="p-3 border-t border-border flex gap-2 flex-shrink-0">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={
                      language === "Hindi" ? "संदेश लिखें..."
                      : language === "Marathi" ? "संदेश टाइप करा..."
                      : "Type a message..."
                    }
                    disabled={isLoading}
                    className="flex-1 bg-secondary text-foreground text-sm px-3 py-2 rounded-xl outline-none placeholder:text-muted-foreground disabled:opacity-50 focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-opacity flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                    {isLoading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Send className="w-4 h-4" />}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}