import { customAlphabet } from 'nanoid';

export const customIdAlphabet = '0123456789abcdefghijklmnopqrstuvwxyz';

export const customId = customAlphabet(customIdAlphabet, 12);
