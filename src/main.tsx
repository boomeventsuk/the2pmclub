import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// WebMCP: register tools so AI agents can discover site capabilities
// https://webmachinelearning.github.io/webmcp/
if (typeof navigator !== 'undefined' && 'modelContext' in navigator) {
  const nav = navigator as Navigator & {
    modelContext: {
      provideContext: (tools: unknown[]) => void;
    };
  };
  nav.modelContext.provideContext([
    {
      name: "listEvents",
      description: "Returns upcoming THE 2PM CLUB daytime disco events. Filter by city or get all. Each event includes title, date, venue, price, availability status, and booking URL.",
      inputSchema: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "Filter by city name: Northampton, Milton Keynes, Coventry, Bedford, Luton, or Leicester. Omit for all cities.",
            enum: ["Northampton", "Milton Keynes", "Coventry", "Bedford", "Luton", "Leicester"]
          },
          limit: {
            type: "number",
            description: "Maximum number of events to return. Defaults to all upcoming events."
          }
        },
        required: []
      },
      execute: async (input: { city?: string; limit?: number }) => {
        const response = await fetch('/events.json');
        const events = await response.json();
        const now = new Date().toISOString().slice(0, 10);
        let upcoming = events.filter((e: { start: string }) => e.start.slice(0, 10) >= now);
        if (input.city) {
          upcoming = upcoming.filter((e: { location: string }) =>
            e.location.toLowerCase().includes(input.city!.toLowerCase())
          );
        }
        if (input.limit) {
          upcoming = upcoming.slice(0, input.limit);
        }
        return upcoming;
      }
    }
  ]);
}

createRoot(document.getElementById("root")!).render(<App />);
