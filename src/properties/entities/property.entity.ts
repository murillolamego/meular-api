// NOT SAFE - only use internally
export class UnsafePropertyEntity {
  id: number;
  publicId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// Omit private properties like: id, anything that should not be returned
export class PropertyEntity {
  publicId: string;
  userId: string;
  //createdAt: Date;
  //updatedAt: Date;
  //deletedAt: Date | null;
}
