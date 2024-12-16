import { useSystemStore } from '@/store/system';
import { ConfigProvider } from '@douyinfe/semi-ui';
import type { Locale } from '@douyinfe/semi-ui/lib/es/locale/interface';
import en_US from '@douyinfe/semi-ui/lib/es/locale/source/en_US';
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import { Outlet } from 'react-router-dom';

const langMap: {
  [key: string]: Locale;
} = {
  'en-US': en_US,
  'zh-CN': zh_CN,
};

// src/layouts/index.tsx 默认加载的全局布局组件
export default function AppLayout() {
  const lang = useSystemStore((s) => s.lang);
  return (
    <ConfigProvider locale={langMap[lang]}>
      <Outlet />
    </ConfigProvider>
  );
}
