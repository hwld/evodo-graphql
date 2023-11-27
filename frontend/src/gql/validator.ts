import { z } from 'zod';
import {
  CreateTaskInput,
  InitializeSignupIfNewInput,
  SignupInput,
} from './generated/graphql';

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export function CreateTaskInputSchema(): z.ZodObject<
  Properties<CreateTaskInput>
> {
  return z.object({
    title: z.string().min(1),
  });
}

export function InitializeSignupIfNewInputSchema(): z.ZodObject<
  Properties<InitializeSignupIfNewInput>
> {
  return z.object({
    avatarUrl: z.string(),
    firebaseToken: z.string(),
    name: z.string(),
  });
}

export function SignupInputSchema(): z.ZodObject<Properties<SignupInput>> {
  return z.object({
    avatarUrl: z.string().max(100),
    firebaseToken: z.string(),
    name: z.string().min(1).max(100),
    profile: z.string(),
  });
}
