// Get Svipper design tokens
import '@tfk-samf/tokens/css';

// Register base path for Shoelace assets
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

// Register translations
import './shoelace/translations/nbo';
import './shoelace/translations/nno';
import './shoelace/translations/sme';

// Import and override styles
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';
import './shoelace/style/override-light.css';
import './shoelace/style/override-dark.css';

setBasePath('@shoelace-style/shoelace/dist');

// Re-export components with `Tfk` prefix
export {
  SlAlert as TfkAlert,
  SlAnimatedImage as TfkAnimatedImage,
  SlAnimation as TfkAnimation,
  SlAvatar as TfkAvatar,
  SlBadge as TfkBadge,
  SlBreadcrumb as TfkBreadcrumb,
  SlBreadcrumbItem as TfkBreadcrumbItem,
  SlButton as TfkButton,
  SlButtonGroup as TfkButtonGroup,
  SlCard as TfkCard,
  SlCarousel as TfkCarousel,
  SlCarouselItem as TfkCarouselItem,
  SlCheckbox as TfkCheckbox,
  SlColorPicker as TfkColorPicker,
  SlCopyButton as TfkCopyButton,
  SlDetails as TfkDetails,
  SlDialog as TfkDialog,
  SlDivider as TfkDivider,
  SlDrawer as TfkDrawer,
  SlDropdown as TfkDropdown,
  SlFormatBytes as TfkFormatBytes,
  SlFormatDate as TfkFormatDate,
  SlFormatNumber as TfkFormatNumber,
  SlIcon as TfkIcon,
  SlIconButton as TfkIconButton,
  SlImageComparer as TfkImageComparer,
  SlInclude as TfkInclude,
  SlInput as TfkInput,
  SlMenu as TfkMenu,
  SlMenuItem as TfkMenuItem,
  SlMenuLabel as TfkMenuLabel,
  SlMutationObserver as TfkMutationObserver,
  SlOption as TfkOption,
  SlPopup as TfkPopup,
  SlProgressBar as TfkProgressBar,
  SlProgressRing as TfkProgressRing,
  SlQrCode as TfkQrCode,
  SlRadio as TfkRadio,
  SlRadioButton as TfkRadioButton,
  SlRadioGroup as TfkRadioGroup,
  SlRange as TfkRange,
  SlRating as TfkRating,
  SlRelativeTime as TfkRelativeTime,
  SlResizeObserver as TfkResizeObserver,
  SlSelect as TfkSelect,
  SlSkeleton as TfkSkeleton,
  SlSpinner as TfkSpinner,
  SlSplitPanel as TfkSplitPanel,
  SlSwitch as TfkSwitch,
  SlTab as TfkTab,
  SlTabGroup as TfkTabGroup,
  SlTabPanel as TfkTabPanel,
  SlTag as TfkTag,
  SlTextarea as TfkTextarea,
  SlTooltip as TfkTooltip,
  SlTree as TfkTree,
  SlTreeItem as TfkTreeItem,
  SlVisuallyHidden as TfkVisuallyHidden,
} from '@shoelace-style/shoelace';
