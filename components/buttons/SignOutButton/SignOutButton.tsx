'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

const SignOutButton = () => <Button onClick={() => signOut()}>Sign out</Button>;

export default SignOutButton;
