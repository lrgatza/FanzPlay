import { describe, expect, it, jest } from '@jest/globals';

import { computeAndRecordScore, submitAnswer } from '../submissionService';

const mockDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockServerTimestamp = jest.fn(() => 'server-ts');
const mockIncrement = jest.fn((v: number) => ({ __increment: v }));
const mockRunTransaction = jest.fn();

jest.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  serverTimestamp: () => mockServerTimestamp(),
  increment: (value: number) => mockIncrement(value),
  runTransaction: (...args: unknown[]) => mockRunTransaction(...args),
}));

jest.mock('@/api/firebase', () => ({
  db: 'db-instance',
}));

describe('submissionService', () => {
  it('stores answer submission payload', async () => {
    mockDoc.mockReturnValue('submission-doc-ref');
    mockSetDoc.mockResolvedValue(undefined);

    await submitAnswer('session-1', 'q-1', 'uid-1', 'team-1', 'opt-a');

    expect(mockDoc).toHaveBeenCalledWith(
      'db-instance',
      'submissions',
      'session-1_q-1_uid-1',
    );
    expect(mockSetDoc).toHaveBeenCalledWith('submission-doc-ref', {
      uid: 'uid-1',
      sessionId: 'session-1',
      questionId: 'q-1',
      teamId: 'team-1',
      selectedOptionId: 'opt-a',
      isCorrect: null,
      answeredAt: 'server-ts',
    });
  });

  it('does not apply scoring twice when submission already scored', async () => {
    const transaction = {
      get: jest.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({ isCorrect: true }),
      }),
      update: jest.fn(),
    };
    mockRunTransaction.mockImplementation(
      async (_db: unknown, cb: (txn: typeof transaction) => Promise<void>) =>
        cb(transaction),
    );

    await computeAndRecordScore(
      'sub-1',
      'opt-a',
      'opt-a',
      100,
      'uid-1',
      'team-1',
    );

    expect(transaction.update).not.toHaveBeenCalled();
  });

  it('updates submission and increments user/team points on correct answer', async () => {
    const transaction = {
      get: jest.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({ isCorrect: null }),
      }),
      update: jest.fn(),
    };
    mockRunTransaction.mockImplementation(
      async (_db: unknown, cb: (txn: typeof transaction) => Promise<void>) =>
        cb(transaction),
    );
    mockDoc.mockImplementation((_db, collection, id) => `${collection}/${id}`);

    await computeAndRecordScore(
      'sub-2',
      'opt-a',
      'opt-a',
      50,
      'uid-2',
      'team-2',
    );

    expect(transaction.update).toHaveBeenNthCalledWith(1, 'submissions/sub-2', {
      isCorrect: true,
      pointsEarned: 50,
    });
    expect(transaction.update).toHaveBeenNthCalledWith(2, 'users/uid-2', {
      totalPoints: { __increment: 50 },
    });
    expect(transaction.update).toHaveBeenNthCalledWith(3, 'teams/team-2', {
      currentSessionScore: { __increment: 50 },
    });
  });
});
