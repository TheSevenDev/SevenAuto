import { enLang as en, viLang as vi } from '../src/langs';

interface LangTree {
  [key: string]: string | LangTree;
}

const deepCheck = (result: LangTree, target: LangTree, parentKey: string) => {
  for (const key in result) {
    const value = result[key];
    if (typeof value === 'object' && value !== null) {
      deepCheck(
        value,
        (target[key] as LangTree) ?? {},
        `${parentKey ? parentKey + '.' : ''}${key}`,
      );
    } else if (!target[key] && target[key] !== '') {
      const message = `Missing key: ${parentKey ? parentKey + '.' : ''}${key} in ${
        parentKey === 'en' ? 'vi' : 'en'
      }`;
      console.log('file: language.ts:15 ~ deepCheck ~ message:', message);
      expect(message).toBe('');
    }
  }
};

describe('check_missing', () => {
  beforeEach(async () => {});

  it('should check missing key', async () => {
    deepCheck(en, vi, 'vi');
  });

  it('should check missing key', async () => {
    deepCheck(vi, en, 'en');
  });
});
