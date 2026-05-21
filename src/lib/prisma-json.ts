export type PrismaJsonInput =
  | string
  | number
  | boolean
  | PrismaJsonInput[]
  | { [key: string]: PrismaJsonInput | null };

export function toPrismaJsonInput(value: unknown): PrismaJsonInput {
  return JSON.parse(JSON.stringify(value)) as PrismaJsonInput;
}
