import React from 'react';

export default function PartnerLogos() {
  const partners = [
    "Volkswagen", "Samsung", "Cisco", "Vimeo", "P&G", "HP", "Citi", "Ericsson"
  ];

  return (
    <section className="w-full bg-[#f8f9fa] py-8 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col items-center">
        <p className="text-[13px] text-gray-500 font-normal mb-8 text-center">
          Trusted by over 17,000 companies and millions of learners around the world
        </p>
        
        <div className="w-full flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((partner) => (
            <div key={partner} className="flex items-center justify-center">
               <span className="text-xl md:text-2xl font-bold tracking-tighter text-slate-700 select-none">
                 {partner}
               </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
