import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Twitter, Github, Mail, ArrowUpRight } from 'lucide-react';

export const Footer = ({ lang }: { lang: 'ko' | 'en' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="py-24 px-6 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          
          <h2 
            className="tracking-tight text-gray-900 leading-tight mb-8 font-bold text-[40px]"
            style={{ fontFamily: 'var(--font-pretendard)' }}
          >
            {lang === 'ko' ? (
              <>함께 멋진 프로젝트를<br/>시작해볼까요?</>
            ) : (
              <>Shall we start a great<br/>project together?</>
            )}
          </h2>
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=yoondabin916@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 font-bold tracking-tight group hover:text-pink-500 transition-colors text-[32px] text-[#0740bc]"
            style={{ fontFamily: 'var(--font-pretendard)' }}
          >
            yoondabin916@gmail.com <ArrowUpRight className="size-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </motion.div>


        <div className="flex flex-col md:flex-row items-center justify-between w-full border-t border-gray-100 pt-16 mt-8 gap-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl font-bold tracking-tighter"
            style={{ fontFamily: 'var(--font-pretendard)' }}
          >CreativeHub</motion.div>

          <div className="flex items-center gap-12">
            <button 
              onClick={() => window.open("https://www.instagram.com/toomanybean?igsh=MTc5bGlueWRwbzh0eQ%3D%3D&utm_source=qr", "_blank", "noopener,noreferrer")}
              className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors group cursor-pointer border-none outline-none"
              aria-label="Instagram"
            >
              <Instagram className="size-6 text-gray-400 group-hover:text-black transition-colors" />
            </button>
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=yoondabin916@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors group cursor-pointer border-none outline-none" 
              aria-label="Email"
            >
              <Mail className="size-6 text-gray-400 group-hover:text-black transition-colors" />
            </a>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-gray-400 font-medium tracking-tight"
            style={{ fontFamily: 'var(--font-pretendard)' }}
          >
            © {currentYear} Dabin Yoon. All rights reserved.
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
