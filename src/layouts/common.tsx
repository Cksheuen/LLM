import React from 'react';
import { Layout } from '@douyinfe/semi-ui';
import { Image } from '@douyinfe/semi-ui';
import Logo from '@/assets/logo.png';
import { Outlet } from 'react-router-dom';
import { FormattedMessage } from 'react-router-dom';
import CommonNav from '@/components/Nav/index';
import CommonHeader from '@/components/Header';

export default function Common() {
  const { Header, Footer, Sider, Content } = Layout;
  const commonStyle = 'p-3 bg-[--semi-color-fill-0]';
  return (
    <Layout className="flex h-full bg-[--semi-color-fill-0]">
      <Sider className="h-full bg-[--semi-color-fill-0]">
        <CommonNav />
      </Sider>
      <Layout className="flex h-full flex-col">
        <Header className={commonStyle}>
          <CommonHeader />
        </Header>
        <Content className="flex-grow overflow-auto">
          <Outlet />
        </Content>
        {/* <Footer className={commonStyle}>Footer</Footer> */}
      </Layout>
    </Layout>
  );
}
