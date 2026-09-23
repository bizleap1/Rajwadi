'use client';

import React, { useRef } from 'react';
import Link from 'next/link';

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
}

// Add your real Google reviews here
const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Kirti Gahlod",
    rating: 5,
    date: "",
    text: "All their royal attires are very good, the quality and service are excellent, you will definitely get good compliments after wearing their attire...."
  },
  {
    id: "2",
    name: "radhika purohit",
    rating: 5,
    date: "",
    text: "I recently rented a Rajputi Poshak and had a wonderful experience. The outfit was beautiful, well-maintained, and looked exactly like traditional royal Rajputi attire. The fabric quality was good, the color was vibrant, and the overall look was very elegant..."
  },
  {
    id: "3",
    name: "Abhilasha Mohadikar",
    rating: 5,
    date: "",
    text: "I had an amazing experience renting my dress from here. The quality of the outfit was outstanding, clean, and well-maintained. It looked brand new! The fitting was perfect, and the team helped me choose the best style for my event..."
  },
  {
    id: "4",
    name: "Tulsi Dewangan",
    rating: 5,
    date: "",
    text: "Good experience 👍 loved my shopping experience here! The collection of Rajasthani rajwadi poshaks Beautiful and also quality of fabrics, gotta-patti work, and colors that truly represent Rajasthan's royal culture."
  },
  {
    id: "5",
    name: "PRIYANKA JANBANDHU",
    rating: 5,
    date: "",
    text: "This dress was rlly beautiful it's colour was so bright and contrasting. Perfectly defines the royal culture of Rajputs. All I wanna say is this is Amazing Poshak it absolutely deserves 5stars. Thankyou!"
  }
];

// Provide the Google Maps review link here
const GOOGLE_REVIEWS_LINK = "https://share.google/YJ5DZEUxOViPLYlUR";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1 text-[#D4AF37]">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-current' : 'fill-transparent stroke-current'}`}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={i < rating ? 0 : 1}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      ))}
    </div>
  );
};

export default function GoogleReviews() {

  if (REVIEWS.length === 0) {
    return (
      <section className="bg-[#FAF6F0] py-20 px-6 md:px-12 text-center border-t border-[#E6DCB8]/50">
        <h2 className="text-3xl md:text-4xl font-serif text-[#5C1A1B] mb-6">
          What customers say about Rajwadi
        </h2>
        <Link 
          href={GOOGLE_REVIEWS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-[#5C1A1B] text-[#FAF6F0] text-sm tracking-wider uppercase hover:bg-[#4A1516] transition-colors"
        >
          Read our reviews on Google →
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-[#F8F1E7] pt-0 pb-8 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-2 sm:mb-2.5">
            <span className="h-[1px] w-6 bg-[#855D25]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#855D25] font-medium font-sans">
              Google Reviews
            </span>
            <span className="h-[1px] w-6 bg-[#855D25]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-[#5C1A1B] mb-6 flex items-center justify-center gap-3 md:gap-4 flex-wrap">
            <svg viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10 shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            What customers say about Rajwadi
          </h2>
          <p className="text-[#8C7A5E] text-sm md:text-base max-w-2xl mx-auto">
            Real experiences shared by customers on Google.
          </p>
        </div>

        {/* Infinite Marquee */}
        <div className="relative mb-16 overflow-hidden flex group">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[0, 1].map((set) => (
              <div key={set} className="flex gap-6 md:gap-8 pr-6 md:pr-8">
                {REVIEWS.map((review) => (
                  <div 
                    key={`${set}-${review.id}`}
                    className="w-[85vw] md:w-[400px] shrink-0 bg-[#FAF6F0] border border-[#E6DCB8]/50 p-8 flex flex-col transition-all duration-300 hover:border-[#D4AF37]/50"
                  >
                <div className="flex justify-between items-start mb-6">
                  <StarRating rating={review.rating} />
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#8C7A5E] bg-[#E6DCB8]/20 px-2 py-1 rounded-sm">
                    <svg viewBox="0 0 24 24" width="12" height="12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google Review
                  </span>
                </div>
                
                <p className="text-[#5C1A1B] leading-relaxed mb-6 flex-grow text-sm md:text-base italic">
                  "{review.text}"
                </p>
                
                <div className="mt-auto">
                  <h4 className="text-[#5C1A1B] font-medium tracking-wide uppercase text-sm">
                    {review.name}
                  </h4>
                  {review.date && (
                    <p className="text-[#8C7A5E] text-xs mt-1">
                      {review.date}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

        <div className="text-center">
          <Link 
            href={GOOGLE_REVIEWS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full md:w-auto px-10 py-4 bg-[#5C1A1B] text-[#FAF6F0] text-sm tracking-wider uppercase hover:bg-[#4A1516] transition-colors"
          >
            Read More on Google →
          </Link>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}} />
    </section>
  );
}
