import { Route } from '@angular/router';

import { GdprPolicyComponent } from './gdpr-policy.component';

export const gdprPolicyRoute: Route = {
  path: 'gdpr-policy',
  component: GdprPolicyComponent,
  data: {
    pageTitle: 'gdpr-policy',
  },
};
