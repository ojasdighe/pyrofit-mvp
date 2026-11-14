import React from 'react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      initials: 'SR',
      name: 'Sneha R.',
      role: 'First-time marathoner, Pune',
      highlight: 'Never hit the wall.',
      quote:
        'First marathon, zero clue how to train. STRIDD gave me a 16-week Daniels plan — finished TMM in 4:52 and never hit the wall.',
    },
    {
      initials: 'AD',
      name: 'Arjun D.',
      role: 'VDHM finisher, Delhi',
      highlight: 'Finally broke 2:05.',
      quote:
        'I was stuck at 2:15 for my half. Used the 80/20 plan for VDHM, finally broke 2:05. The easy-day pacing was the unlock.',
    },
    {
      initials: 'MK',
      name: 'Meera K.',
      role: 'Recreational runner, Bengaluru',
      highlight: '58-minute PB.',
      quote:
        'Built my plan in two minutes and printed a clean PDF to pin on my fridge. Trained 12 weeks for TCS 10K and ran a 58-minute PB.',
    },
    {
      initials: 'VS',
      name: 'Vikram S.',
      role: 'Tokyo Marathon finisher, Mumbai',
      highlight: 'First world major.',
      quote:
        'Ran my first world major in Tokyo off a STRIDD Lydiard plan. Having the base phase mapped out week by week kept me honest.',
    },
    {
      initials: 'DN',
      name: 'Deepa N.',
      role: 'Run club pacer, Bengaluru',
      highlight: 'I send everyone to STRIDD.',
      quote:
        'I run a group of 30 runners in Indiranagar. I send everyone to STRIDD now — ten methodologies, free, and they can pick what fits.',
    },
    {
      initials: 'KP',
      name: 'Karthik P.',
      role: 'Weekend warrior, Hyderabad',
      highlight: 'Legs felt fresh on race day.',
      quote:
        'Did the Goa River Marathon on a Pfitzinger plan from STRIDD. The recovery weeks were perfectly timed — legs felt fresh on race day.',
    },
  ];

  return (
    <section id="testimonials" className="py-24 px-8 md:px-20 border-t border-border bg-carbon">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-14 flex-wrap gap-6">
          <div>
            <div className="text-strava font-space text-[9px] tracking-[0.6em] uppercase mb-4">
              From the field
            </div>
            <h2
              className="italic-heavy leading-[0.88] tracking-tighter"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
            >
              BUILT BY<br />
              <span className="text-faint">RUNNERS.</span>
            </h2>
          </div>
          <div className="text-muted text-sm font-light max-w-sm leading-relaxed">
            Every methodology in STRIDD is battle-tested by the running community. No fluff. Just precision training science — free to use.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-top border border-border">
          {reviews.map((rev, idx) => (
            <figure
              key={idx}
              className="bg-carbon p-8 md:p-10 flex flex-col justify-between h-full hover:bg-surface transition-colors"
            >
              <div>
                <div className="italic-heavy text-strava text-lg mb-4">
                  "{rev.highlight}"
                </div>
                <blockquote className="text-muted text-sm leading-relaxed font-light mb-8">
                  {rev.quote}
                </blockquote>
              </div>
              <figcaption className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-strava/15 border border-strava/30 flex items-center justify-center italic-heavy text-sm text-strava">
                  {rev.initials}
                </div>
                <div>
                  <div className="italic-heavy text-sm text-fg">{rev.name}</div>
                  <div className="text-[10px] font-space text-faint uppercase tracking-widest">
                    {rev.role}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
