import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ImageIcon, MapPin, X, CheckCircle, Upload, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWaste } from '../contexts/WasteContext';
import { CATEGORIES, reverseGeocode, createReport } from '../services/reportsService';
import Toast, { useToast } from '../components/Toast';

export default function Report() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addWasteReport } = useWaste();
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const [form, setForm] = useState({ location: '', description: '', category: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const { toast, show: showToast, hide: hideToast } = useToast();

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFilePick = (e) => handleImageFile(e.target.files?.[0]);
  const handleDrop = (e) => { e.preventDefault(); handleImageFile(e.dataTransfer.files?.[0]); };
  const handleDragOver = (e) => e.preventDefault();

  const detectLocation = () => {
    if (!navigator.geolocation) { showToast('Geolocation is not supported by your browser.'); return; }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const address = await reverseGeocode(latitude, longitude);
        setForm(p => ({ ...p, location: address, lat: latitude, lng: longitude }));
        setIsDetecting(false);
      },
      () => { showToast('Could not get location. Please enter it manually.'); setIsDetecting(false); }
    );
  };

  const validate = () => {
    const errs = {};
    if (!form.location.trim()) errs.location = 'Location is required.';
    if (!form.category) errs.category = 'Please select a category.';
    if (!form.description.trim()) errs.description = 'Please describe the issue.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !user) { showToast('Please log in to submit a report', 'error'); return; }
    
    setIsSubmitting(true);
    const categoryObj = CATEGORIES.find(c => c.id === form.category);
    
    const result = await createReport({
      category: categoryObj?.label || form.category,
      title: form.description.substring(0, 100),
      description: form.description,
      coordinates: {
        latitude: form.lat || 5.5600 + (Math.random() - 0.5) * 0.1,
        longitude: form.lng || -0.2057 + (Math.random() - 0.5) * 0.1,
      },
      location: form.location,
    }, image);
    
    setIsSubmitting(false);
    
    if (result.success) {
      showToast('Report submitted successfully!', 'success');
      setSubmitted(true);
    } else {
      showToast(result.error || 'Failed to submit report', 'error');
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 pb-16 pt-12 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-eco-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <CheckCircle size={40} className="text-eco-500" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Report Submitted!</h2>
        <p className="text-gray-500 leading-relaxed mb-8">
          Thank you for helping keep our community clean. Your report has been received and will be reviewed shortly.
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={() => { setSubmitted(false); setForm({ location: '', description: '', category: '' }); setImage(null); setImagePreview(null); }} className="flex-1 btn-secondary">
            Report Another
          </button>
          <button onClick={() => navigate('/map')} className="flex-1 btn-primary">
            View on Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-16 pt-4">
      <Toast toast={toast} hide={hideToast} />
      <div className="mb-6 animate-fade-up">
        <h1 className="text-3xl font-display font-bold text-eco-500">Report an Issue</h1>
        <p className="text-gray-500 mt-1 text-sm">Help us identify and resolve environmental problems in your area.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image upload */}
        <div className="animate-fade-up stagger-1">
          <label className="label">Photo Evidence</label>
          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden aspect-video group">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={() => { setImage(null); setImagePreview(null); }} className="bg-white text-gray-800 rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2">
                  <X size={14} /> Remove Photo
                </button>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-eco-300 hover:bg-eco-50/50 transition-all cursor-pointer group"
              onClick={() => fileRef.current?.click()}
            >
              <div className="w-14 h-14 bg-gray-100 group-hover:bg-eco-100 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
                <Upload size={24} className="text-gray-400 group-hover:text-eco-500 transition-colors" />
              </div>
              <p className="text-gray-600 font-medium text-sm">Drop a photo here or click to upload</p>
              <p className="text-gray-400 text-xs mt-1">PNG, JPG up to 10MB</p>
              <div className="flex gap-2 justify-center mt-4">
                <button type="button" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors">
                  <ImageIcon size={13} /> Gallery
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); cameraRef.current?.click(); }} className="text-xs bg-eco-50 hover:bg-eco-100 text-eco-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors">
                  <Camera size={13} /> Camera
                </button>
              </div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFilePick} />
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFilePick} />
        </div>

        {/* Category */}
        <div className="animate-fade-up stagger-2">
          <label className="label">Issue Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setForm(p => ({ ...p, category: cat.id })); setErrors(e => ({ ...e, category: '' })); }}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  form.category === cat.id
                    ? 'border-eco-400 bg-eco-50 text-eco-700'
                    : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span className="truncate">{cat.label}</span>
              </button>
            ))}
          </div>
          {errors.category && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertTriangle size={11} />{errors.category}</p>}
        </div>

        {/* Location */}
        <div className="animate-fade-up stagger-3">
          <label className="label">Location</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className={`input-field pl-9 pr-28 ${errors.location ? 'border-red-300 focus:border-red-400' : ''}`}
              placeholder="Enter address or landmark..."
              value={form.location}
              onChange={set('location')}
            />
            <button
              type="button"
              onClick={detectLocation}
              disabled={isDetecting}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-eco-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-eco-600 transition-colors disabled:opacity-60"
            >
              {isDetecting ? 'Detecting…' : 'Auto-detect'}
            </button>
          </div>
          {errors.location && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertTriangle size={11} />{errors.location}</p>}
        </div>

        {/* Description */}
        <div className="animate-fade-up stagger-4">
          <label className="label">Description</label>
          <textarea
            className={`input-field resize-none h-32 ${errors.description ? 'border-red-300 focus:border-red-400' : ''}`}
            placeholder="Describe the issue in detail — type of waste, severity, any hazards…"
            value={form.description}
            onChange={set('description')}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertTriangle size={11} />{errors.description}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60 animate-fade-up stagger-5"
        >
          {isSubmitting ? (
            <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
          ) : (
            <><CheckCircle size={18} /> Submit Report</>
          )}
        </button>
      </form>
    </div>
  );
}
