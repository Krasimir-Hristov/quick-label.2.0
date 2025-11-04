/**
 * Shared data processing utilities
 * Used by both labels and check-liste features
 */

/**
 * Normalize key: lowercase, trim, remove diacritics, strip non-alphanumeric chars
 */
export const normalizeKey = (val: unknown): string => {
  if (val == null) return '';
  return String(val)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]+/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '');
};

/**
 * Normalize value: lowercase, trim, remove diacritics, collapse inner spaces
 */
export const normalizeVal = (val: unknown): string => {
  if (val == null) return '';
  return String(val)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]+/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
};

/**
 * Безопасно извличане на стойност от продуктов обект
 * Игнорира главни/малки букви и водещи/крайни интервали в ключовете
 * @param product - Продуктовият обект от Excel
 * @param keyName - Името на ключа, който търсим
 * @returns Почистената стойност или null ако не е намерена
 */
export const getSafeValue = (
  product: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  keyName: string
): string | null => {
  const normalizedKeyName = normalizeKey(keyName);

  for (const key in product) {
    if (normalizeKey(key) === normalizedKeyName) {
      const value = product[key];
      return typeof value === 'string' ? value.trim() : String(value);
    }
  }

  return null;
};

/**
 * Определя региона на базата на preisschiene стойността
 * @param preisschiene - Стойността от колоната за ценова схема
 * @returns Region type или null ако не е разпознат
 */
export const determineRegion = (
  preisschiene: string
): 'GermanyD1' | 'GermanyD2' | 'Austria' | 'Benelux' | null => {
  const base = normalizeVal(preisschiene);
  const plain = base
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Check for specific markers
  if (plain.includes('osterreich') || plain.includes('austria')) {
    return 'Austria';
  }
  if (plain.includes('benelux')) {
    return 'Benelux';
  }
  // Check for D1/D2 markers
  if (plain.includes('de1') || plain.includes('d1')) {
    return 'GermanyD1';
  }
  if (plain.includes('de2') || plain.includes('d2')) {
    return 'GermanyD2';
  }
  // Default fallback
  return 'GermanyD1';
};
