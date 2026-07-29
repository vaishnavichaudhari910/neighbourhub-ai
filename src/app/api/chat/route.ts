import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { prisma } from "@/lib/prisma"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { messages, userMessage, language } = await req.json()

    // Fetch available services
    const services = await prisma.service.findMany({
      where: { isAvailable: true },
      include: {
        category: {
          select: {
            name: true,
            icon: true,
          },
        },
        provider: {
          select: {
            rating: true,
            city: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: 10,
    })

    const servicesContext = services
      .map(
        (service) =>
          `- ${service.title} | Category: ${service.category.name} | Provider: ${service.provider.user.name} | City: ${service.provider.city || "N/A"} | Price: ₹${service.price} | Rating: ${service.provider.rating}⭐ | ID: ${service.id}`
      )
      .join("\n")

    // Language instruction
    const languageInstruction =
      language === "Hindi"
        ? "ALWAYS respond in Hindi (Devanagari script) only."
        : language === "Marathi"
        ? "ALWAYS respond in Marathi (Devanagari script) only."
        : "ALWAYS respond in English only."

    const systemPrompt = `
You are NeighbourHub AI, a helpful assistant for a community service booking platform in India.

You help citizens:
1. Find and compare local services (plumber, electrician, carpenter, cleaning, etc.)
2. Get price information and provider ratings
3. Navigate to booking pages
4. Answer questions about the platform

Available services:
${servicesContext}

Today's date: ${new Date().toISOString().split("T")[0]}

Instructions:
- ${languageInstruction}
- Keep responses short and helpful (2-4 lines maximum)
- When suggesting a service, mention:
  • Provider name
  • Price
  • Rating
- If the user wants to book a service, append this exactly at the end:
  [BOOK:/booking?serviceId=SERVICE_ID&date=${new Date().toISOString().split("T")[0]}]
- Be friendly and conversational.
- If no matching service is found, politely apologize and suggest browsing the /services page.
`

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-8b",
      systemInstruction: systemPrompt,
    })

    // Convert chat history for Gemini
    const history = messages.slice(0, -1).map((message: any) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }))

    const chat = model.startChat({ history })

    const result = await chat.sendMessage(userMessage)
    const assistantMessage = result.response.text()

    return NextResponse.json({
      success: true,
      message: assistantMessage,
    })
  } catch (error: any) {
    console.error("Chat error:", error?.message)

    return NextResponse.json(
      {
        success: false,
        error: "Chat failed — " + error?.message,
      },
      {
        status: 500,
      }
    )
  }
}