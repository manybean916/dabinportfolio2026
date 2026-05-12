import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const KEPCO_API_KEY = '39px8WfIjDxTua9JSsPZ14KF49O9SSRKwikn34C8';
const DANGER_THRESHOLD = 200;

interface KepcoData {
  metro: string;
  city: string;
  powerUsage: number;
  bill: number;
  houseCnt: number;
}

type StatusType = 'idle' | 'loading' | 'safe' | 'danger' | 'confirm';

function getVirtualUsage(): number {
  // Simulate realistic household kWh usage: random between 150~280
  return Math.floor(Math.random() * 130 + 150);
}

const WashingMachineDrum = ({ spinning }: { spinning: boolean }) => (
  <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
    {/* Outer ring */}
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #e8eaf0, #c8cdd8)',
        boxShadow: '8px 8px 20px #b0b5c0, -6px -6px 16px #ffffff',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Inner drum */}
      <motion.div
        animate={spinning ? { rotate: 360 } : { rotate: 0 }}
        transition={spinning ? { repeat: Infinity, duration: 1.5, ease: 'linear' } : { duration: 0.5 }}
        style={{
          width: 170,
          height: 170,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a2a4a, #2d4270)',
          boxShadow: 'inset 4px 4px 12px rgba(0,0,0,0.4), inset -4px -4px 12px rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Drum holes */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div
            key={deg}
            style={{
              position: 'absolute',
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              border: '2px solid rgba(255,255,255,0.08)',
              transform: `rotate(${deg}deg) translateY(-55px)`,
            }}
          />
        ))}
        {/* Center porthole glass */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(100,160,255,0.4), rgba(20,60,140,0.8))',
            border: '3px solid rgba(255,255,255,0.2)',
            boxShadow: 'inset 2px 2px 8px rgba(0,0,0,0.5)',
          }}
        />
      </motion.div>
    </div>
    {/* Control panel dots */}
    <div style={{ position: 'absolute', top: 14, display: 'flex', gap: 8 }}>
      {['#ff6b6b', '#ffd93d', '#6bcb77'].map((c, i) => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}` }} />
      ))}
    </div>
  </div>
);

const UsageBar = ({ usage }: { usage: number }) => {
  const pct = Math.min((usage / 350) * 100, 100);
  const color = usage > DANGER_THRESHOLD ? '#ef4444' : '#22c55e';
  return (
    <div style={{ width: '100%', maxWidth: 300 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>현재 가상 전력 사용량</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{usage} kWh</span>
      </div>
      <div style={{ height: 10, borderRadius: 99, background: '#e5e7eb', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 99, background: color }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>0</span>
        <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>200 (누진 기준)</span>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>350+</span>
      </div>
    </div>
  );
};

export const PpossongSection = ({ lang }: { lang: 'ko' | 'en' }) => {
  const [status, setStatus] = useState<StatusType>('idle');
  const [virtualUsage, setVirtualUsage] = useState<number | null>(null);
  const [kepcoData, setKepcoData] = useState<KepcoData | null>(null);
  const [kepcoLoading, setKepcoLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchKepcoData();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const fetchKepcoData = async () => {
    setKepcoLoading(true);
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() === 0 ? 12 : now.getMonth()).padStart(2, '0');
    const url = `https://bigdata.kepco.co.kr/openapi/v1/powerUsage/houseAve.do?year=${year}&month=${month}&metroCd=11&cityCd=680&apiKey=${KEPCO_API_KEY}&returnType=json`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json?.data?.[0]) {
        setKepcoData(json.data[0]);
      }
    } catch {
      // CORS or network — use null silently
    } finally {
      setKepcoLoading(false);
    }
  };

  const handleWashClick = () => {
    if (status === 'loading') return;
    setStatus('loading');
    setShowPopup(false);
    setShowConfirm(false);

    setTimeout(() => {
      const usage = getVirtualUsage();
      setVirtualUsage(usage);
      if (usage > DANGER_THRESHOLD) {
        setStatus('danger');
        setShowPopup(true);
      } else {
        setStatus('safe');
      }
    }, 1200);
  };

  const handleConfirmLater = () => {
    setShowPopup(false);
    const later = new Date(Date.now() + 60 * 60 * 1000);
    setScheduledTime(`${later.getHours().toString().padStart(2, '0')}:${later.getMinutes().toString().padStart(2, '0')}`);
    setStatus('confirm');
    setShowConfirm(true);
  };

  const handleWashNow = () => {
    setShowPopup(false);
    setStatus('safe');
  };

  const handleReset = () => {
    setStatus('idle');
    setVirtualUsage(null);
    setShowPopup(false);
    setShowConfirm(false);
    setScheduledTime(null);
  };

  const isSpinning = status === 'loading' || status === 'safe';

  return (
    <section
      id="ppossong"
      style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, #f0f4ff 0%, #fdfcfb 100%)',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center' }}
        >
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', color: '#6366f1', textTransform: 'uppercase', marginBottom: 10 }}>
            Smart Laundry Guide
          </p>
          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-pretendard)',
              marginBottom: 14,
            }}
          >
            뽀송퇴근 🧺
          </h2>
          <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.7, maxWidth: 420 }}>
            퇴근 후 세탁기를 돌리기 전,<br />
            지금이 전기료 아끼기 좋은 타이밍인지 확인하세요.
          </p>
        </motion.div>

        {/* Washing Machine Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <WashingMachineDrum spinning={isSpinning} />
        </motion.div>

        {/* KEPCO Real Data Badge */}
        {kepcoData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'white',
              borderRadius: 16,
              padding: '12px 20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              fontSize: 13,
              color: '#374151',
            }}
          >
            <span style={{ fontSize: 18 }}>⚡</span>
            <span>
              <strong>{kepcoData.metro} {kepcoData.city}</strong> 평균 사용량:{' '}
              <strong style={{ color: '#6366f1' }}>{kepcoData.powerUsage} kWh</strong>
              {' '}/ 평균 요금: <strong style={{ color: '#f59e0b' }}>{kepcoData.bill.toLocaleString()}원</strong>
            </span>
          </motion.div>
        )}

        {/* Usage Bar */}
        <AnimatePresence>
          {virtualUsage !== null && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%', maxWidth: 340 }}
            >
              <UsageBar usage={virtualUsage} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Safe Message */}
        <AnimatePresence>
          {status === 'safe' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                border: '2px solid #86efac',
                borderRadius: 24,
                padding: '22px 32px',
                textAlign: 'center',
                maxWidth: 340,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#15803d', marginBottom: 6 }}>
                지금이 기회입니다!
              </p>
              <p style={{ fontSize: 14, color: '#166534', lineHeight: 1.6 }}>
                가장 저렴하게 빨래하세요.<br />
                현재 전력 사용량이 안전 구간이에요 🎉
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Scheduled */}
        <AnimatePresence>
          {status === 'confirm' && scheduledTime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                border: '2px solid #c4b5fd',
                borderRadius: 24,
                padding: '22px 32px',
                textAlign: 'center',
                maxWidth: 340,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>⏰</div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#6d28d9', marginBottom: 6 }}>
                예약 완료!
              </p>
              <p style={{ fontSize: 14, color: '#5b21b6', lineHeight: 1.6 }}>
                <strong>{scheduledTime}</strong>에 세탁기를 돌릴게요.<br />
                알림을 놓치지 마세요 🔔
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          whileHover={status !== 'loading' ? { scale: 1.04, boxShadow: '0 8px 32px rgba(99,102,241,0.35)' } : {}}
          whileTap={status !== 'loading' ? { scale: 0.97 } : {}}
          onClick={status === 'idle' || status === 'safe' || status === 'danger' || status === 'confirm' ? (status === 'safe' || status === 'confirm' ? handleReset : handleWashClick) : undefined}
          disabled={status === 'loading'}
          style={{
            background: status === 'loading'
              ? '#a5b4fc'
              : status === 'safe' || status === 'confirm'
              ? '#6b7280'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: 99,
            padding: '18px 48px',
            fontSize: 17,
            fontWeight: 700,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
            transition: 'background 0.3s',
            letterSpacing: '-0.01em',
            fontFamily: 'var(--font-pretendard)',
          }}
        >
          {status === 'loading'
            ? '전력 확인 중...'
            : status === 'safe'
            ? '↩ 다시 확인하기'
            : status === 'confirm'
            ? '↩ 처음으로'
            : '🫧 지금 세탁기 돌리기'}
        </motion.button>

        {/* Danger Popup Modal */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: 24,
              }}
              onClick={(e) => { if (e.target === e.currentTarget) setShowPopup(false); }}
            >
              <motion.div
                initial={{ scale: 0.85, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 30 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{
                  background: 'white',
                  borderRadius: 32,
                  padding: '40px 36px',
                  maxWidth: 380,
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ fontSize: 52, marginBottom: 16 }}>⚠️</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 12, lineHeight: 1.4 }}>
                  지금은 누진세 구간이라<br />위험해요!
                </h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 8 }}>
                  현재 가상 전력 사용량:{' '}
                  <strong style={{ color: '#ef4444' }}>{virtualUsage} kWh</strong>
                </p>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 28 }}>
                  200kWh를 초과해 전기요금 누진 구간이에요.<br />
                  1시간 뒤에 돌릴까요?
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={handleWashNow}
                    style={{
                      flex: 1,
                      padding: '14px 0',
                      borderRadius: 99,
                      border: '2px solid #e5e7eb',
                      background: 'white',
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#374151',
                      cursor: 'pointer',
                    }}
                  >
                    그냥 돌릴게요
                  </button>
                  <button
                    onClick={handleConfirmLater}
                    style={{
                      flex: 1,
                      padding: '14px 0',
                      borderRadius: 99,
                      border: 'none',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'white',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
                    }}
                  >
                    1시간 뒤에 돌릴게요
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer note */}
        <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}>
          * 전력 사용량은 한국전력공사 공개 API 기반 시뮬레이션입니다.<br />
          실제 사용량과 다를 수 있습니다.
        </p>
      </div>
    </section>
  );
};
