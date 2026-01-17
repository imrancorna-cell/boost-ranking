'use server';

import { cookies } from 'next/headers';
import type { UserSession } from './definitions';

const SESSION_COOKIE_NAME = 'domain-portfolio-session';

export async function getSession(): Promise<UserSession | null> {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value);
  } catch (error) {
    console.error('Failed to parse session cookie:', error);
    return null;
  }
}

export async function createSession(user: UserSession) {
  cookies().set(SESSION_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  });
}

export async function removeSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}
