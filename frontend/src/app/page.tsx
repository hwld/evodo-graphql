import { Routes } from '@/lib/routes';
import { redirect } from 'next/navigation';

const RootPage: React.FC = () => {
  redirect(Routes.home);
};

export default RootPage;
