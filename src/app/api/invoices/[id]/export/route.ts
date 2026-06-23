import { NextRequest, NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
import { cookies } from 'next/headers'
import { requireStaff } from '@/lib/auth'

// Vercel max duration limit might be an issue. PDF gen can be slow.
export const maxDuration = 60; // 60 seconds (max for Hobby is 10, Pro is 300)
export const dynamic = 'force-dynamic';

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
    const url = `${origin}/print-invoice/${id}?template=${templateId}`

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

    // Emulate print rendering to allow native browser pagination to work
    await page.emulateMediaType("print")

    // Go to the print route and wait for all network requests (images, fonts, etc.) to settle
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000
    })

    // Strictly ensure all fonts are fully loaded
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    // --- Dynamic Single-Page Scaling Logic ---
    const pdfConfig = {
      format: 'A4' as const,
      margin: {
        top: 12, // mm
        right: 10,
        bottom: 12,
        left: 10
      }
    };

    const A4_HEIGHT_MM = 297;
    const PX_PER_MM = 96 / 25.4;
    // Calculate precise printable pixel height available on one page
    const availableHeightPx = (A4_HEIGHT_MM - pdfConfig.margin.top - pdfConfig.margin.bottom) * PX_PER_MM;

    const scaleFactor = await page.evaluate((availableHeight) => {
      // document.documentElement.scrollHeight reliably captures the full rendered height
      const renderedHeight = document.documentElement.scrollHeight;
      
      if (renderedHeight > availableHeight) {
        return availableHeight / renderedHeight;
      }
      return 1;
    }, availableHeightPx);

    // Apply minimum readability threshold (85%)
    // If it requires scaling below 85% to fit on one page, allow it to overflow to multiple pages
    // to preserve human readability.
    const MIN_SCALE = 0.85;
    const finalScale = scaleFactor >= MIN_SCALE ? scaleFactor : 1;
    // ------------------------------------------

    // Generate the PDF buffer
    const pdfBuffer = await page.pdf({
      format: pdfConfig.format,
      printBackground: true,
      preferCSSPageSize: true,
      scale: finalScale,
      margin: {
        top: `${pdfConfig.margin.top}mm`,
        right: `${pdfConfig.margin.right}mm`,
        bottom: `${pdfConfig.margin.bottom}mm`,
        left: `${pdfConfig.margin.left}mm`
      }
    })

    await browser.close()

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Failed to generate PDF via Puppeteer:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
