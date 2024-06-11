import slugify from 'slugify';

export function createSlug(string: string): string {
  return slugify(string, { locale: 'pt' });
}
