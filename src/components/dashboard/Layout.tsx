// src/app/dashboard/layout.tsx
import { Container } from '@/components/layout/Container';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      {children}
    </Container>
  );
}