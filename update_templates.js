const fs = require('fs');
const path = require('path');

const proposalsDir = path.join(__dirname, 'src/components/proposals/templates');
const contractsDir = path.join(__dirname, 'src/components/contracts/templates');

function processTemplates(dir, isProposal) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Add import if missing
    if (!content.includes('AgencyTemplateFooter')) {
      // Find the last import
      const lastImportMatch = content.match(/import .*['"].*['"]\n?/g);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        // Ensure we add a newline before the new import
        content = content.replace(lastImport, lastImport.trimEnd() + "\nimport { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'\n");
      } else {
        content = "import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'\n" + content;
      }
    }

    // Insert terms
    const typeStr = isProposal ? 'proposal' : 'contract';
    if (isProposal) {
      if (!content.includes('data.termsConditions')) {
        const termsRegex = /\{data\.terms\}/;
        if (termsRegex.test(content)) {
          const replacement = `{data.terms}
              {data.termsConditions && (
                <div className="mt-8 pt-6 border-t border-slate-200/60">
                  <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-xs">Agency Terms & Conditions</h4>
                  <div className="whitespace-pre-wrap">{data.termsConditions}</div>
                </div>
              )}
              {data.privacyPolicy && (
                <div className="mt-6">
                  <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-xs">Privacy Policy</h4>
                  <div className="whitespace-pre-wrap">{data.privacyPolicy}</div>
                </div>
              )}`;
          content = content.replace(termsRegex, replacement);
        }
      }
    } else {
      if (!content.includes('data.termsConditions')) {
        const bodyRegex = /\{data\.body\}/;
        if (bodyRegex.test(content)) {
          const replacement = `{data.body}
              {data.termsConditions && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Agency Terms & Conditions</h4>
                  <div className="whitespace-pre-wrap">{data.termsConditions}</div>
                </div>
              )}
              {data.privacyPolicy && (
                <div className="mt-8">
                  <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Privacy Policy</h4>
                  <div className="whitespace-pre-wrap">{data.privacyPolicy}</div>
                </div>
              )}`;
          content = content.replace(bodyRegex, replacement);
        }
      }
    }

    // Insert footer
    if (!content.includes('<AgencyTemplateFooter')) {
      const lastClosingDivIndex = content.lastIndexOf('</div>');
      if (lastClosingDivIndex !== -1) {
        content = content.slice(0, lastClosingDivIndex) + `\n        <AgencyTemplateFooter data={data} type="${typeStr}" />\n      ` + content.slice(lastClosingDivIndex);
      }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
  }
}

processTemplates(proposalsDir, true);
processTemplates(contractsDir, false);
