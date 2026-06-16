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
import { ContractTemplateData, ContractTemplateConfig } from './contract-template-registry'

export async function generateContractDocx(data: ContractTemplateData, config: ContractTemplateConfig): Promise<Blob> {
  const slateDark = config.secondaryColor.replace('#', '')
  const accentColor = config.primaryColor.replace('#', '')

  const doc = new Document({
    creator: data.agencyName,
    title: data.title,
    description: 'Generated Contract',
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
            text: 'Contract Document',
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
            text: 'Issued By:',
            run: { bold: true, color: slateDark }
          }),
          new Paragraph({
            text: data.agencyName
          }),
          new Paragraph({
            text: `Date: ${data.date}`,
            spacing: { before: 200 }
          }),
          new Paragraph({
            children: [new PageBreak()]
          }),

          // Content
          ...data.body.split('\n').map(line => new Paragraph({ text: line })),

          // Signatures
          new Paragraph({ text: 'Acceptance & Signatures', heading: HeadingLevel.HEADING_2, spacing: { before: 800 } }),
          new Paragraph({ text: 'Please sign below to indicate your acceptance of this contract.' }),
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
                    new Paragraph({ text: data.signedByName ? `Signed by: ${data.signedByName}` : '___________________________' }),
                    new Paragraph({ text: 'Client Signature', run: { bold: true, color: slateDark }, spacing: { before: 100 } }),
                    new Paragraph({ text: data.clientName }),
                    new Paragraph({ text: `Date: ${data.signedAt || '_________________'}` })
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
