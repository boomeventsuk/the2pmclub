import { Link } from 'react-router-dom';
import { loadAllEvents } from '@/utils/eventUtils';
import { useEffect, useState } from 'react';

interface EventLink {
  slug: string;
  title: string;
  city: string;
  date: string;
}

export default function DevEventsIndex() {
  // Only show in development
  if (!import.meta.env.DEV) return null;

  const [eventLinks, setEventLinks] = useState<EventLink[]>([]);

  useEffect(() => {
    const loadLinks = async () => {
      const events = await loadAllEvents();
      const links = events.map(({ slug, event }) => {
        const city = event.location.split(', ')[1] || 'Unknown';
        const date = new Date(event.start).toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        
        return {
          slug,
          title: event.title,
          city,
          date
        };
      });
      
      setEventLinks(links);
    };

    loadLinks();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Dev: Events Index</h1>
      <p>Development-only route for QA testing event pages.</p>
      <ul style={{ marginTop: 16 }}>
        {eventLinks.map(({ slug, city, date }) => (
          <li key={slug} style={{ margin: '8px 0' }}>
            <Link 
              to={`/events/${slug}/`}
              style={{ color: '#0066cc', textDecoration: 'underline' }}
            >
              {city} — {date} (/events/{slug}/)
            </Link>
            {slug.includes('christmas') && (
              <span style={{ 
                marginLeft: 8, 
                padding: '2px 6px', 
                backgroundColor: '#fee', 
                color: '#c00', 
                fontSize: '0.8em',
                borderRadius: 3
              }}>
                Christmas Event
              </span>
            )}
          </li>
        ))}
      </ul>
      <p style={{ marginTop: 24 }}>
        <Link to="/" style={{ color: '#0066cc' }}>← Back to homepage</Link>
      </p>
    </main>
  );
}