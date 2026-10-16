export type UUID = string;

export const newId = (): UUID => crypto.randomUUID();
