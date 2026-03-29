import { Types } from 'mongoose';

export type MongoDoc<T extends { id: string }, TOverrides extends object = Record<never, never>> = Omit<T, 'id' | keyof TOverrides> & {
  _id: Types.ObjectId;
} & TOverrides;
