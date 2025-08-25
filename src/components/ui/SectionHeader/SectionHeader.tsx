interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function SectionHeader({ title, description, icon, children }: SectionHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex items-center gap-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
