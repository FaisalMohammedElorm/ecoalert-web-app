import { ArrowRight, Leaf } from 'lucide-react';

export default function HeroSection({ 
  greeting,
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
      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-14 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        <div className="flex-1 max-w-2xl w-full">
          {badge && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 mb-4 sm:mb-6 animate-fade-up text-xs">
              <Leaf size={12} sm:size={14} className="text-white" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">{badge}</span>
            </div>
          )}
          
          {greeting && (
            <p className="text-base sm:text-lg text-white/90 font-medium mb-2 animate-fade-up" style={{ animationDelay: '0.05s' }}>
              {greeting}
            </p>
          )}
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black text-white leading-tight mb-3 sm:mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {title}
          </h1>
          
          <p className="text-sm sm:text-base text-white/80 leading-snug mb-6 sm:mb-8 max-w-xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up w-full sm:w-auto" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={ctaAction}
              className="inline-flex items-center justify-center gap-2 bg-white text-eco-700 font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-eco-50 active:scale-95 transition-all duration-200 shadow-lg font-display text-sm sm:text-base"
            >
              {cta} <ArrowRight size={14} className="sm:w-4 sm:h-4" />
            </button>
            {secondaryCta && (
              <button
                onClick={secondaryCtaAction}
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-white/10 active:scale-95 transition-all duration-200 text-sm sm:text-base"
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
