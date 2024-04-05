import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'customer',
        data: { pageTitle: 'Customers' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'customer-emails',
        data: { pageTitle: 'CustomerEmails' },
        loadChildren: () => import('./customer-emails/customer-emails.module').then(m => m.CustomerEmailsModule),
      },
      {
        path: 'chat',
        data: { pageTitle: 'Chats' },
        loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),
      },
      {
        path: 'shop',
        data: { pageTitle: 'Shops' },
        loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
      },
      {
        path: 'volunteer-post',
        data: { pageTitle: 'VolunteerPosts' },
        loadChildren: () => import('./volunteer-post/volunteer-post.module').then(m => m.VolunteerPostModule),
      },
      {
        path: 'application',
        data: { pageTitle: 'Applications' },
        loadChildren: () => import('./application/application.module').then(m => m.ApplicationModule),
      },
      {
        path: 'reservation',
        data: { pageTitle: 'Reservations' },
        loadChildren: () => import('./reservation/reservation.module').then(m => m.ReservationModule),
      },
      {
        path: 'feedback',
        data: { pageTitle: 'Feedbacks' },
        loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackModule),
      },
      {
        path: 'item',
        data: { pageTitle: 'Items' },
        loadChildren: () => import('./item/item.module').then(m => m.ItemModule),
      },
      {
        path: 'event',
        data: { pageTitle: 'Events' },
        loadChildren: () => import('./event/event.module').then(m => m.EventModule),
      },
      {
        path: 'interested-events',
        data: { pageTitle: 'InterestedEvents' },
        loadChildren: () => import('./interested-events/interested-events.module').then(m => m.InterestedEventsModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
