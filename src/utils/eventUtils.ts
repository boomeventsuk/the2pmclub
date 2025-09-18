interface EventJson {
  id: number;
  title: string;
  location: string;
  start: string;
  end: string;
  bookUrl: string;
  infoUrl: string;
  image: string;
  description: string;
}

// Generate slug from event data
export const generateSlug = (city: string, startDate: string, title: string): string => {
  const date = new Date(startDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const isChristmas = title.toLowerCase().includes('christmas');
  
  return isChristmas ? `${citySlug}-christmas-${year}-${month}-${day}` : `${citySlug}-${year}-${month}-${day}`;
};

// Parse venue and city from location string
export const parseLocation = (location: string): { venue: string; city: string; postcode: string } => {
  const parts = location.split(', ');
  const venue = parts[0] || location;
  const city = parts[1] || '';
  
  // Sample postcodes - in production, these would come from your data
  const postcodes: Record<string, string> = {
    'Coventry': 'CV1 1GX',
    'Milton Keynes': 'MK9 3PU',
    'Northampton': 'NN1 5BD',
    'Birmingham': 'B1 1AA',
    'Luton': 'LU1 2AA',
    'Bedford': 'MK40 2TH'
  };
  
  return {
    venue,
    city,
    postcode: postcodes[city] || ''
  };
};

// Load all events and generate slugs
export const loadAllEvents = async (): Promise<Array<{ slug: string; event: EventJson }>> => {
  try {
    const response = await fetch('/events.json');
    const events: EventJson[] = await response.json();
    
    return events.map(event => {
      const { city } = parseLocation(event.location);
      const slug = generateSlug(city, event.start, event.title);
      return { slug, event };
    });
  } catch (error) {
    console.error('Failed to load events:', error);
    return [];
  }
};