export interface UserCredentials {
  username: string;
  password: string;
  role: string;
}

/** Subset of UserCredentials safe to expose to tests — password is intentionally excluded. */
export type TestUser = Omit<UserCredentials, 'password'>;
