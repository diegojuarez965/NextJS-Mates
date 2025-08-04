import { satisfy } from '@/app/ui/fonts';
import Image from 'next/image';


export default function ElSureñoUniversitarioLogo() {
  return (
    <div
      className={`${satisfy.className} flex flex-row items-center leading-none max-w-full max-h-full`}
    >
      <Image
        src='/matesLogo.png'
        alt="Mates El Sureño Universitario Logo"
        width={200}
        height={200}
        className='hidden md:block'
      />
      <Image
        src='/matesLogo.png'
        alt="Mates El Sureño Universitario Logo"
        width={100}
        height={100}
        className='block md:hidden'
      />
      <p className="text-[32px] md:text-[44px] text-carbon font-bold">Mates El Sureño Universitario</p>
    </div>
  );
}