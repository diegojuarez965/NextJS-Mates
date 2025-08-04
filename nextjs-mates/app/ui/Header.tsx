import Link from 'next/link';
import { satisfy } from '@/app/ui/fonts';

const Header = ({ role }: { role: string }) => {
    return (
        <header className="sticky top-0 z-10 bg-greenMate text-carbon py-4 shadow-md px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex-1" />
                <h1 className={`${satisfy.className} text-4xl font-bold text-center font-cursiva`}>
                    Mates El Sureño Universitario
                </h1>
                <div className="flex-1 flex justify-end gap-4">
                    {role === "" && (
                        <>
                            <Link
                                href="/register"
                                className="bg-white text-greenMate px-4 py-2 rounded-full text-sm hover:opacity-80"
                            >
                                Registrarse
                            </Link>
                            <Link
                                href="/login"
                                className="bg-white text-greenMate px-4 py-2 rounded-full text-sm hover:opacity-80"
                            >
                                Iniciar sesión
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
