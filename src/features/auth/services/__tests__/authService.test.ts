import { describe, expect, it, jest } from '@jest/globals';

import { signIn, signOut, signUp, updateUserTeam } from '../authService';

const mockCreateUserWithEmailAndPassword = jest.fn();
const mockSignInWithEmailAndPassword = jest.fn();
const mockFirebaseSignOut = jest.fn();
const mockDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockServerTimestamp = jest.fn(() => 'server-ts');

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) =>
    mockCreateUserWithEmailAndPassword(...args),
  signInWithEmailAndPassword: (...args: unknown[]) =>
    mockSignInWithEmailAndPassword(...args),
  signOut: (...args: unknown[]) => mockFirebaseSignOut(...args),
}));

jest.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  serverTimestamp: () => mockServerTimestamp(),
}));

jest.mock('@/api/firebase', () => ({
  auth: 'auth-instance',
  db: 'db-instance',
}));

describe('authService', () => {
  it('creates auth user and profile on sign up', async () => {
    mockCreateUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'fan-1' },
    });
    mockDoc.mockReturnValue('user-doc-ref');
    mockSetDoc.mockResolvedValue(undefined);

    const result = await signUp(
      'fan@example.com',
      'secret123',
      'Fan Name',
      true,
      'team-1',
    );

    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
      'auth-instance',
      'fan@example.com',
      'secret123',
    );
    expect(mockDoc).toHaveBeenCalledWith('db-instance', 'users', 'fan-1');
    expect(mockSetDoc).toHaveBeenCalledWith('user-doc-ref', {
      uid: 'fan-1',
      email: 'fan@example.com',
      displayName: 'Fan Name',
      role: 'fan',
      teamId: 'team-1',
      marketingOptIn: true,
      totalPoints: 0,
      createdAt: 'server-ts',
    });
    expect(result).toEqual({ uid: 'fan-1' });
  });

  it('signs in with email and password', async () => {
    mockSignInWithEmailAndPassword.mockResolvedValue(undefined);

    await signIn('fan@example.com', 'pw');

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      'auth-instance',
      'fan@example.com',
      'pw',
    );
  });

  it('signs out current user', async () => {
    mockFirebaseSignOut.mockResolvedValue(undefined);

    await signOut();

    expect(mockFirebaseSignOut).toHaveBeenCalledWith('auth-instance');
  });

  it('updates a user team assignment', async () => {
    mockDoc.mockReturnValue('user-team-doc-ref');
    mockUpdateDoc.mockResolvedValue(undefined);

    await updateUserTeam('fan-1', 'team-2');

    expect(mockDoc).toHaveBeenCalledWith('db-instance', 'users', 'fan-1');
    expect(mockUpdateDoc).toHaveBeenCalledWith('user-team-doc-ref', {
      teamId: 'team-2',
    });
  });
});
