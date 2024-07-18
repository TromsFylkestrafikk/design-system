import { registerTranslation } from '@shoelace-style/localize';
import type { DefaultTranslation } from '@shoelace-style/localize';

const translation: DefaultTranslation = {
  $code: 'nbo',
  $name: 'Norwegian (Bokmål)',
  $dir: 'ltr',

  carousel: 'Karusell',
  clearEntry: 'Fjern oppføring',
  close: 'Lukk',
  copied: 'Kopiert',
  copy: 'Kopier',
  currentValue: 'Gjeldende verdi',
  error: 'Feil',
  goToSlide: (slide: number, count: number) => `Gå til lysbilde ${slide} av ${count}`,
  hidePassword: 'Skjul passord',
  loading: 'Laster',
  nextSlide: 'Neste lysbilde',
  numOptionsSelected: (num: number) => {
    if (num === 0) return 'Ingen alternativer valgt';
    if (num === 1) return '1 alternativ valgt';
    return `${num} alternativer valgt`;
  },
  previousSlide: 'Forrige lysbilde',
  progress: 'Fremgang',
  remove: 'Fjern',
  resize: 'Endre størrelse',
  scrollToEnd: 'Rull til slutten',
  scrollToStart: 'Rull til starten',
  selectAColorFromTheScreen: 'Velg en farge fra skjermen',
  showPassword: 'Vis passord',
  slideNum: (slide: number) => `Lysbilde ${slide}`,
  toggleColorFormat: 'Bytt fargeformat',
};

registerTranslation(translation);

export default translation;
