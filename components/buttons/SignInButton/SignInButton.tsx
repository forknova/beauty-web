'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

const SignInButton = () => (
  <Button onClick={() => signIn('google')}>Sign in</Button>
);

export default SignInButton;
