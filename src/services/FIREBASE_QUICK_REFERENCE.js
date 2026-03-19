// Firebase Integration Quick Reference

// ============================================
// AUTHENTICATION
// ============================================

import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isLoading, login, signup, logout, updateProfile } = useAuth();

  // Check if loading
  if (isLoading) return <div>Loading...</div>;

  // Check if logged in
  if (!user) return <div>Not logged in</div>;

  return <div>Logged in as {user.name}</div>;
}

// ============================================
// CREATE & GET REPORTS
// ============================================

import { createReport, getReports, getReportById } from './services/reportsService';

// Create report with image
async function submitReport() {
  const file = document.getElementById('imageInput').files[0];
  
  const result = await createReport({
    category: 'Plastic Waste',
    title: 'Mountain of plastic bottles',
    description: 'Found behind warehouse',
    coordinates: { latitude: 5.3521, longitude: -0.2038 },
    location: 'Accra, Ghana'
  }, file); // file is optional

  if (result.success) {
    console.log('Report created:', result.reportId);
  }
}

// Get all reports
async function viewAllReports() {
  const result = await getReports({
    status: 'pending', // Optional filter
    limit: 20
  });

  if (result.success) {
    result.reports.forEach(report => {
      console.log(report.title, report.status);
    });
  }
}

// Get single report
async function viewReport(reportId) {
  const result = await getReportById(reportId);
  return result.report;
}

// ============================================
// INTERACT WITH REPORTS
// ============================================

import { 
  addComment, 
  verifyReport, 
  updateReportStatus, 
  deleteReport 
} from './services/reportsService';

// Add comment
await addComment('report-id', 'This looks really bad!');

// Verify/Upvote report
await verifyReport('report-id');

// Update status
await updateReportStatus('report-id', 'verified'); // or 'resolved'

// Delete report (only your own)
await deleteReport('report-id');

// ============================================
// WASTE TRACKING
// ============================================

import { createTracking, getUserTrackings } from './services/reportsService';

// Create tracking entry
async function logWaste() {
  const result = await createTracking({
    category: 'Plastic Waste',
    quantity: 10,
    weight: 2.5,
    unit: 'kg',
    notes: 'Collected from beach cleanup'
  });

  if (result.success) {
    console.log('Tracked:', result.trackingId);
  }
}

// Get user's tracking history
async function viewTrackingHistory() {
  const { user } = useAuth();
  const result = await getUserTrackings(user.uid);
  
  if (result.success) {
    console.log(result.trackings); // Array of tracking entries
  }
}

// ============================================
// IMAGE UPLOAD
// ============================================

import { storageService } from './services/storageService';

// Upload image
async function uploadPhoto() {
  const file = document.getElementById('imageInput').files[0];
  
  const result = await storageService.uploadImage(file, 'reports');

  if (result.success) {
    console.log('Image uploaded:', result.url);
    // Use result.url to save in report
  }
}

// Upload profile picture
async function updateProfilePicture() {
  const file = document.getElementById('profileInput').files[0];
  
  const result = await storageService.uploadProfilePicture(file);

  if (result.success) {
    // Update user profile with image URL
    await updateProfile({ profilePictureUrl: result.url });
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

import { 
  CATEGORIES, 
  STATUS_CONFIG, 
  getCategoryConfig, 
  formatDate,
  reverseGeocode 
} from './services/reportsService';

// Get all categories
CATEGORIES.forEach(cat => {
  console.log(cat.label, cat.emoji, cat.color);
  // Plastic Waste ♻️ #2196F3
  // Organic Waste 🌿 #4CAF50
  // etc.
});

// Get status config
console.log(STATUS_CONFIG.pending);
// { label: 'Pending', color: '#FF9800', bg: '#FFF3E0', dot: '#FF9800' }

// Get category config by label
const config = getCategoryConfig('Plastic Waste');
console.log(config.emoji); // ♻️

// Format dates
console.log(formatDate(new Date()));        // "0m ago"
console.log(formatDate(Date.now() - 3600000)); // "1h ago"
console.log(formatDate(Date.now() - 86400000)); // "1d ago"

// Reverse geocode (convert coordinates to address)
const location = await reverseGeocode(5.3521, -0.2038);
console.log(location); // "Accra, Ghana"

// ============================================
// ERROR HANDLING PATTERN
// ============================================

async function handleOperation() {
  const result = await someOperation();
  
  if (result.success) {
    // Success 
    console.log(result.data);
  } else {
    // Error
    console.error(result.error);
    // Show error to user
  }
}

// ============================================
// IN FORMS
// ============================================

import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    
    if (result.success) {
      // Navigate to home
      navigate('/home');
    } else {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}

// ============================================
// REAL-TIME UPDATES (Advanced)
// ============================================

import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from './firebase';

function LiveReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Listen to all pending reports in real-time
    const q = query(
      collection(db, 'reports'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setReports(reportsData);
    });

    return () => unsubscribe();
  }, []);

  return <div>{reports.length} pending reports</div>;
}
