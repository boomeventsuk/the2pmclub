#!/usr/bin/env node
/**
 * Adds missing Tailwind utility class definitions to all static HTML pages.
 * These pages use Tailwind class names in their HTML but don't load Tailwind.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');

const PAGES = [
  'public/faqs/index.html',
  'public/group-bookings/index.html',
  'public/what-to-expect/index.html',
  'public/for-ai/index.html',
  'public/hubs/northampton/index.html',
  'public/hubs/bedford/index.html',
  'public/hubs/coventry/index.html',
  'public/hubs/milton-keynes/index.html',
  'public/hubs/luton/index.html',
  'public/hubs/leicester/index.html',
  'public/blog/what-is-a-daytime-disco/index.html',
  'public/blog/hen-do-daytime-disco/index.html',
  'public/blog/why-daytime-discos-are-popular/index.html',
];

// All Tailwind utility classes used across the static pages
const UTILITY_CSS = `
/* ===== Tailwind utility classes (standalone pages) ===== */
*,*::before,*::after{box-sizing:border-box}
.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}
.top-0{top:0}.left-0{left:0}.right-0{right:0}.bottom-0{bottom:0}
.z-50{z-index:50}.z-60{z-index:60}
.flex{display:flex}.inline-flex{display:inline-flex}.block{display:block}.hidden{display:none}.grid{display:grid}
.items-center{align-items:center}.items-start{align-items:start}
.justify-center{justify-content:center}.justify-between{justify-content:space-between}
.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}
.gap-2{gap:.5rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.gap-8{gap:2rem}.gap-10{gap:2.5rem}
.space-x-4>*+*{margin-left:1rem}.space-x-6>*+*{margin-left:1.5rem}
.container{width:100%;max-width:1280px}.mx-auto{margin-left:auto;margin-right:auto}
.px-4{padding-left:1rem;padding-right:1rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}
.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}
.py-4{padding-top:1rem;padding-bottom:1rem}.py-8{padding-top:2rem;padding-bottom:2rem}
.py-12{padding-top:3rem;padding-bottom:3rem}.py-16{padding-top:4rem;padding-bottom:4rem}
.pt-20{padding-top:5rem}.pt-24{padding-top:6rem}.pb-2{padding-bottom:.5rem}
.p-4{padding:1rem}.p-6{padding:1.5rem}.p-8{padding:2rem}
.m-0{margin:0}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}
.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.mt-1{margin-top:.25rem}
.mt-2{margin-top:.5rem}.mt-4{margin-top:1rem}.mt-8{margin-top:2rem}.mt-16{margin-top:4rem}
.my-4{margin-top:1rem;margin-bottom:1rem}
.w-full{width:100%}.w-auto{width:auto}.w-5{width:1.25rem}.w-6{width:1.5rem}
.h-8{height:2rem}.h-10{height:2.5rem}.h-16{height:4rem}.h-5{height:1.25rem}.h-6{height:1.5rem}
.min-h-screen{min-height:100vh}.max-w-4xl{max-width:56rem}.max-w-3xl{max-width:48rem}
.text-sm{font-size:.875rem}.text-lg{font-size:1.125rem}.text-xl{font-size:1.25rem}
.text-2xl{font-size:1.5rem}.text-3xl{font-size:1.875rem}.text-4xl{font-size:2.25rem}
.text-5xl{font-size:3rem}
.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.font-extrabold{font-weight:800}
.text-left{text-align:left}.text-center{text-align:center}
.leading-tight{line-height:1.25}.leading-relaxed{line-height:1.625}.leading-snug{line-height:1.375}
.tracking-wide{letter-spacing:.025em}.tracking-wider{letter-spacing:.05em}
.whitespace-nowrap{white-space:nowrap}
.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}.rounded-xl{border-radius:.75rem}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}
.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.3),0 4px 6px -4px rgba(0,0,0,.3)}
.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,.3),0 8px 10px -6px rgba(0,0,0,.3)}
.border{border-width:1px}.border-b{border-bottom-width:1px}.border-t{border-top-width:1px}
.border-l-4{border-left-width:4px}.border-l-8{border-left-width:8px}
.overflow-hidden{overflow:hidden}
.transition-colors{transition:color .15s ease,background-color .15s ease,border-color .15s ease}
.transition-all{transition:all .3s ease}
.cursor-pointer{cursor:pointer}
.opacity-90{opacity:.9}.opacity-0{opacity:0}
.ring-offset-background{--tw-ring-offset-color:hsl(var(--background))}
.backdrop-blur-md{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.backdrop-blur{backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.bg-background\\/90{background-color:hsla(var(--background),.9)}
.bg-background\\/95{background-color:hsla(var(--background),.95)}
.bg-background\\/60{background-color:hsla(var(--background),.6)}
.hover\\:text-primary:hover{color:hsl(var(--primary))}
.hover\\:text-foreground:hover{color:hsl(var(--foreground))}
.hover\\:bg-primary\\/90:hover{background-color:hsla(var(--primary),.9)}
.hover\\:bg-white\\/10:hover{background-color:rgba(255,255,255,.1)}
@media(min-width:768px){
  .md\\:p-12{padding:3rem}
  .md\\:text-5xl{font-size:3rem}
  .md\\:text-4xl{font-size:2.25rem}
  .md\\:grid-cols-2{grid-template-columns:repeat(2,1fr)}
  .md\\:grid-cols-3{grid-template-columns:repeat(3,1fr)}
}
`;

let updated = 0;

for (const page of PAGES) {
  const path = resolve(ROOT, page);
  let html;
  try {
    html = readFileSync(path, 'utf-8');
  } catch (e) {
    console.log(`SKIP: ${page} (not found)`);
    continue;
  }

  // Only add if not already present
  if (html.includes('Tailwind utility classes (standalone pages)')) {
    console.log(`SKIP: ${page} (already has utilities)`);
    continue;
  }

  // Insert before the first </style> tag
  html = html.replace('</style>', UTILITY_CSS + '\n</style>');

  writeFileSync(path, html);
  updated++;
  console.log(`OK: ${page}`);
}

console.log(`\nDone. Updated ${updated} pages.`);
