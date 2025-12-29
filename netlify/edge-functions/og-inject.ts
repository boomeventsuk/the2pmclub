import type { Context } from "https://edge.netlify.com";

interface EventData {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  cityCode: string;
  start: string;
  location: string;
}

export default async function handler(request: Request, context: Context) {
  // Get the response from the origin (the SPA)
  const response = await context.next();
  
  // Only process HTML responses
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("text/html")) {
    return response;
  }

  // Extract slug from URL
  const url = new URL(request.url);
  const pathMatch = url.pathname.match(/^\/events\/([^/]+)\/?$/i);
  
  if (!pathMatch) {
    return response;
  }

  const slug = pathMatch[1].toUpperCase();

  try {
    // Fetch events data
    const eventsUrl = new URL("/events.json", url.origin);
    const eventsResponse = await fetch(eventsUrl.toString());
    
    if (!eventsResponse.ok) {
      return response;
    }

    const events: EventData[] = await eventsResponse.json();
    
    // Find matching event (case-insensitive)
    const event = events.find(e => e.slug.toUpperCase() === slug);
    
    if (!event) {
      return response;
    }

    // Format date for display
    const eventDate = new Date(event.start);
    const formattedDate = eventDate.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Build OG meta tags
    const city = event.location.split(',').pop()?.trim() || event.cityCode;
    const ogTitle = `THE 2PM CLUB Daytime Disco - ${city} | ${formattedDate}`;
    const ogDescription = event.subtitle || event.description || "4 hours of iconic 80s, 90s & 00s anthems. All the fun of a proper night out, home by 7-ish.";
    const ogImage = event.image || "https://www.the2pmclub.co.uk/lovable-uploads/070226_2PM_LUT_ANNSQ.jpg";
    const ogUrl = `https://www.the2pmclub.co.uk/events/${event.slug}/`;

    // Get the HTML content
    let html = await response.text();

    // Create the OG meta tags to inject
    const ogTags = `
    <!-- Dynamic OG Tags for ${event.slug} -->
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${ogUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="THE 2PM CLUB" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${ogImage}" />
    `;

    // Remove any existing OG tags to avoid duplicates
    html = html.replace(/<meta property="og:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta name="twitter:[^"]*"[^>]*>/gi, '');

    // Inject the new OG tags before </head>
    html = html.replace('</head>', `${ogTags}</head>`);

    // Return the modified HTML
    return new Response(html, {
      status: response.status,
      headers: response.headers
    });

  } catch (error) {
    console.error("OG inject error:", error);
    return response;
  }
}

export const config = {
  path: "/events/*"
};
