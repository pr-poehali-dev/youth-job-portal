import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import 'leaflet/dist/leaflet.css';

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
  return (
    <MapContainer
      center={[56.0153, 92.8932]}
      zoom={12}
      style={{ height: '500px', width: '100%', borderRadius: '0.5rem' }}
      className="border border-border"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {jobs.map((job) => {
        const isRecommended = recommendedCategory && job.category === recommendedCategory;
        
        return (
          <Marker 
            key={job.id} 
            position={job.coordinates}
            icon={customIcon}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                {isRecommended && (
                  <div className="flex items-center gap-1 text-xs text-primary mb-2">
                    <Icon name="Star" size={12} />
                    <span>Рекомендовано</span>
                  </div>
                )}
                <h3 className="font-semibold text-base mb-1">{job.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Icon name="MapPin" size={12} className="text-muted-foreground" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Icon name="Clock" size={12} className="text-muted-foreground" />
                    <span>{job.type}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{job.salary}</span>
                  <Link to={`/job/${job.id}`}>
                    <Button size="sm" className="h-7 text-xs">
                      Подробнее
                    </Button>
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default VacancyMap;
