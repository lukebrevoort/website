import fs from 'fs';
import path from 'path';

// Path to the problematic file
const filePath = path.join(process.cwd(), 'src/app/blog/posts/1bbf7879-ec1d-806a-9e84-cc8bfb5c1805/page.tsx');

// Read the file
console.log(`Reading file: ${filePath}`);
const content = fs.readFileSync(filePath, 'utf8');

// Replace the AWS URL with a placeholder
const cleanedContent = content.replace(
  /(https:\/\/prod-files-secure\.s3[^)"\s]+)/g,
  'https://placeholder-image-url.jpg'
);

// Write back the file
fs.writeFileSync(filePath, cleanedContent);
console.log(`File cleaned of credentials: ${filePath}`);

// Remove the file from git history (optional)
console.log('To completely remove this file from git history, you can run:');
console.log(`git filter-branch --force --index-filter "git rm --cached --ignore-unmatch src/app/blog/posts/1bbf7879-ec1d-806a-9e84-cc8bfb5c1805/page.tsx" --prune-empty --tag-name-filter cat -- --all`);