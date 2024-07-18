import { registerTranslation } from '@shoelace-style/localize';
import type { DefaultTranslation } from '@shoelace-style/localize';

const translation: DefaultTranslation = {
  $code: 'nno',
  $name: 'Norwegian (Nynorsk)',
  $dir: 'ltr',

  carousel: 'Karusell',
  clearEntry: 'Fjern oppføring',
  close: 'Lukk',
  copied: 'Kopiert',
  copy: 'Kopier',
  currentValue: 'Gjeldande verdi',
  error: 'Feil',
  goToSlide: (slide: number, count: number) => `Gå til lysbilete ${slide} av ${count}`,
  hidePassword: 'Skjul passord',
  loading: 'Lastar',
  nextSlide: 'Neste lysbilete',
  numOptionsSelected: (num: number) => {
    if (num === 0) return 'Ingen alternativ valt';
    if (num === 1) return '1 alternativ valt';
    return `${num} alternativ valt`;
  },
  previousSlide: 'Førre lysbilete',
  progress: 'Framgong',
  remove: 'Fjern',
  resize: 'Endre storleik',
  scrollToEnd: 'Rull til slutten',
  scrollToStart: 'Rull til starten',
  selectAColorFromTheScreen: 'Vel ein farge frå skjermen',
  showPassword: 'Vis passord',
  slideNum: (slide: number) => `Lysbilete ${slide}`,
  toggleColorFormat: 'Byt fargeformat',
};

registerTranslation(translation);

export default translation;
