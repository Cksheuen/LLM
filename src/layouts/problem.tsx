import { Layout } from '@douyinfe/semi-ui';
import { Outlet } from 'react-router-dom';
import ProblemHeader from '@/components/Problem/header';

export default function ProblemLayout() {
  return (
    <Layout className="h-full">
      <ProblemHeader />
      <Outlet />
    </Layout>
  );
}
