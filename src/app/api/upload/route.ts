import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPG, PNG, WebP allowed" },
        { status: 400 }
      )
    }
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Max file size is 2MB" },
        { status: 400 }
      )
    
    // Convert to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    const dataUri = `data:${file.type};base64,${base64}`

    // Use Cloudinary REST API directly — no SDK
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
    const apiKey = process.env.CLOUDINARY_API_KEY!
    const apiSecret = process.env.CLOUDINARY_API_SECRET!

    // Generate signature
    const timestamp = Math.floor(Date.now() / 1000)
    const folder = "neighbourhub/avatars"

    const crypto = await import("crypto")
    const signStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
    const signature = crypto
      .createHash("sha1")
      .update(signStr)
      .digest("hex")

    // Upload via fetch to Cloudinary REST API
    const uploadFormData = new FormData()
    uploadFormData.append("file", dataUri)
    uploadFormData.append("api_key", apiKey)
    uploadFormData.append("timestamp", String(timestamp))
    uploadFormData.append("signature", signature)
    uploadFormData.append("folder", folder)
    uploadFormData.append("width", "300")
    uploadFormData.append("height", "300")
    uploadFormData.append("crop", "fill")
    uploadFormData.append("gravity", "face")

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadFormData,
      }
    )

    if (!response.ok) {
      const errData = await response.json()
      console.error("Cloudinary API error:", errData)
      return NextResponse.json(
        { success: false, error: errData.error?.message || "Upload failed" },
        { status: 500 }
      )
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error: any) {
    console.error("Upload error:", error?.message || error)
    return NextResponse.json(
      { success: false, error: error?.message || "Upload failed" },
      { status: 500 }
    )
  }
}