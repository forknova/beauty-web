import { library, config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

import {
  faShoppingBag,
  faUser,
  faHeart,
} from '@fortawesome/pro-regular-svg-icons';

library.add(faShoppingBag, faUser, faHeart);
