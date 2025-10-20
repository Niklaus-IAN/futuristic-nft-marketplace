import React, { useState } from 'react';
import { Mail, Chrome } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { Input } from './ui/input';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';

interface SignUpScreenProps {
  onSignedUp: (name: string) => void;
  onGoToSignIn: () => void;
}

export function SignUpScreen({ onSignedUp, onGoToSignIn }: SignUpScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async () => {
    if (!email || !password) return;
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      const name = email.split('@')[0];
      onSignedUp(name);
    } catch (e: any) {
      console.error('Email sign-up failed', e?.code, e?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      const user = auth.currentUser;
      onSignedUp(user?.displayName || user?.email?.split('@')[0] || 'User');
    } catch (e) {
      console.error('Google sign-up failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-thin tracking-wider mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-magenta-400 text-transparent bg-clip-text">
            kryptoArt
          </h1>
          <p className="text-white/60 text-sm">Create your account</p>
        </div>

        <GlassCard className="p-8">
          <h2 className="text-2xl mb-6 text-center">Sign Up</h2>

          <div className="mb-6">
            <label className="block text-sm text-white/80 mb-2">Email Address</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-400/50 focus:ring-cyan-400/20"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-white/80 mb-2">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-400/50 focus:ring-cyan-400/20"
            />
          </div>

          <NeonButton onClick={handleEmailSignUp} className="w-full mb-4" disabled={!email || !password || loading}>
            <span className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              {loading ? 'Creating...' : 'Create Account'}
            </span>
          </NeonButton>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-white/40 text-sm">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <NeonButton variant="secondary" onClick={handleGoogleSignUp} className="w-full" disabled={loading}>
            <span className="flex items-center justify-center gap-2">
              <Chrome className="w-5 h-5" />
              Continue with Google
            </span>
          </NeonButton>

          <p className="text-center text-white/40 text-xs mt-6">
            Already have an account?{' '}
            <button onClick={onGoToSignIn} className="text-cyan-400 hover:text-cyan-300">Sign In</button>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}


