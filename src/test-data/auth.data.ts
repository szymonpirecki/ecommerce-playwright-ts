import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { UserCredentials } from '../types/auth.types';
import { Logger } from '../utils/Logger';

const USERS_PATH = resolve(__dirname, 'users.json');
const logger = new Logger('AuthData');

export function getUserByRole(role: string): UserCredentials {
  let users: UserCredentials[];

  try {
    users = JSON.parse(readFileSync(USERS_PATH, 'utf-8')) as UserCredentials[];
    logger.info('Loaded users.json');
  } catch {
    throw new Error(
      'Could not load src/test-data/users.json. ' +
        'Copy src/test-data/users.example.json to src/test-data/users.json and fill in real values.'
    );
  }

  const user = users.find(u => u.role === role);
  if (!user) {
    const available = users.map(u => u.role).join(', ');
    throw new Error(
      `No user with role "${role}" found in users.json. Available roles: ${available}`
    );
  }

  logger.info(`Resolved user for role: ${role}, username: ${user.username}`);
  return user;
}
