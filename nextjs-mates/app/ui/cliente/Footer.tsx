import { quicksand } from '@/app/ui/fonts';

const Footer = () => {
    return (
        <footer className={`${quicksand.className} bg-greenMate text-carbon text-sm text-center py-4`}>
            <p>Contacto: +54 9 11 5555-5555 - Email: matesureño@gmail.com</p>
            <p className="mt-1">Mates El Sureño Universitario &copy;</p>
        </footer>
    );

}

export default Footer