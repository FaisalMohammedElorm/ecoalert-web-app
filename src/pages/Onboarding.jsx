import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, MapPin, BarChart2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ecoAlertLogo from '../assets/EcoAlert.png';

const FEATURES = [
  { icon: MapPin, title: 'Report Issues', desc: 'Snap a photo and pin the exact location of any waste or hazard in seconds.' },
  { icon: Shield, title: 'Track Progress', desc: 'Follow your reports from submission to resolution in real time.' },
  { icon: BarChart2, title: 'See the Impact', desc: 'View community stats and watch your neighborhood transform.' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const handleGetStarted = () => {
    completeOnboarding();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-navy-deep relative overflow-hidden flex flex-col">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-electric-blue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 bg-emerald-green/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff opacity=.03%3E%3Cpath d=M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen px-4 sm:px-6 py-8 sm:py-12 w-full">
        
        {/* Logo + Hero */}
        <div className="flex flex-col items-center text-center pt-4 sm:pt-8 animate-fade-up max-w-2xl">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-pure-white/15 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 border border-pure-white/20 shadow-2xl animate-float p-3">
            <img src={ecoAlertLogo} alt="EcoAlert logo" className="w-full h-full object-contain" />
          </div>
          <p className="text-lime-accent text-xs sm:text-sm font-mono tracking-widest uppercase mb-2 sm:mb-4">EcoAlert v1.0</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-pure-white leading-[1.1] mb-3 sm:mb-5">
            Clean<br />Communities<br />
            <span className="text-electric-blue">Start With You.</span>
          </h1>
          <p className="text-pure-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-sm px-2">
            Report waste, track clean-ups, and join thousands making a real difference in Ghana.
          </p>
        </div>

        {/* Feature cards */}
        <div className="my-6 sm:my-8 w-full max-w-4xl grid grid-cols-1 gap-2.5 sm:gap-4 sm:grid-cols-3 px-4 sm:px-0">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-2 sm:gap-3 bg-pure-white/10 backdrop-blur-sm border border-pure-white/15 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 animate-fade-up h-full"
              style={{ animationDelay: `${0.1 * (i + 1)}s` }}
            >
              <div className="w-10 h-10 bg-pure-white/15 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="sm:w-5 sm:h-5 text-lime-accent" />
              </div>
              <div>
                <p className="text-pure-white font-semibold text-xs sm:text-sm">{title}</p>
                <p className="text-pure-white/70 text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="w-full max-w-sm space-y-2 sm:space-y-3 px-4 sm:px-0">
          <button
            onClick={handleGetStarted}
            className="w-full bg-electric-blue text-pure-white font-display font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-opacity-90 active:scale-95 transition-all duration-200 shadow-2xl shadow-electric-blue/30"
          >
            Get Started
            <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </button>
          <p className="text-center text-lime-accent/60 text-xs">
            Free forever · No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}
