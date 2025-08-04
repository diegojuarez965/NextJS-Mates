import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Estado de Pago',
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}