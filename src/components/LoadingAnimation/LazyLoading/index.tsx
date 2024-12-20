import style from './index.module.css';

interface LazyLoadingProps {
  loading: boolean;
  children: React.ReactNode;
}

export const LazyLoading = ({ loading, children }: LazyLoadingProps) => {
  return loading ? (
    <div className="flex h-full w-full items-center justify-center gap-1">
      <div className={style.load_wrapp}>
        <div className={style.load}>
          <p className="text-gray-4">Loading......</p>
          <div className="flex w-full items-center justify-center gap-1">
            <div className={style.line}></div>
            <div className={style.line}></div>
            <div className={style.line}></div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    children
  );
};
