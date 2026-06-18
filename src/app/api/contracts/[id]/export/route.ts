import { NextRequest, NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
import { cookies } from 'next/headers'
import { requireStaff } from '@/lib/auth'

// Vercel max duration limit might be an issue. PDF gen can be slow.
export const maxDuration = 60; // 60 seconds (max for Hobby is 10, Pro is 300)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth guard — must be before Puppeteer launch
    await requireStaff()

    const resolvedParams = await params
    const id = resolvedParams.id
    
    // Parse template ID from query params
    const searchParams = request.nextUrl.searchParams
    const templateId = searchParams.get('template') || 'modern-business'

    const origin = request.nextUrl.origin
    const url = `${origin}/print-contract/${id}?template=${templateId}`

    // Forward cookies to ensure requireStaff() succeeds in the print route
    const cookieStore = await cookies()
    const cookieString = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ')

    // Set Chromium flags
    chromium.setGraphicsMode = false

    const browser = await puppeteer.launch({
      args: chromium.args,
      // @ts-expect-error Types for sparticuz/chromium are incomplete
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      // @ts-expect-error Types for sparticuz/chromium are incomplete
      headless: chromium.headless,
    });

    const page = await browser.newPage()

    // Pass the user's session cookies
    await page.setExtraHTTPHeaders({
      cookie: cookieString
    })

    // Emulate screen rendering to bypass any native print layout shifts we don't want
    await page.emulateMediaType("screen")

    // Go to the print route and wait for all network requests (images, fonts, etc.) to settle
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000
    })

    // Strictly ensure all fonts are fully loaded
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    // Generate the PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      }
    })

    await browser.close()

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contract-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Failed to generate PDF via Puppeteer:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
