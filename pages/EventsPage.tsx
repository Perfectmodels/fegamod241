import React, { useState, useEffect } from 'react';
import { getEvents } from '../services/firebaseService';
import { Event } from '../types';
import SectionTitle from '../components/SectionTitle';
import Loading from '../components/Loading';

const EventCard: React.FC<{ event: Event, index: number }> = ({ event, index }) => (
  <div className={`flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden my-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
    <div className="md:w-1/2">
      <img src={event.imageUrl} alt={event.title} className="w-full h-64 md:h-full object-cover"/>
    </div>
    <div className="md:w-1/2 p-8">
      <p className="text-sm text-emerald font-bold mb-2 tracking-widest">{event.date}</p>
      <h3 className="font-serif text-3xl font-bold text-deep-black mb-3">{event.title}</h3>
      <p className="text-gray-500 mb-4">{event.location}</p>
      <p className="text-gray-700 mb-6">{event.description}</p>
      <button className="px-6 py-2 rounded-md font-bold bg-deep-black text-white hover:bg-metallic-gold hover:text-deep-black transition-all duration-300">
        S'inscrire à l'événement
      </button>
    </div>
  </div>
);

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError("Impossible de charger les événements.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);


  return (
    <div className="bg-off-white py-20 bg-pattern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Notre Agenda">Défilés, Salons & Workshops</SectionTitle>
        <p className="text-center max-w-3xl mx-auto text-gray-700 text-lg mb-12">
            Ne manquez aucun rendez-vous de la mode gabonaise. Retrouvez ici tous les événements organisés par FEGAMOD et ses partenaires.
        </p>

        {loading ? (
          <Loading message="Chargement des événements..." />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div>
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;