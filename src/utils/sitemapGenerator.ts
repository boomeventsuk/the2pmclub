import { loadAllEvents } from './eventUtils';

export const generateSitemap = async (): Promise<string> => {
  const events = await loadAllEvents();
  
  const urls = [
    {
      loc: 'https://www.the2pmclub.co.uk/',
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      loc: 'https://www.the2pmclub.co.uk/events.json',
      changefreq: 'hourly', 
      priority: '0.7'
    },
    ...events.map(({ slug }) => ({
      loc: `https://www.the2pmclub.co.uk/events/${slug}/`,
      changefreq: 'weekly',
      priority: '0.8'
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Generate sitemap and save to public folder (for build-time generation)
export const saveSitemap = async (): Promise<void> => {
  const sitemap = await generateSitemap();
  
  // In a real build process, you'd write this to public/sitemap.xml
  // For now, we'll log it to show the output
  console.log('Generated sitemap:', sitemap);
  
  // You could also use this to download the sitemap in development
  if (typeof window !== 'undefined') {
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  }
};