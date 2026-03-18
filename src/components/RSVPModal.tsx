import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { submitRSVP, loginWithGoogle, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCity?: string;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose, defaultCity = 'Dubai' }) => {
  const [step, setStep] = useState<'auth' | 'form' | 'success' | 'error'>('auth');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: defaultCity,
    plusOne: false
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          name: currentUser.displayName || '',
          email: currentUser.email || ''
        }));
        setStep('form');
      } else {
        setStep('auth');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, city: defaultCity }));
      if (user) setStep('form');
      else setStep('auth');
    }
  }, [isOpen, defaultCity, user]);

  const handleAuth = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
   
    setLoading(true);
    try {
      await submitRSVP(user.uid, formData.name, formData.email, formData.city, formData.plusOne);
      setStep('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit RSVP');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-transparent border-b border-gold/20 py-3 text-parchment font-body text-lg focus:outline-none focus:border-gold/60 transition-colors duration-500 placeholder:text-gold/20";
  const labelClasses = "text-[10px] uppercase tracking-[0.4em] text-gold/40 font-body block mb-1";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(26,21,16,0.85), rgba(10,8,6,0.95))',
            backdropFilter: 'blur(16px)',
          }}
        >
          <motion.div
            initial={{ y: 60, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl glass-card bg-noir-warm/90"
          >
            {/* Gold accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-gold/30 hover:text-gold transition-colors duration-300 cursor-pointer z-10"
              aria-label="Close RSVP modal"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="diamond-sm" />
                  <span className="text-[9px] uppercase tracking-[0.5em] text-gold/40 font-body">
                    {step === 'success' ? 'Confirmed' : 'Exclusive Access'}
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-gradient tracking-tight">
                  {step === 'success' ? 'We Await You' : 'Save The Date'}
                </h2>
                <p className="font-body text-sm text-parchment/40 mt-2">
                  {step === 'auth' && 'Authenticate to join DRA\'s celebration guestlist.'}
                  {step === 'form' && 'Complete your details for DRA @ 50.'}
                  {step === 'success' && 'You\'re on the guestlist for DRA @ 50!'}
                  {step === 'error' && 'An unexpected issue occurred.'}
                </p>
              </div>

              {step === 'auth' && (
                <div className="flex flex-col gap-5">
                  <button
                    onClick={handleAuth}
                    disabled={loading}
                    className="btn-gold flex items-center justify-center w-full py-4 px-6 rounded-full border border-gold/30 bg-gold/10 font-body text-sm uppercase tracking-[0.2em] text-gold-light cursor-pointer disabled:opacity-50 transition-all duration-500"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin text-gold" size={20} />
                    ) : (
                      <span className="flex items-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#C9A96E"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#A08040"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#8B6914"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#E8D5A3"/>
                        </svg>
                        Continue with Google
                      </span>
                    )}
                  </button>
                </div>
              )}

              {step === 'form' && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className={labelClasses}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className={inputClasses}
                    />
                  </div>
                 
                  <div>
                    <label className={labelClasses}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Destination</label>
                    <select
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className={`${inputClasses} appearance-none`}
                      style={{ background: 'transparent' }}
                    >
                      <option value="Dubai" className="bg-noir-warm text-parchment">Dubai — March 28th–29th</option>
                      <option value="Canada" className="bg-noir-warm text-parchment">Canada — April 6th</option>
                      <option value="Europe" className="bg-noir-warm text-parchment">Europe — May 1st–3rd</option>
                      <option value="Lagos-Nigeria" className="bg-noir-warm text-parchment">Lagos-Nigeria — May 6th–7th</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="plusOne"
                      checked={formData.plusOne}
                      onChange={e => setFormData({...formData, plusOne: e.target.checked})}
                      className="w-4 h-4 accent-gold bg-transparent border-gold/30 cursor-pointer"
                    />
                    <label htmlFor="plusOne" className="font-body text-sm text-parchment/50 cursor-pointer">
                      I require a +1 allocation
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold mt-4 flex items-center justify-center w-full py-4 px-6 rounded-full border border-gold/30 bg-gold/10 font-body text-sm uppercase tracking-[0.2em] text-gold-light cursor-pointer disabled:opacity-50 transition-all duration-500"
                  >
                    {loading ? <Loader2 className="animate-spin text-gold" size={20} /> : 'Secure Your Invitation'}
                  </button>
                </form>
              )}

              {step === 'success' && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                  >
                    <CheckCircle2 size={56} className="text-gold mb-6" style={{ filter: 'drop-shadow(0 0 15px rgba(201,169,110,0.4))' }} />
                  </motion.div>
                  <p className="font-body text-parchment/60 mb-2">
                    Your RSVP for <span className="text-gold-light font-semibold">{formData.city}</span> has been confirmed.
                  </p>
                  <p className="font-body text-sm text-gold/30 mb-8">
                    A personal concierge will contact you shortly with your exclusive details.
                  </p>
                  <button
                    onClick={onClose}
                    className="btn-gold w-full py-3 px-6 rounded-full border border-gold/20 text-gold/60 font-body text-sm uppercase tracking-[0.2em] cursor-pointer transition-all duration-500"
                  >
                    Close
                  </button>
                </div>
              )}

              {step === 'error' && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle size={56} className="text-burgundy-light mb-6" />
                  <p className="font-body text-parchment/60 mb-8">{errorMsg}</p>
                  <button
                    onClick={() => user ? setStep('form') : setStep('auth')}
                    className="btn-gold w-full py-3 px-6 rounded-full border border-gold/20 text-gold/60 font-body text-sm uppercase tracking-[0.2em] cursor-pointer transition-all duration-500"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* Bottom gold accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
