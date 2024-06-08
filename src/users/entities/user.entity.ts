// NOT SAFE - only use interally
export class UnsafeUserEntity {
  id: string;
  email: string;
  username: string | null;
  password: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// Omit private properties like: Password, RefreshToken, anything that should not be returned
export class UserEntity {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
