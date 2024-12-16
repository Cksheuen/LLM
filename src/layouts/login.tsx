import Footer from '@/components/Footer';
import { IconHelpCircle } from '@douyinfe/semi-icons';
import { Button, Layout, Nav } from '@douyinfe/semi-ui';
import { FormattedMessage, Outlet } from 'react-router-dom';

const { Header, Content } = Layout;

export default function CommonLayout() {
  return (
    <Layout
      style={{ border: '1px solid var(--semi-color-border)' }}
      className="h-full"
    >
      <Header
        style={{ backgroundColor: 'var(--semi-color-bg-1)' }}
        className="sticky top-0"
      >
        <Nav
          mode="horizontal"
          header={{
            text: <FormattedMessage id="app.title" />,
          }}
          footer={
            <>
              <Button
                theme="borderless"
                icon={<IconHelpCircle size="large" />}
                style={{
                  color: 'var(--semi-color-text-2)',
                  marginRight: '12px',
                }}
              />
            </>
          }
        ></Nav>
      </Header>
      <Content
        style={{
          padding: '24px',
          margin: 'auto',
        }}
      >
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
}
