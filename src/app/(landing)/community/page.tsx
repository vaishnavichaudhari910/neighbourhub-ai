"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  MessageCircle, Heart, Share2, BookMarked,
  MapPin, Users, Bell, TrendingUp,
  Image as ImageIcon, Smile, Send,
  ChevronRight, Zap, Shield, Star
} from "lucide-react"
import Link from "next/link"

const CATEGORIES = [
  { name: "All", icon: "✨", active: true },
  { name: "Recommendations", icon: "👍" },
  { name: "Issues", icon: "⚠️" },
  { name: "Events", icon: "🎉" },
  { name: "Help", icon: "🤝" },
  { name: "Reviews", icon: "⭐" },
]

const POSTS = [
  {
    id: 1,
    author: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face",
    role: "Resident · Pune",
    time: "2 hours ago",
    category: "Recommendations",
    categoryColor: "#10b981",
    categoryBg: "rgba(16,185,129,0.1)",
    content: "Just had an amazing experience with the electrician I booked through NeighbourHub! Rajesh from TechFix arrived on time, fixed all 3 outlets in under an hour, and was super professional. Highly recommend booking through the app — the verified badge really means something! 🌟",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=300&fit=crop",
    likes: 24,
    comments: 8,
    liked: false,
    tags: ["#Electrician", "#Verified", "#PuneServices"],
  },
  {
    id: 2,
    author: "Amit Joshi",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face",
    role: "Resident · Nashik",
    time: "5 hours ago",
    category: "Help",
    categoryColor: "#3b82f6",
    categoryBg: "rgba(59,130,246,0.1)",
    content: "Does anyone know a good carpenter in the Koregaon Park area? I need some furniture assembled and a few shelves installed. Budget is around ₹500-800. The AI chatbot suggested a few but I wanted community recommendations too! 😊",
    image: null,
    likes: 12,
    comments: 15,
    liked: false,
    tags: ["#Carpenter", "#KoregaonPark", "#HomeServices"],
  },
  {
    id: 3,
    author: "Sneha Kulkarni",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=48&h=48&fit=crop&crop=face",
    role: "Provider · Mumbai",
    time: "Yesterday",
    category: "Reviews",
    categoryColor: "#f59e0b",
    categoryBg: "rgba(245,158,11,0.1)",
    content: "As a cleaning service provider on NeighbourHub, I just hit 50 completed bookings this month! The provider dashboard makes managing everything so easy. Accepting bookings, tracking earnings — all from one place. If you're a service professional, you should definitely join! 💪",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=300&fit=crop",
    likes: 45,
    comments: 22,
    liked: true,
    tags: ["#Provider", "#CleaningService", "#Milestone"],
  },
  {
    id: 4,
    author: "Rahul Desai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face",
    role: "Resident · Pune",
    time: "2 days ago",
    category: "Issues",
    categoryColor: "#ef4444",
    categoryBg: "rgba(239,68,68,0.1)",
    content: "Heads up for everyone in Baner area — there seems to be a water supply issue today. I've booked a plumber through NeighbourHub who confirmed it's a common pipe burst affecting the area. They're on it! Will update once resolved. Stay hydrated! 💧",
    image: null,
    likes: 67,
    comments: 31,
    liked: false,
    tags: ["#Baner", "#WaterIssue", "#PlumberHelp"],
  },
  {
    id: 5,
    author: "Kavya Nair",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=face",
    role: "Resident · Pune",
    time: "3 days ago",
    category: "Events",
    categoryColor: "#8b5cf6",
    categoryBg: "rgba(139,92,246,0.1)",
    content: "Our society is organizing a home maintenance camp this Sunday! We've partnered with NeighbourHub to get verified plumbers, electricians, and AC technicians at discounted rates. All pre-booked through the app. DM me if you want to join! 🎉",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop",
    likes: 89,
    comments: 42,
    liked: false,
    tags: ["#CommunityEvent", "#HomeMaintenanceCamp", "#Discount"],
  },
]

const TRENDING = [
  { tag: "#PuneServices", count: "234 posts" },
  { tag: "#VerifiedProviders", count: "189 posts" },
  { tag: "#HomeRepair", count: "156 posts" },
  { tag: "#ACRepair", count: "98 posts" },
  { tag: "#CleaningTips", count: "87 posts" },
]

const ACTIVE_MEMBERS = [
  { name: "Priya S.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face", posts: 28 },
  { name: "Rahul D.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", posts: 24 },
  { name: "Sneha K.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face", posts: 19 },
  { name: "Amit J.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", posts: 15 },
]

function PostCard({ post, index }: { post: typeof POSTS[0]; index: number }) {
  const [liked, setLiked] = useState(post.liked)
  const [likes, setLikes] = useState(post.likes)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-card border border-border rounded-3xl overflow-hidden hover:border-emerald-500/20 hover:shadow-lg transition-all duration-300 group">

      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={post.avatar} alt={post.author}
                className="w-11 h-11 rounded-2xl object-cover border-2"
                style={{ borderColor: post.categoryColor + "40" }} />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card"
                style={{ background: "#10b981" }} />
            </div>
            <div>
              <p className="font-poppins font-semibold text-foreground text-sm">{post.author}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{post.role}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{post.time}</span>
              </div>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
            style={{ background: post.categoryBg, color: post.categoryColor }}>
            {post.category}
          </span>
        </div>

        {/* Content */}
        <p className="text-sm text-foreground leading-relaxed mt-4">
          {post.content}
        </p>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap mt-3">
          {post.tags.map(tag => (
            <span key={tag}
              className="text-xs font-medium cursor-pointer hover:underline"
              style={{ color: "#10b981" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-5 pb-3">
          <div className="rounded-2xl overflow-hidden border border-border">
            <img src={post.image} alt="Post image"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => {
              setLiked(!liked)
              setLikes(l => liked ? l - 1 : l + 1)
            }}
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: liked ? "#ef4444" : "var(--text-muted)" }}>
            <Heart className={`w-4 h-4 transition-all ${liked ? "fill-red-500" : ""}`} />
            <span className="font-medium">{likes}</span>
          </motion.button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <BookMarked className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [postText, setPostText] = useState("")
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section ref={heroRef} className="relative pt-24 pb-12 px-4 sm:px-6 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(139,92,246,0.04) 50%, transparent 100%)",
        }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(16,185,129,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-5"
            style={{
              background: "rgba(16,185,129,0.1)",
              color: "#10b981",
              border: "1px solid rgba(16,185,129,0.2)",
            }}>
            <Users className="w-3.5 h-3.5" />
            Community Feed
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-foreground mb-4">
            Your neighbourhood,
            <span className="block mt-1"
              style={{
                background: "linear-gradient(135deg, #10b981, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              talking together.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto mb-6">
            Share recommendations, ask for help, report issues, and connect
            with residents and providers in your community.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { icon: Users, value: "12K+", label: "Members" },
              { icon: MessageCircle, value: "8.5K+", label: "Posts" },
              { icon: TrendingUp, value: "2.1K+", label: "Reviews" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(16,185,129,0.1)" }}>
                  <stat.icon className="w-4 h-4" style={{ color: "#10b981" }} />
                </div>
                <div className="text-left">
                  <p className="font-poppins font-bold text-foreground text-sm leading-none">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — Main feed */}
          <div className="lg:col-span-2 space-y-5">

            {/* Create post box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-3xl p-5"
              style={{ borderColor: "rgba(16,185,129,0.15)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                  U
                </div>
                <div className="flex-1">
                  <textarea
                    value={postText}
                    onChange={e => setPostText(e.target.value)}
                    placeholder="Share something with your community..."
                    rows={2}
                    className="w-full bg-secondary text-foreground placeholder:text-muted-foreground text-sm px-4 py-2.5 rounded-2xl outline-none resize-none border border-transparent focus:border-emerald-500/30 transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[
                    { icon: ImageIcon, label: "Photo" },
                    { icon: Smile, label: "Emoji" },
                    { icon: MapPin, label: "Location" },
                  ].map(action => (
                    <button key={action.label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                      <action.icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:block">{action.label}</span>
                    </button>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-40 transition-all"
                  style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}
                  disabled={!postText.trim()}>
                  <Send className="w-3.5 h-3.5" />
                  Post
                </motion.button>
              </div>
            </motion.div>

            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all border whitespace-nowrap flex-shrink-0"
                  style={{
                    background: activeCategory === cat.name ? "#10b981" : "var(--card)",
                    color: activeCategory === cat.name ? "white" : "var(--text-secondary)",
                    borderColor: activeCategory === cat.name ? "#10b981" : "var(--border)",
                  }}>
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-5">
              {POSTS.filter(p =>
                activeCategory === "All" || p.category === activeCategory
              ).map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>

            {/* Coming soon notice */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-10 rounded-3xl border border-dashed"
              style={{ borderColor: "rgba(16,185,129,0.2)" }}>
              <div className="text-4xl mb-3">🚀</div>
              <p className="font-poppins font-semibold text-foreground mb-1">
                More features coming soon!
              </p>
              <p className="text-sm text-muted-foreground">
                Real-time posts, comments, polls, and community events — in Phase 3.
              </p>
            </motion.div>
          </div>

          {/* RIGHT — Sidebar */}
          <div className="space-y-5">

            {/* Community guidelines */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-3xl p-5"
              style={{ borderColor: "rgba(16,185,129,0.15)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5" style={{ color: "#10b981" }} />
                <h3 className="font-poppins font-semibold text-foreground">Community Rules</h3>
              </div>
              <div className="space-y-3">
                {[
                  "Be respectful to all members",
                  "Share genuine experiences only",
                  "No spam or self-promotion",
                  "Report issues constructively",
                  "Help each other find services",
                ].map((rule, i) => (
                  <div key={rule} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                      {i + 1}
                    </div>
                    <span className="text-sm text-muted-foreground">{rule}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trending tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card border border-border rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" style={{ color: "#10b981" }} />
                <h3 className="font-poppins font-semibold text-foreground">Trending</h3>
              </div>
              <div className="space-y-3">
                {TRENDING.map((item, i) => (
                  <motion.div
                    key={item.tag}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm font-medium group-hover:underline transition-all"
                      style={{ color: "#10b981" }}>
                      {item.tag}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.count}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Active members */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card border border-border rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5" style={{ color: "#f59e0b" }} />
                <h3 className="font-poppins font-semibold text-foreground">Top Contributors</h3>
              </div>
              <div className="space-y-3">
                {ACTIVE_MEMBERS.map((member, i) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <div className="relative">
                      <img src={member.avatar} alt={member.name}
                        className="w-9 h-9 rounded-xl object-cover" />
                      {i === 0 && (
                        <div className="absolute -top-1 -right-1 text-xs">🥇</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.posts} posts</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
                      style={{
                        background: i === 0 ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.08)",
                        color: i === 0 ? "#f59e0b" : "#10b981",
                      }}>
                      #{i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Book service CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="rounded-3xl p-5 text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(15,118,110,0.08))",
                border: "1px solid rgba(16,185,129,0.2)",
              }}>
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-poppins font-semibold text-foreground mb-2 text-sm">
                Need a service?
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Book from 450+ verified providers instantly.
              </p>
              <Link href="/services"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                Browse Services <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}