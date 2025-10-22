import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  coordinates: [number, number];
}

interface VacancyMapProps {
  jobs: Job[];
  recommendedCategory?: string;
}

const VacancyMap = ({ jobs, recommendedCategory }: VacancyMapProps) => {
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (map) return;

      const customIcon = new L.Icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
            <path fill="#C0C0C0" d="M16 0C7.2 0 0 7.2 0 16c0 12 16 24 16 24s16-12 16-24c0-8.8-7.2-16-16-16z"/>
            <circle cx="16" cy="16" r="8" fill="#1A1A1A"/>
          </svg>
        `),
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40],
      });

      const mapContainer = document.getElementById('map');
      if (!mapContainer || mapContainer.hasChildNodes()) return;

      const leafletMap = L.map('map').setView([56.0153, 92.8932], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(leafletMap);

      jobs.forEach((job) => {
        const isRecommended = recommendedCategory && job.category === recommendedCategory;
        
        const marker = L.marker(job.coordinates, { icon: customIcon }).addTo(leafletMap);
        
        const popupContent = `
          <div style="padding: 8px; min-width: 200px;">
            ${isRecommended ? `
              <div style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: hsl(var(--primary)); margin-bottom: 8px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span>Рекомендовано</span>
              </div>
            ` : ''}
            <h3 style="font-weight: 600; font-size: 16px; margin-bottom: 4px; color: hsl(var(--foreground));">${job.title}</h3>
            <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 8px;">${job.company}</p>
            <div style="margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; margin-bottom: 4px; color: hsl(var(--foreground));">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${job.location}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: hsl(var(--foreground));">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>${job.type}</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-weight: 700; color: hsl(var(--primary));">${job.salary}</span>
              <a href="/job/${job.id}" style="padding: 4px 12px; background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border-radius: 4px; text-decoration: none; font-size: 12px;">Подробнее</a>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent);
      });

      setMap(leafletMap);
    };

    loadMap();

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [jobs, recommendedCategory]);

  return (
    <div 
      id="map" 
      style={{ 
        height: '500px', 
        width: '100%', 
        borderRadius: '0.5rem',
        border: '1px solid hsl(var(--border))'
      }}
    />
  );
};

export default VacancyMap;
