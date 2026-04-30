import { describe, expect, it, jest } from '@jest/globals';

import { createRewardClaim, hasExistingClaim } from '../rewardService';

const mockDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockServerTimestamp = jest.fn(() => 'server-ts');
const mockGetDoc = jest.fn();

jest.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  serverTimestamp: () => mockServerTimestamp(),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
}));

jest.mock('@/api/firebase', () => ({
  db: 'db-instance',
}));

describe('rewardService', () => {
  it('creates a reward claim with normalized input', async () => {
    mockDoc.mockReturnValue('reward-claim-ref');
    mockSetDoc.mockResolvedValue(undefined);

    await createRewardClaim(
      'uid-1',
      'session-1',
      'sponsor-1',
      '  fan@example.com ',
      '  555-0101 ',
    );

    expect(mockDoc).toHaveBeenCalledWith(
      'db-instance',
      'rewards_claims',
      'uid-1_session-1',
    );
    expect(mockSetDoc).toHaveBeenCalledWith('reward-claim-ref', {
      id: 'uid-1_session-1',
      uid: 'uid-1',
      sessionId: 'session-1',
      sponsorId: 'sponsor-1',
      email: 'fan@example.com',
      phone: '555-0101',
      status: 'pending',
      createdAt: 'server-ts',
    });
  });

  it('returns false when a claim does not exist', async () => {
    mockDoc.mockReturnValue('reward-claim-ref');
    mockGetDoc.mockResolvedValue({
      exists: () => false,
    });

    const result = await hasExistingClaim('uid-2', 'session-2');

    expect(mockGetDoc).toHaveBeenCalledWith('reward-claim-ref');
    expect(result).toBe(false);
  });

  it('returns true when claim already exists', async () => {
    mockDoc.mockReturnValue('reward-claim-ref');
    mockGetDoc.mockResolvedValue({
      exists: () => true,
    });

    const result = await hasExistingClaim('uid-3', 'session-3');

    expect(result).toBe(true);
  });
});
