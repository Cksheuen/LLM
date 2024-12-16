import { Layout } from '@douyinfe/semi-ui';
import { Outlet } from 'react-router-dom';

export default function PanelLayout() {
  return (
    <Layout className="h-full">
      <Outlet />
    </Layout>
  );
}
