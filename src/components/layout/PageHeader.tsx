// src/components/layout/PageHeader.tsx
interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
  }
  
  export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
      <div className="flex items-center justify-between py-6 px-6 border-b">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {children}
      </div>
    );
  }