type PatternType = "uuid" | "int" | "date" | "slug" | "token"
const UUID_PATTERN: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_DATE_PATTERN: RegExp = /^\d{4}-\d{2}-\d{2}$/;
const NUMERIC_PATTERN: RegExp = /^\d+$/;
// Need better regex for slug pattern because every string match this pattern
// const SLUG_PATTERN: RegExp = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/; 
const TOKEN_PATTERN: RegExp = /^[A-Za-z0-9_-]{20,}$/;

const PATTERNS_MAP = new Map<PatternType, RegExp>([
  ["uuid",  UUID_PATTERN],
  ["date",  ISO_DATE_PATTERN],
  ["int",   NUMERIC_PATTERN],
  ["token", TOKEN_PATTERN],
]);

export default PATTERNS_MAP;