import { describe, it, expect } from 'vitest';
import { truncateString, capitalize } from './string';

describe('String Utilities', () => {
  describe('truncateString', () => {
    it('should truncate string longer than maxLength', () => {
      expect(truncateString('hello world', 5)).toBe('hello...');
    });

    it('should not truncate string shorter than maxLength', () => {
      expect(truncateString('hello', 10)).toBe('hello');
    });
  });

  describe('capitalize', () => {
    it('should capitalize the first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should return empty string for empty input', () => {
      expect(capitalize('')).toBe('');
    });
  });
});
