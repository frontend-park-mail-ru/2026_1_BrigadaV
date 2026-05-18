import '@/shared/lib/leaflet';

import { App } from '@/app/app';
import { registerServiceWorker } from './shared/lib';

await App();

await registerServiceWorker();
