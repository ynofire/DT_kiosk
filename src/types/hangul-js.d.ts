declare module 'hangul-js' {
  export function disassemble(str: string, grouped?: boolean): string[];
  export function assemble(arr: string[]): string;
  export function isConsonant(c: string): boolean;
  export function isVowel(c: string): boolean;
  export function isCho(c: string): boolean;
  export function isJong(c: string): boolean;
  export function isComplete(c: string): boolean;

  interface HangulStatic {
    disassemble: typeof disassemble;
    assemble: typeof assemble;
    isConsonant: typeof isConsonant;
    isVowel: typeof isVowel;
    isCho: typeof isCho;
    isJong: typeof isJong;
    isComplete: typeof isComplete;
  }

  const Hangul: HangulStatic;
  export default Hangul;
}

