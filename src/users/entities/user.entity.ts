// NOT SAFE - only use interally
export class UnsafeUserEntity {
  id: number;
  publicId: string;
  email: string;
  username: string | null;
  password: string;
  name: string;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// Omit private properties like: Password, RefreshToken, anything that should not be returned
export class UserEntity {
  publicId: string;
  email: string;
  username: string | null;
  name: string;
  //createdAt: Date;
  //updatedAt: Date;
  //deletedAt: Date | null;
}
