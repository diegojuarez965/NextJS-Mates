import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cambiar contraseña',
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}