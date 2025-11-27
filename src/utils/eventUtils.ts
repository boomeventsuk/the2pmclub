interface EventJson {
  id: number;
  eventCode: string;
  eventbriteId: string;
  title: string;
  location: string;
  start: string;
  end: string;
  bookUrl: string;
  infoUrl: string;
  image: string;
  description: string;
  subtitle?: string;
  fullDescription?: string;
  highlights?: string;
}

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

// Load all events using eventCode as the key
export const loadAllEvents = async (): Promise<Array<{ slug: string; event: EventJson }>> => {
  try {
    const response = await fetch('/events.json');
    const events: EventJson[] = await response.json();
    
    return events.map(event => {
      return { slug: event.eventCode, event };
    });
  } catch (error) {
    console.error('Failed to load events:', error);
    return [];
  }
};