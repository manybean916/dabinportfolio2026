import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Mail, Github, ArrowUpRight } from 'lucide-react';

// 인스타그램 작업물이 준비되면 true로 바꾸면 아이콘이 다시 나타난다
const SHOW_INSTAGRAM = false;

export const Footer = ({ lang }: { lang: 'ko' | 'en' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#80605C] text-[#FAF9F7]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-28 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#FAF9F7]/60">
            Get in touch
          </p>

          {/* 세리프는 공통. 한글엔 이탤릭체가 없어 영문일 때만 기울인다 */}
          <h2
            className={`mt-8 leading-[1.25] text-[clamp(2rem,5.5vw,4rem)] break-keep ${
              lang === 'ko' ? '' : 'italic leading-[1.05]'
            }`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {lang === 'ko' ? (
              <>함께 멋진 프로젝트를<br />시작해볼까요?</>
            ) : (
              <>Shall we start something<br />great together?</>
            )}
          </h2>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=yoondabin916@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 mt-12 px-8 py-4 bg-[#FAF9F7] text-[#810000] rounded-full text-sm md:text-base font-bold hover:bg-[#1A1512] hover:text-[#FAF9F7] transition-colors"
          >
            yoondabin916@gmail.com
            <ArrowUpRight className="size-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        <div className="mt-28 pt-10 border-t border-[#FAF9F7]/25 flex flex-col md:flex-row items-center justify-between gap-8">
          <span
            className="text-2xl md:text-3xl italic tracking-[0.06em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            YOONDABIN
          </span>

          <div className="flex items-center gap-3">
            {SHOW_INSTAGRAM && (
              <a
                href="https://www.instagram.com/bean.folder?stkn=ZXE0YXhvODZnZ29l&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-[#FAF9F7]/35 hover:bg-[#FAF9F7] hover:text-[#810000] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </a>
            )}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=yoondabin916@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-[#FAF9F7]/35 hover:bg-[#FAF9F7] hover:text-[#810000] transition-colors"
              aria-label="Email"
            >
              <Mail className="size-5" />
            </a>
            <a
              href="https://github.com/manybean916"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-[#FAF9F7]/35 hover:bg-[#FAF9F7] hover:text-[#810000] transition-colors"
              aria-label="GitHub"
            >
              <Github className="size-5" />
            </a>
          </div>

          <p className="text-xs text-[#FAF9F7]/60 tracking-wide">
            © {currentYear} Yoondabin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
