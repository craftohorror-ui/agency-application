import { 
  Document, 
  Packer, 
  Paragraph, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  BorderStyle, 
  WidthType, 
  AlignmentType,
  PageBreak
} from 'docx'
import { TemplateData } from './templates'
import { TemplateConfig } from './template-registry'

export async function generateProposalDocx(data: TemplateData, config: TemplateConfig): Promise<Blob> {
  const slateDark = config.secondaryColor.replace('#', '')
  const accentColor = config.primaryColor.replace('#', '')

  const doc = new Document({
    creator: data.agencyName,
    title: data.title,
    description: 'Generated Professional Proposal',
    styles: {
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          run: {
            font: 'Arial',
            size: 22, // 11pt
            color: '334155'
          },
          paragraph: {
            spacing: {
              after: 200,
              line: 300
            }
          }
        },
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: 56, // 28pt
            bold: true,
            color: slateDark
          },
          paragraph: {
            spacing: {
              before: 400,
              after: 200
            }
          }
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: 36, // 18pt
            bold: true,
            color: slateDark
          },
          paragraph: {
            spacing: {
              before: 400,
              after: 200
            }
          }
        }
      ]
    },
    sections: [
      {
        properties: {},
        children: [
          // Cover Page
          new Paragraph({
            text: data.agencyName,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.RIGHT,
            spacing: { before: 1000 }
          }),
          new Paragraph({
            text: 'Proposal Document',
            alignment: AlignmentType.RIGHT,
            run: { color: '94A3B8', bold: true }
          }),
          new Paragraph({
            text: '',
            spacing: { before: 3000 }
          }),
          new Paragraph({
            text: data.title,
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            text: `Prepared exclusively for ${data.clientCompany || data.clientName}`,
            run: { size: 32, color: '64748B' } // 16pt
          }),
          new Paragraph({
            text: '',
            spacing: { before: 3000 }
          }),
          new Paragraph({
            text: 'Prepared By:',
            run: { bold: true, color: slateDark }
          }),
          new Paragraph({
            text: data.agencyName
          }),
          ...(data.agencyEmail ? [new Paragraph({ text: data.agencyEmail })] : []),
          new Paragraph({
            text: `Date: ${data.date}`,
            spacing: { before: 200 }
          }),
          new Paragraph({
            children: [new PageBreak()]
          }),

          // Content
          ...(data.scope ? [
            new Paragraph({ text: 'Scope of Work', heading: HeadingLevel.HEADING_2 }),
            ...data.scope.split('\n').map(line => new Paragraph({ text: line }))
          ] : []),

          ...(data.deliverables ? [
            new Paragraph({ text: 'Deliverables', heading: HeadingLevel.HEADING_2 }),
            ...data.deliverables.split('\n').map(line => new Paragraph({ text: line }))
          ] : []),

          ...(data.timeline ? [
            new Paragraph({ text: 'Timeline & Process', heading: HeadingLevel.HEADING_2 }),
            ...data.timeline.split('\n').map(line => new Paragraph({ text: line }))
          ] : []),

          // Pricing
          new Paragraph({ text: 'Investment Summary', heading: HeadingLevel.HEADING_2 }),
          
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
              insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Item / Description', run: { bold: true, color: slateDark } })], margins: { top: 100, bottom: 100, left: 100 } }),
                  new TableCell({ children: [new Paragraph({ text: 'Qty', alignment: AlignmentType.CENTER, run: { bold: true, color: slateDark } })], margins: { top: 100, bottom: 100 } }),
                  new TableCell({ children: [new Paragraph({ text: 'Unit Price', alignment: AlignmentType.RIGHT, run: { bold: true, color: slateDark } })], margins: { top: 100, bottom: 100 } }),
                  new TableCell({ children: [new Paragraph({ text: 'Total', alignment: AlignmentType.RIGHT, run: { bold: true, color: slateDark } })], margins: { top: 100, bottom: 100, right: 100 } }),
                ],
              }),
              ...(data.items.length > 0 ? data.items.map(item => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: item.description, run: { bold: true } })], margins: { top: 150, bottom: 150, left: 100 } }),
                  new TableCell({ children: [new Paragraph({ text: String(item.qty), alignment: AlignmentType.CENTER })], margins: { top: 150, bottom: 150 } }),
                  new TableCell({ children: [new Paragraph({ text: `$${item.unitPrice.toFixed(2)}`, alignment: AlignmentType.RIGHT })], margins: { top: 150, bottom: 150 } }),
                  new TableCell({ children: [new Paragraph({ text: `$${item.total.toFixed(2)}`, alignment: AlignmentType.RIGHT, run: { bold: true } })], margins: { top: 150, bottom: 150, right: 100 } }),
                ]
              })) : [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: 'No line items specified.', alignment: AlignmentType.CENTER, run: { italics: true } })], columnSpan: 4, margins: { top: 150, bottom: 150 } })
                  ]
                })
              ]),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Total Investment', alignment: AlignmentType.RIGHT, run: { bold: true, color: slateDark } })], columnSpan: 3, margins: { top: 200, bottom: 200, right: 100 } }),
                  new TableCell({ children: [new Paragraph({ text: `$${data.totalAmount.toFixed(2)}`, alignment: AlignmentType.RIGHT, run: { bold: true, size: 28, color: accentColor } })], margins: { top: 200, bottom: 200, right: 100 } }),
                ]
              })
            ]
          }),

          ...(data.terms ? [
            new Paragraph({ text: 'Terms & Conditions', heading: HeadingLevel.HEADING_2 }),
            ...data.terms.split('\n').map(line => new Paragraph({ text: line, run: { size: 20 } })) // slightly smaller text
          ] : []),

          new Paragraph({ text: 'Acceptance of Proposal', heading: HeadingLevel.HEADING_2, spacing: { before: 800 } }),
          new Paragraph({ text: 'Please sign below to indicate your acceptance of this proposal.' }),
          new Paragraph({ text: '', spacing: { before: 800 } }),
          
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [
                    new Paragraph({ text: '___________________________' }),
                    new Paragraph({ text: 'Client Signature', run: { bold: true, color: slateDark }, spacing: { before: 100 } }),
                    new Paragraph({ text: data.clientName }),
                    new Paragraph({ text: 'Date: _________________' })
                  ]}),
                  new TableCell({ children: [
                    new Paragraph({ text: '___________________________' }),
                    new Paragraph({ text: 'Agency Signature', run: { bold: true, color: slateDark }, spacing: { before: 100 } }),
                    new Paragraph({ text: data.agencyName }),
                    new Paragraph({ text: 'Date: _________________' })
                  ]})
                ]
              })
            ]
          })

        ]
      }
    ]
  })

  return await Packer.toBlob(doc)
}
