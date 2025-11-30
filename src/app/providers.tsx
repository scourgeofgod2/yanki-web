'use client';

import { SessionProvider } from 'next-auth/react';
import { AudioProvider } from '@/contexts/AudioProvider';
import ModernAudioPlayer from '@/components/ModernAudioPlayer';

export function Providers({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AudioProvider>
        {children}
        <ModernAudioPlayer />
      </AudioProvider>
    </SessionProvider>
  );
}