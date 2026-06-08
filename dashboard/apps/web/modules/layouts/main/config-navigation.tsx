import { paths } from '@seven-auto/libs';
import Iconify from 'modules/components/iconify';

import { NavItemBaseProps } from './nav/types';

// ----------------------------------------------------------------------

export const navConfig: NavItemBaseProps[] = [
  {
    title: 'nav.posts',
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: paths.post.root,
  },
  // {
  //   title: 'pricing',
  //   icon: <Iconify icon="solar:chat-round-money-bold-duotone" />,
  //   path: paths.pricing,
  // },
  {
    title: 'nav.other',
    path: '/other',
    icon: <Iconify icon="solar:file-bold-duotone" />,
    type: 'subheader',
    children: [
      {
        subheader: 'nav.company',
        items: [
          { title: 'nav.about_us', path: paths.about },
          { title: 'nav.contact_us', path: paths.contact },
          { title: 'nav.faqs', path: paths.faqs },
        ],
      },
      {
        subheader: 'nav.technical',
        items: [{ title: 'nav.features', path: paths.features }],
      },
      {
        subheader: 'nav.legal',
        items: [
          { title: 'nav.terms_conditions', path: paths.termsConditions },
          { title: 'nav.privacy_policy', path: paths.privacyPolicy },
        ],
      },
      {
        subheader: 'nav.payment',
        items: [
          { title: 'nav.pricing', path: paths.pricing },
          { title: 'nav.deposit', path: paths.payment },
        ],
      },
    ],
  },
];
