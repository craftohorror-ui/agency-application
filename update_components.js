const fs = require('fs');
const path = require('path');
const dir = 'src/components/contracts/templates';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'index.ts');

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  if (!content.includes('PremiumMarkdownComponents')) {
    content = content.replace(
      /import ReactMarkdown from 'react-markdown'/,
      `import ReactMarkdown from 'react-markdown'\nimport { PremiumMarkdownComponents } from '../premium-markdown'`
    );
  }

  content = content.replace(
    /<ReactMarkdown remarkPlugins={\[remarkGfm\]}>/g,
    `<ReactMarkdown remarkPlugins={[remarkGfm]} components={PremiumMarkdownComponents}>`
  );

  fs.writeFileSync(path.join(dir, file), content);
  console.log('Updated ' + file);
});
