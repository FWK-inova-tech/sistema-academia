import { Loading as ModernLoading } from './ui';

interface LoadingProps {
  loadingMessage: string;
}

export const Loading = ({ loadingMessage }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <ModernLoading
        variant="spinner"
        size="lg"
        message={loadingMessage}
      />
    </div>
  )
}
