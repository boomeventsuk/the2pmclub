import type { Context } from "https://edge.netlify.com";

/**
 * markdown-negotiate.ts
 *
 * Netlify Edge Function that implements Markdown for Agents.
 * When a request arrives with Accept: text/markdown, return /llms.txt
 * with Content-Type: text/markdown instead of serving HTML.
 *
 * AI agents (ChatGPT, Perplexity, Claude) use this to get clean
 * machine-readable content without parsing HTML or executing JS.
 */

export default async function handler(request: Request, context: Context) {
  const accept = request.headers.get("accept") || "";

  // Only intercept if the client explicitly wants markdown
  if (!accept.includes("text/markdown")) {
    return context.next();
  }

  const url = new URL(request.url);

  // Fetch /llms.txt from origin
  const llmsUrl = new URL("/llms.txt", url.origin);
  const llmsResponse = await fetch(llmsUrl.toString());

  if (!llmsResponse.ok) {
    return context.next();
  }

  const text = await llmsResponse.text();

  return new Response(text, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=UTF-8",
      "Cache-Control": "public, max-age=3600",
      "X-Markdown-Tokens": String(text.length),
    },
  });
}

export const config = {
  path: "/*",
};
