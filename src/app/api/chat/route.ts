import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    // Auth check — login nahi asel tar
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({
        success: true,
        message: "Please login first to use the AI assistant! 🔐\n\nClick **Sign In** to continue booking services.",
      })
    }
    const { messages, userMessage, language } = await req.json()

    const services = await prisma.service.findMany({
      where: { isAvailable: true },
      include: {
        category: { select: { name: true, icon: true } },
        provider: {
          select: {
            rating: true,
            city: true,
            user: { select: { name: true } },
          },
        },
      },
      take: 8,
    })

    const servicesContext = services.map(s =>
      `- ${s.title} | ${s.category.name} | Provider: ${s.provider.user.name} | ₹${s.price} | ${s.provider.rating}⭐ | ID: ${s.id}`
    ).join("\n")

    const languageInstruction =
      language === "Hindi" ? "Always respond in Hindi only." :
      language === "Marathi" ? "Always respond in Marathi only." :
      "Always respond in English only."

    const systemPrompt = `You are NeighbourHub AI assistant for a community service booking platform in India.
${languageInstruction}
Keep responses short and helpful (2-3 lines max).
When user wants to book a service, add this at the end of your response: [BOOK:/booking?serviceId=ACTUAL_SERVICE_ID&date=${new Date().toISOString().split("T")[0]}]
Replace ACTUAL_SERVICE_ID with the real ID from the services list.

Available services:
${servicesContext}`

    const chatMessages = [
      ...messages.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
      { role: "user", content: userMessage },
    ]

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...chatMessages,
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      console.error("Groq error:", JSON.stringify(err))
      throw new Error(err.error?.message || "Groq API failed")
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message?.content || "Sorry, I could not process that."

    return NextResponse.json({ success: true, message: assistantMessage })
  } catch (error: any) {
    console.error("Chat error:", error?.message)
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    )
  }
}