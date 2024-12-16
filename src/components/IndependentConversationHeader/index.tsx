import { useLocation } from 'react-router-dom';

export default function IndependentConversationHeader() {
  const location = useLocation();
  return (
    <div className="flex items-center justify-center pt-5">
      <div className="text-4 flex items-center justify-center gap-1">
        <span className="i-carbon-chat"></span>
        <span>{location.pathname}</span>
      </div>
    </div>
  );
}
