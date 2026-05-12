/**
 * Build-time search index generator.
 * Reads all markdown docs, parses them, and outputs a MiniSearch index to public/search-index.json.
 * 
 * Run: npx tsx scripts/generate-search-index.ts
 */

import MiniSearch from 'minisearch';
import fs from 'fs';
import path from 'path';
import { DOCS_SECTIONS } from '../src/lib/docs-sections';

const DOCS_DIR = path.join(process.cwd(), 'src/content/docs');

interface SearchDocument {
  id: string;
  title: string;
  group: string;
  label: string;
  headings: string;
  body: string;
}

function stripMarkdown(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, ' ')    // strip fenced code blocks
    .replace(/`[^`]+`/g, ' ')           // strip inline code
    .replace(/!\[.*?\]\(.*?\)/g, ' ')   // strip images
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1') // extract link text
    .replace(/^#{1,6}\s+/gm, '')        // strip heading markers
    .replace(/[*_~`\[\]()>|\\-]/g, ' ') // strip remaining markdown syntax
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(raw: string, fallbackLabel: string): string {
  const match = raw.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallbackLabel;
}

function extractHeadings(raw: string): string {
  const matches = raw.match(/^#{2,3}\s+(.+)$/gm);
  if (!matches) return '';
  return matches.map(h => h.replace(/^#{2,3}\s+/, '')).join(' ');
}

function main() {
  console.log('📚 Generating search index...');
  
  const documents: SearchDocument[] = [];
  let skipped = 0;

  for (const section of DOCS_SECTIONS) {
    const filePath = path.join(DOCS_DIR, `${section.id}.md`);
    
    if (!fs.existsSync(filePath)) {
      skipped++;
      continue;
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    const title = extractTitle(raw, section.label);
    const headings = extractHeadings(raw);
    const body = stripMarkdown(raw);

    documents.push({
      id: section.id,
      title,
      group: section.group,
      label: section.label,
      headings,
      body: body.slice(0, 5000), // Cap body at 5000 chars to keep index lean
    });
  }

  const miniSearch = new MiniSearch<SearchDocument>({
    fields: ['title', 'headings', 'body', 'label'],
    storeFields: ['title', 'group', 'label'],
    searchOptions: {
      boost: { title: 3, label: 2.5, headings: 2, body: 1 },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  miniSearch.addAll(documents);

  const outputPath = path.join(process.cwd(), 'public/search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(miniSearch.toJSON()));

  const stats = fs.statSync(outputPath);
  const sizeKB = (stats.size / 1024).toFixed(1);

  console.log(`✅ Indexed ${documents.length} documents (skipped ${skipped} missing files)`);
  console.log(`📦 Output: public/search-index.json (${sizeKB} KB)`);
}

main();
