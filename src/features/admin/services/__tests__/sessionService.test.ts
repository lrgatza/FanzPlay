import { describe, expect, it, jest } from '@jest/globals';

import {
  closeQuestion,
  createSession,
  pushNextQuestion,
} from '../sessionService';

const mockAddDoc = jest.fn();
const mockCollection = jest.fn();
const mockServerTimestamp = jest.fn(() => 'server-ts');
const mockDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockIncrement = jest.fn((v: number) => ({ __increment: v }));

const mockResetSessionScores = jest.fn();

jest.mock('firebase/firestore', () => ({
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  collection: (...args: unknown[]) => mockCollection(...args),
  serverTimestamp: () => mockServerTimestamp(),
  doc: (...args: unknown[]) => mockDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  increment: (value: number) => mockIncrement(value),
  onSnapshot: jest.fn(),
  orderBy: jest.fn(),
  query: jest.fn(),
}));

jest.mock('@/api/firebase', () => ({
  db: 'db-instance',
}));

jest.mock('@/features/teams/services/teamService', () => ({
  resetSessionScores: (...args: unknown[]) => mockResetSessionScores(...args),
}));

describe('sessionService', () => {
  it('creates a session and resets team scores', async () => {
    mockCollection.mockReturnValue('sessions-collection');
    mockAddDoc.mockResolvedValue({ id: 'session-1' });
    mockResetSessionScores.mockResolvedValue(undefined);

    const result = await createSession({
      teamIds: ['team-1', 'team-2'],
      questionOrder: ['q-1'],
      sponsorId: 'sponsor-1',
      settings: { showTeamScores: true, allowLateJoin: false },
    });

    expect(mockCollection).toHaveBeenCalledWith('db-instance', 'game_sessions');
    expect(mockAddDoc).toHaveBeenCalledWith('sessions-collection', {
      status: 'lobby',
      currentQuestionId: null,
      questionActive: false,
      questionStartTime: null,
      sponsorId: 'sponsor-1',
      settings: { showTeamScores: true, allowLateJoin: false },
      currentQuestion: null,
      correctOptionId: null,
      teamIds: ['team-1', 'team-2'],
      questionOrder: ['q-1'],
      currentQuestionIndex: -1,
      createdAt: 'server-ts',
    });
    expect(mockResetSessionScores).toHaveBeenCalledWith(['team-1', 'team-2']);
    expect(result).toBe('session-1');
  });

  it('pushes next question and updates active question state', async () => {
    mockDoc.mockImplementation((_db, coll, id) => `${coll}/${id}`);
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        text: 'Question text',
        options: [{ id: 'a', text: 'A' }],
        points: 10,
        timerSeconds: 20,
      }),
    });
    mockUpdateDoc.mockResolvedValue(undefined);

    await pushNextQuestion('session-2', ['q-10'], -1);

    expect(mockGetDoc).toHaveBeenCalledWith('questions/q-10');
    expect(mockUpdateDoc).toHaveBeenCalledWith('game_sessions/session-2', {
      status: 'active',
      questionActive: true,
      questionStartTime: 'server-ts',
      currentQuestionId: 'q-10',
      currentQuestionIndex: { __increment: 1 },
      currentQuestion: {
        text: 'Question text',
        options: [{ id: 'a', text: 'A' }],
        points: 10,
        timerSeconds: 20,
      },
      correctOptionId: null,
    });
  });

  it('closes question and persists correct option id', async () => {
    mockDoc.mockImplementation((_db, coll, id) => `${coll}/${id}`);
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        correctOptionId: 'opt-correct',
      }),
    });
    mockUpdateDoc.mockResolvedValue(undefined);

    await closeQuestion('session-3', 'q-9');

    expect(mockGetDoc).toHaveBeenCalledWith('questions/q-9');
    expect(mockUpdateDoc).toHaveBeenCalledWith('game_sessions/session-3', {
      questionActive: false,
      correctOptionId: 'opt-correct',
    });
  });
});
