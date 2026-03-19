import { createContext, useContext, useEffect, useState } from 'react';

const WasteContext = createContext(null);

// Sample seed reports with Ghana-specific locations
const SEED_REPORTS = [
  {
    id: 'seed-1',
    userId: 'system',
    imageUri: null,
    location: 'Kwame Nkrumah Avenue, Accra',
    description: 'Large pile of mixed plastic waste blocking the drainage channel.',
    category: 'Plastic Waste',
    status: 'pending',
    lat: 5.5600,
    lng: -0.2057,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'seed-2',
    userId: 'system',
    imageUri: null,
    location: 'Osu, Accra',
    description: 'Illegal dumping site near the market. Organic and electronic waste mixed.',
    category: 'Mixed Waste',
    status: 'verified',
    lat: 5.5557,
    lng: -0.1837,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'seed-3',
    userId: 'system',
    imageUri: null,
    location: 'Tema, Greater Accra',
    description: 'Industrial chemical waste improperly disposed near residential area.',
    category: 'Hazardous Waste',
    status: 'resolved',
    lat: 5.6698,
    lng: -0.0166,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'seed-4',
    userId: 'system',
    imageUri: null,
    location: 'Madina, Accra',
    description: 'Broken road with potholes causing traffic hazard and pooling waste water.',
    category: 'Road Hazard',
    status: 'pending',
    lat: 5.6804,
    lng: -0.1648,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'seed-5',
    userId: 'system',
    imageUri: null,
    location: 'Dansoman, Accra',
    description: 'Overflowing public rubbish bin, area smells and attracts pests.',
    category: 'Organic Waste',
    status: 'verified',
    lat: 5.5342,
    lng: -0.2546,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export function WasteProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [pickupRequests, setPickupRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('eco_reports');
    const storedPickups = localStorage.getItem('eco_pickups');
    const userReports = stored ? JSON.parse(stored) : [];
    // Merge seed reports with user reports
    setReports([...SEED_REPORTS, ...userReports]);
    setPickupRequests(storedPickups ? JSON.parse(storedPickups) : []);
    setIsLoading(false);
  }, []);

  const addWasteReport = (report) => {
    const newReport = {
      ...report,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setReports(prev => {
      const updated = [...prev, newReport];
      // Only persist user reports (not seeds)
      const userReports = updated.filter(r => !r.id.startsWith('seed-'));
      localStorage.setItem('eco_reports', JSON.stringify(userReports));
      return updated;
    });
    return newReport;
  };

  const addPickupRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPickupRequests(prev => {
      const updated = [...prev, newRequest];
      localStorage.setItem('eco_pickups', JSON.stringify(updated));
      return updated;
    });
    return newRequest;
  };

  const getPendingReports = () => reports.filter(r => r.status === 'pending');
  const getVerifiedReports = () => reports.filter(r => r.status === 'verified');
  const getResolvedReports = () => reports.filter(r => r.status === 'resolved');

  return (
    <WasteContext.Provider value={{
      reports, pickupRequests, isLoading,
      addWasteReport, addPickupRequest,
      getPendingReports, getVerifiedReports, getResolvedReports,
    }}>
      {children}
    </WasteContext.Provider>
  );
}

export function useWaste() {
  const ctx = useContext(WasteContext);
  if (!ctx) throw new Error('useWaste must be used within WasteProvider');
  return ctx;
}
