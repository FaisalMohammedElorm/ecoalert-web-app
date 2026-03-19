import { ArrowRight, Leaf } from 'lucide-react';

export default function HeroSection({ 
  title, 
  subtitle, 
  cta, 
  ctaAction,
  secondaryCta,
  secondaryCtaAction,
  image,
  badge = 'New' 
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl mb-8 mt-2">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-eco-600 via-eco-500 to-eco-400 opacity-95" />
      
      {/* Animated gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-float" />
      <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/2 animate-pulse-soft" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-8 py-12 sm:py-16 flex items-center justify-between gap-8">
        <div className="flex-1 max-w-2xl">
          {badge && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6 animate-fade-up">
              <Leaf size={14} className="text-white" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">{badge}</span>
            </div>
          )}
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white leading-tight mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {title}
          </h1>
          
          <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={ctaAction}
              className="inline-flex items-center justify-center gap-2 bg-white text-eco-700 font-semibold px-6 py-3 rounded-xl hover:bg-eco-50 active:scale-95 transition-all duration-200 shadow-lg font-display"
            >
              {cta} <ArrowRight size={16} />
            </button>
            {secondaryCta && (
              <button
                onClick={secondaryCtaAction}
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 active:scale-95 transition-all duration-200"
              >
                {secondaryCta}
              </button>
            )}
          </div>
        </div>

        {/* Right side - Image or Icon */}
        {image && (
          <div className="hidden lg:block flex-1 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
            {image}
          </div>
        )}
      </div>
    </div>
  );
}
