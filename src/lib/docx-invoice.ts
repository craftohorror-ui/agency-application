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
  TextRun
} from 'docx'
import { InvoiceTemplateData, InvoiceTemplateConfig } from './invoice-template-registry'

export async function generateInvoiceDocx(data: InvoiceTemplateData, config: InvoiceTemplateConfig): Promise<Blob> {
  const slateDark = config.secondaryColor.replace('#', '')
  const accentColor = config.primaryColor.replace('#', '')

  const doc = new Document({
    creator: data.agencyName,
    title: `Invoice ${data.number}`,
    description: 'Generated Invoice',
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
          // Header
          new Paragraph({
            text: data.agencyName,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.RIGHT,
            spacing: { before: 200 }
          }),
          ...(data.agencyPhone ? [new Paragraph({ text: data.agencyPhone, alignment: AlignmentType.RIGHT })] : []),
          ...(data.agencyEmail ? [new Paragraph({ text: data.agencyEmail, alignment: AlignmentType.RIGHT })] : []),
          ...(data.agencyWebsite ? [new Paragraph({ text: data.agencyWebsite, alignment: AlignmentType.RIGHT })] : []),
          
          new Paragraph({
            text: 'INVOICE',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 1000 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Invoice Number: `, bold: true }),
              new TextRun({ text: data.number })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Status: `, bold: true }),
              new TextRun({ text: data.status.toUpperCase() })
            ],
            spacing: { after: 600 }
          }),

          // Meta Info
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
                  new TableCell({
                    children: [
                      new Paragraph({ text: 'Billed To:', run: { bold: true, color: '94A3B8' } }),
                      new Paragraph({ text: data.clientName, run: { bold: true } }),
                      ...(data.clientCompany ? [new Paragraph({ text: data.clientCompany })] : [])
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: 'Issue Date:', run: { bold: true, color: '94A3B8' } }),
                      new Paragraph({ text: data.issueDate }),
                      new Paragraph({ text: 'Due Date:', run: { bold: true, color: '94A3B8' }, spacing: { before: 200 } }),
                      new Paragraph({ text: data.dueDate })
                    ]
                  })
                ]
              })
            ]
          }),
          
          new Paragraph({ text: '', spacing: { before: 800 } }),

          // Line Items
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Description', run: { bold: true } })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Qty', run: { bold: true }, alignment: AlignmentType.RIGHT })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Price', run: { bold: true }, alignment: AlignmentType.RIGHT })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Amount', run: { bold: true }, alignment: AlignmentType.RIGHT })] })
                ]
              }),
              ...data.items.map(item => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: item.description })] }),
                  new TableCell({ children: [new Paragraph({ text: item.qty.toString(), alignment: AlignmentType.RIGHT })] }),
                  new TableCell({ children: [new Paragraph({ text: item.unit_price.toFixed(2), alignment: AlignmentType.RIGHT })] }),
                  new TableCell({ children: [new Paragraph({ text: (item.qty * item.unit_price).toFixed(2), alignment: AlignmentType.RIGHT })] })
                ]
              }))
            ]
          }),

          new Paragraph({ text: '', spacing: { before: 600 } }),

          // Totals
          new Table({
            width: { size: 50, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.RIGHT,
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
                  new TableCell({ children: [new Paragraph({ text: 'Subtotal:' })] }),
                  new TableCell({ children: [new Paragraph({ text: data.subtotal.toFixed(2), alignment: AlignmentType.RIGHT })] })
                ]
              }),
              ...(data.discountAmount > 0 ? [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `Discount:` })] }),
                    new TableCell({ children: [new Paragraph({ text: `-${data.discountAmount.toFixed(2)}`, alignment: AlignmentType.RIGHT })] })
                  ]
                })
              ] : []),
              ...(data.taxAmount > 0 ? [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `Tax:` })] }),
                    new TableCell({ children: [new Paragraph({ text: data.taxAmount.toFixed(2), alignment: AlignmentType.RIGHT })] })
                  ]
                })
              ] : []),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Total:', run: { bold: true } })] }),
                  new TableCell({ children: [new Paragraph({ text: data.total.toFixed(2), run: { bold: true }, alignment: AlignmentType.RIGHT })] })
                ]
              }),
              ...(data.amountPaid > 0 ? [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: 'Amount Paid:' })] }),
                    new TableCell({ children: [new Paragraph({ text: `-${data.amountPaid.toFixed(2)}`, alignment: AlignmentType.RIGHT })] })
                  ]
                })
              ] : []),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Balance Due:', run: { bold: true } })] }),
                  new TableCell({ children: [new Paragraph({ text: data.balanceDue.toFixed(2), run: { bold: true }, alignment: AlignmentType.RIGHT })] })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { before: 800 } }),

          ...(data.showPaymentHistory && data.payments && data.payments.length > 0 ? [
            new Paragraph({ text: 'Payment History', heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: 'Date', run: { bold: true } })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Method', run: { bold: true } })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Reference', run: { bold: true } })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Amount', run: { bold: true }, alignment: AlignmentType.RIGHT })] })
                  ]
                }),
                ...data.payments.map(p => new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: new Date(p.paid_at).toLocaleDateString() })] }),
                    new TableCell({ children: [new Paragraph({ text: p.method?.replace('_', ' ') || '-' })] }),
                    new TableCell({ children: [new Paragraph({ text: p.reference || '-' })] }),
                    new TableCell({ children: [new Paragraph({ text: p.amount.toFixed(2), alignment: AlignmentType.RIGHT })] })
                  ]
                }))
              ]
            }),
            new Paragraph({ text: '', spacing: { before: 800 } }),
          ] : []),

          ...(data.paymentInstructions ? [
            new Paragraph({ text: 'Payment Instructions', heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: data.paymentInstructions, spacing: { after: 400 } })
          ] : []),

          ...(data.notes ? [
            new Paragraph({ text: 'Notes', heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: data.notes })
          ] : [])
        ]
      }
    ]
  })

  return Packer.toBlob(doc)
}
