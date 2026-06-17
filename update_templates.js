const fs = require('fs');
const path = require('path');
const dir = 'src/components/contracts/templates';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'modern-business.tsx' && f !== 'index.ts');

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  if (!content.includes('import ReactMarkdown')) {
    content = content.replace(
      /import \{ AgencyTemplateFooter \} from '@\/components\/AgencyTemplateFooter'/,
      `import { AgencyTemplateFooter } from '@/components/AgencyTemplateFooter'\nimport ReactMarkdown from 'react-markdown'\nimport remarkGfm from 'remark-gfm'`
    );
  }

  content = content.replace(/className="([^"]*prose[^"]*?)(?:\s+whitespace-pre-wrap)?"([^>]*)>\s*\{data\.body\}/g, 
    `className="$1"$2>\n          <ReactMarkdown remarkPlugins={[remarkGfm]}>\n            {data.body}\n          </ReactMarkdown>`);

  fs.writeFileSync(path.join(dir, file), content);
  console.log('Updated ' + file);
});
