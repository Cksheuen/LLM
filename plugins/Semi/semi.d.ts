declare module './semi.js' {
  interface SemiPluginOptions {
    theme: string;
    options?: {
      prefixCls?: string;
      variables?: { [key: string]: string | number };
      include?: string;
      cssLayer?: boolean;
    };
  }

  function SemiPlugin(options: SemiPluginOptions): {
    name: string;
    enforce: string;
    load(id: string): void;
  };

  export default SemiPlugin;
}
