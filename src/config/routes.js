import HomePage from '@/components/pages/HomePage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Chat',
    path: '/',
    icon: 'MessageCircle',
component: HomePage
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'AlertCircle',
component: NotFoundPage
  }
};

export const routeArray = Object.values(routes);