import { registerTranslation } from '@shoelace-style/localize';
import type { DefaultTranslation } from '@shoelace-style/localize';

const translation: DefaultTranslation = {
  $code: 'sme',
  $name: 'Northern Sami',
  $dir: 'ltr',

  carousel: 'Karusella',
  clearEntry: 'Čorget rievtti',
  close: 'Cohkedit',
  copied: 'Máhcahit',
  copy: 'Máhccat',
  currentValue: 'Dálá várás',
  error: 'Feailluhit',
  goToSlide: (slide: number, count: number) => `Manne ${slide} ${count} geas`,
  hidePassword: 'Čohkedit sáni',
  loading: 'Logahan',
  nextSlide: 'Boahtte skovit',
  numOptionsSelected: (num: number) => {
    if (num === 0) return 'Ii oktage váráš valjain';
    if (num === 1) return '1 várás váljjus';
    return `${num} várásit váljjus`;
  },
  previousSlide: 'Ovddit skovit',
  progress: 'Ovddasvástádus',
  remove: 'Čorget',
  resize: 'Rievdade',
  scrollToEnd: 'Gullat rievtti',
  scrollToStart: 'Gullat álggu',
  selectAColorFromTheScreen: 'Váljje ivnni lávggu',
  showPassword: 'Čájehit sáni',
  slideNum: (slide: number) => `Skovit ${slide}`,
  toggleColorFormat: 'Jorgalit ivnni formáhta',
};

registerTranslation(translation);

export default translation;
