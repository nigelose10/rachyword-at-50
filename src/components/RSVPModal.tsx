import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { submitRSVP, type RSVPData } from '../firebase';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCity?: string;
}

const TITLES = ['MR', 'MRS', 'MS', 'DR', 'PASTOR', 'DEACON', 'DEACONESS'];

const GUEST_CATEGORIES = [
  'FAMILY',
  'COF',
  'CHRIST EMBASSY',
  'THE HAVEN',
  'SUNTRUST, JV & AFFILIATES',
  'PARALLEX BANK',
  'GOLD COAST',
  'HARVARD, STANFORD, ICAN, MAP',
  'OHS',
  'FELLOW DIRECTORS',
  'SPECIAL FRIENDS',
  'BANKERS',
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const totalSteps = 9;

export const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<'form' | 'success' | 'error'>('form');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  const [form, setForm] = useState({
    title: '',
    titleOther: '',
    surname: '',
    firstname: '',
    telephone: '',
    email: '',
    attendingThanksgiving: '',
    attendingBirthday: '',
    guestCategory: '',
    guestCategoryOther: '',
    comments: '',
  });

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setPhase('form');
      setErrorMsg('');
    }
  }, [isOpen]);

  const progress = ((step + 1) / totalSteps) * 100;

  const goNext = useCallback(() => {
    if (step < totalSteps - 1) { setDir(1); setStep(s => s + 1); }
  }, [step]);

  const goBack = useCallback(() => {
    if (step > 0) { setDir(-1); setStep(s => s - 1); }
  }, [step]);

  const canAdvance = (): boolean => {
    switch (step) {
      case 0: return form.title !== '' || form.titleOther.trim() !== '';
      case 1: return form.surname.trim() !== '';
      case 2: return form.firstname.trim() !== '';
      case 3: return form.telephone.trim() !== '';
      case 4: return form.email.trim() !== '';
      case 5: return form.attendingThanksgiving !== '';
      case 6: return form.attendingBirthday !== '';
      case 7: return form.guestCategory !== '' || form.guestCategoryOther.trim() !== '';
      case 8: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data: RSVPData = {
        title: form.title === 'Other' ? form.titleOther : form.title,
        surname: form.surname,
        firstname: form.firstname,
        telephone: form.telephone,
        email: form.email,
        attendingThanksgiving: form.attendingThanksgiving === 'YES',
        attendingBirthday: form.attendingBirthday === 'YES',
        guestCategory: form.guestCategory === 'Other' ? form.guestCategoryOther : form.guestCategory,
        comments: form.comments,
      };
      await submitRSVP(data);
      setPhase('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit');
      setPhase('error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canAdvance()) {
      e.preventDefault();
      if (step === totalSteps - 1) handleSubmit();
      else goNext();
    }
  };

  const inputClass = "w-full bg-transparent border-b-2 border-gold/20 py-4 text-parchment font-body text-xl md:text-2xl focus:outline-none focus:border-gold/60 transition-colors duration-500 placeholder:text-gold/15";

  const chipClass = (active: boolean) =>
    `px-5 py-2.5 rounded-full border cursor-pointer font-body text-sm tracking-wide transition-all duration-300 ${
      active
        ? 'border-gold/60 bg-gold/15 text-gold-light'
        : 'border-gold/15 text-gold/40 hover:border-gold/30 hover:text-gold/60'
    }`;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.5em] text-gold/30 mb-3">01 / {totalSteps}</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gold-gradient mb-2">Your Title</h3>
            <p className="font-body text-sm text-parchment/30 mb-8">How should we address you?</p>
            <div className="flex flex-wrap gap-3 mb-6">
              {TITLES.map(t => (
                <button key={t} type="button" onClick={() => setForm({ ...form, title: t, titleOther: '' })} className={chipClass(form.title === t)}>{t}</button>
              ))}
              <button type="button" onClick={() => setForm({ ...form, title: 'Other' })} className={chipClass(form.title === 'Other')}>Other</button>
            </div>
            {form.title === 'Other' && (
              <input type="text" value={form.titleOther} onChange={e => setForm({ ...form, titleOther: e.target.value })} placeholder="Enter your title" className={inputClass} autoFocus />
            )}
          </div>
        );
      case 1:
        return (
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.5em] text-gold/30 mb-3">02 / {totalSteps}</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gold-gradient mb-2">Surname</h3>
            <p className="font-body text-sm text-parchment/30 mb-8">Your family name</p>
            <input type="text" value={form.surname} onChange={e => setForm({ ...form, surname: e.target.value })} placeholder="Akhuetie" className={inputClass} autoFocus />
          </div>
        );
      case 2:
        return (
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.5em] text-gold/30 mb-3">03 / {totalSteps}</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gold-gradient mb-2">First Name</h3>
            <p className="font-body text-sm text-parchment/30 mb-8">Your given name</p>
            <input type="text" value={form.firstname} onChange={e => setForm({ ...form, firstname: e.target.value })} placeholder="Rachel" className={inputClass} autoFocus />
          </div>
        );
      case 3:
        return (
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.5em] text-gold/30 mb-3">04 / {totalSteps}</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gold-gradient mb-2">Telephone</h3>
            <p className="font-body text-sm text-parchment/30 mb-8">Your contact number</p>
            <input type="tel" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+234 800 000 0000" className={inputClass} autoFocus />
          </div>
        );
      case 4:
        return (
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.5em] text-gold/30 mb-3">05 / {totalSteps}</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gold-gradient mb-2">Email Address</h3>
            <p className="font-body text-sm text-parchment/30 mb-8">Where we'll send your invitation</p>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" className={inputClass} autoFocus />
          </div>
        );
      case 5:
        return (
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.5em] text-gold/30 mb-3">06 / {totalSteps}</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gold-gradient mb-2">Thanksgiving Service</h3>
            <p className="font-body text-sm text-parchment/30 mb-8">Will you attend D.R.A.'s Thanksgiving Service in Lagos on <span className="text-gold-light/60">May 6, 2026</span>?</p>
            <div className="flex gap-4">
              {['YES', 'NO'].map(v => (
                <button key={v} type="button" onClick={() => setForm({ ...form, attendingThanksgiving: v })}
                  className={`flex-1 py-4 rounded-xl border font-display text-lg tracking-wider cursor-pointer transition-all duration-300 ${
                    form.attendingThanksgiving === v ? 'border-gold/60 bg-gold/15 text-gold-light' : 'border-gold/15 text-gold/30 hover:border-gold/30'
                  }`}
                >{v}</button>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.5em] text-gold/30 mb-3">07 / {totalSteps}</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gold-gradient mb-2">Birthday Celebration</h3>
            <p className="font-body text-sm text-parchment/30 mb-8">Will you attend D.R.A.'s Birthday Celebration in Lagos on <span className="text-gold-light/60">May 7, 2026</span>?</p>
            <div className="flex gap-4">
              {['YES', 'NO'].map(v => (
                <button key={v} type="button" onClick={() => setForm({ ...form, attendingBirthday: v })}
                  className={`flex-1 py-4 rounded-xl border font-display text-lg tracking-wider cursor-pointer transition-all duration-300 ${
                    form.attendingBirthday === v ? 'border-gold/60 bg-gold/15 text-gold-light' : 'border-gold/15 text-gold/30 hover:border-gold/30'
                  }`}
                >{v}</button>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.5em] text-gold/30 mb-3">08 / {totalSteps}</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gold-gradient mb-2">Guest Category</h3>
            <p className="font-body text-sm text-parchment/30 mb-8">Lagos event guests only</p>
            <div className="flex flex-wrap gap-2.5 mb-6 max-h-[240px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(201,169,110,0.2) transparent' }}>
              {GUEST_CATEGORIES.map(cat => (
                <button key={cat} type="button" onClick={() => setForm({ ...form, guestCategory: cat, guestCategoryOther: '' })} className={chipClass(form.guestCategory === cat)}>{cat}</button>
              ))}
              <button type="button" onClick={() => setForm({ ...form, guestCategory: 'Other' })} className={chipClass(form.guestCategory === 'Other')}>Other</button>
            </div>
            {form.guestCategory === 'Other' && (
              <input type="text" value={form.guestCategoryOther} onChange={e => setForm({ ...form, guestCategoryOther: e.target.value })} placeholder="Please specify" className={inputClass} autoFocus />
            )}
          </div>
        );
      case 8:
        return (
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.5em] text-gold/30 mb-3">09 / {totalSteps}</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gold-gradient mb-2">Anything Else?</h3>
            <p className="font-body text-sm text-parchment/30 mb-8">Any comments, dietary requirements, or special requests</p>
            <textarea value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} placeholder="Optional" rows={3}
              className={`${inputClass} resize-none border-2 rounded-xl p-4`}
            />
          </div>
        );
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(26,21,16,0.92), rgba(10,8,6,0.98))',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Close */}
          <button onClick={onClose} className="absolute top-6 right-6 text-gold/25 hover:text-gold/60 transition-colors cursor-pointer z-20" aria-label="Close">
            <X size={24} />
          </button>

          {/* ── FORM ── */}
          {phase === 'form' && (
            <div className="w-full max-w-lg mx-auto px-6 md:px-10 relative" onKeyDown={handleKeyDown}>
              {/* Header — always visible */}
              <div className="text-center mb-6">
                <div className="diamond mx-auto mb-4" />
                <h2 className="font-display text-lg md:text-xl font-bold text-gold-gradient tracking-wide">D.R.A Countdown to 50</h2>
                <p className="font-body text-[10px] text-parchment/25 tracking-wider mt-1">Deaconess (Dr) Rachel Akhuetie's 50th Birthday Guestlist</p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-[2px] bg-gold/8 rounded-full overflow-hidden mb-10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #8B6914, #C9A96E, #F0E0B0)' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {/* Slide content */}
              <div className="min-h-[280px] flex flex-col justify-center">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={step}
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <button onClick={goBack} disabled={step === 0}
                  className="flex items-center gap-2 text-gold/30 hover:text-gold/60 transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed font-body text-sm"
                >
                  <ChevronLeft size={16} /> Back
                </button>

                <p className="text-[10px] text-gold/15 font-body tracking-wider">Press Enter ↵</p>

                {step < totalSteps - 1 ? (
                  <button onClick={goNext} disabled={!canAdvance()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gold/25 text-gold-light/70 hover:text-gold-light hover:border-gold/50 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed font-body text-sm"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={loading}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-full border border-gold/40 bg-gold/15 text-gold-light hover:bg-gold/25 transition-all cursor-pointer disabled:opacity-50 font-body text-sm uppercase tracking-wider"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : 'Submit'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {phase === 'success' && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center text-center px-8 max-w-md"
            >
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.5 }}>
                <CheckCircle2 size={64} className="text-gold mb-8" style={{ filter: 'drop-shadow(0 0 20px rgba(201,169,110,0.4))' }} />
              </motion.div>
              <h2 className="font-display text-3xl font-bold text-gold-gradient mb-3">We Await You</h2>
              <p className="font-body text-parchment/50 mb-2">
                {form.title !== 'Other' ? form.title : form.titleOther} {form.firstname} {form.surname}
              </p>
              <p className="font-body text-sm text-gold/30 mb-10 leading-relaxed">
                Your RSVP for D.R.A @ 50 has been received. A personal concierge will contact you with exclusive details.
              </p>
              <button onClick={onClose}
                className="btn-gold px-10 py-3 rounded-full border border-gold/20 text-gold/60 font-body text-sm uppercase tracking-[0.2em] cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          )}

          {/* ── ERROR ── */}
          {phase === 'error' && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center text-center px-8 max-w-md"
            >
              <AlertCircle size={56} className="text-burgundy-light mb-6" />
              <p className="font-body text-parchment/60 mb-8">{errorMsg}</p>
              <button onClick={() => setPhase('form')}
                className="btn-gold px-10 py-3 rounded-full border border-gold/20 text-gold/60 font-body text-sm uppercase tracking-[0.2em] cursor-pointer"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
