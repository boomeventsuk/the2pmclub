import { useEffect, useState } from 'react';
import { loadAllEvents } from '../utils/eventUtils';

interface EventLink {
  slug: string;
  title: string;
  city: string;
  date: string;
}

export const EventLinks = () => {
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

  if (eventLinks.length === 0) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">All Event Pages:</h3>
      <div className="grid gap-2">
        {eventLinks.map(({ slug, city, date }) => (
          <div key={slug} className="p-3 border border-gray-200 rounded">
            <div className="font-medium">{city} - {date}</div>
            <div className="text-sm text-gray-600">
              <a 
                href={`/events/${slug}`} 
                className="text-blue-600 hover:text-blue-800"
                target="_blank"
                rel="noopener"
              >
                /events/{slug}
              </a>
              {slug.includes('christmas') && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                  Christmas Event
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};