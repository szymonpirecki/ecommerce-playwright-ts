import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { UserCredentials } from '../types/auth.types';
import { Logger } from '../utils/Logger';

const USERS_PATH = resolve(__dirname, 'users.json');
const logger = new Logger('AuthData');

type UserRecord = { username: string; password: string; role: string };

export function getUserByRole(role: string): UserCredentials {
  let users: UserRecord[];

  try {
    users = JSON.parse(readFileSync(USERS_PATH, 'utf-8')) as UserRecord[];
    logger.info('Loaded users.json');
  } catch {
    throw new Error(
      'Could not load src/test-data/users.json. ' +
        'Copy src/test-data/users.example.json to src/test-data/users.json and fill in real values.'
    );
  }

  const pool = users.filter(u => u.role === role);
  if (pool.length === 0) {
    const available = users.map(u => u.role).join(', ');
    throw new Error(
      `No user with role "${role}" found in users.json. Available roles: ${available}`
    );
  }

  const workerIndex = parseInt(process.env['TEST_PARALLEL_INDEX'] ?? '0', 10);
  const cred = pool[workerIndex % pool.length];
  logger.info(`Worker ${workerIndex} → pool[${workerIndex % pool.length}] for role: ${role}, username: ${cred.username}`);
  return cred as UserCredentials;
}
