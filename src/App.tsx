import React, { useState, useCallback, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { BaroqueNav } from './components/BaroqueNav';
import { BaroqueHero } from './components/BaroqueHero';
import { GallerySection } from './components/GallerySection';
import { CityShowcase } from './components/CityShowcase';
import { ExperienceSection } from './components/ExperienceSection';
import { EventProgram } from './components/EventProgram';
import { BaroqueFooter } from './components/BaroqueFooter';
import { RSVPModal } from './components/RSVPModal';
import { AdminDashboard } from './components/AdminDashboard';

const CITIES = [
  {
    name: 'Dubai',
    date: 'March 28th–29th, 2026',
    venue: 'The Grand Celebration',
    image: '/assets/dubai.png',
    description: 'The countdown begins under the golden skyline of Dubai. Join DRA for the opening chapter of this global birthday celebration.',
  },
  {
    name: 'Canada',
    date: 'April 6th, 2026',
    venue: 'An Intimate Gathering',
    image: '/assets/canada.png',
    description: 'A refined celebration in the heart of Canada — fellowship, joy, and an evening of gratitude and connection.',
  },
  {
    name: 'Europe',
    date: 'May 1st–3rd, 2026',
    venue: 'A Continental Affair',
    image: '/assets/europe.png',
    description: 'Three days of celebration across Europe — elegance, culture, and the beauty of togetherness.',
  },
  {
    name: 'Lagos-Nigeria',
    date: 'May 6th–7th, 2026',
    venue: 'The Grand Finale',
    image: '/assets/lagos.png',
    description: 'The grand finale — a celebration of roots, legacy, and a life beautifully lived in the heart of Nigeria.',
  },
];

function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpCity, setRsvpCity] = useState('Dubai');
  const [showAdmin, setShowAdmin] = useState(false);

  // Check URL for /admin route
  useEffect(() => {
    const checkRoute = () => {
      setShowAdmin(window.location.hash === '#admin');
    };
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);

  const handleRSVP = useCallback((city?: string) => {
    if (city) setRsvpCity(city);
    setRsvpOpen(true);
  }, []);

  // Admin view
  if (showAdmin) {
    return (
      <div className="bg-noir text-parchment">
        <AdminDashboard onBack={() => { window.location.hash = ''; setShowAdmin(false); }} />
      </div>
    );
  }

  return (
    <div className="bg-noir text-parchment">
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}

      <BaroqueNav onRSVP={() => handleRSVP()} />

      <main className="snap-y-mandatory">
        <BaroqueHero onSaveDate={() => handleRSVP()} />

        <GallerySection />

        {CITIES.map((city, i) => (
          <CityShowcase
            key={city.name}
            city={city}
            index={i}
            onRSVP={(name) => handleRSVP(name)}
          />
        ))}

        <ExperienceSection />
        <EventProgram />
        <BaroqueFooter />
      </main>

      <RSVPModal
        isOpen={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        defaultCity={rsvpCity}
      />
    </div>
  );
}

export default App;
