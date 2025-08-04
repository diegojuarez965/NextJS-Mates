import { quicksand } from "../fonts";
import Lottie from "lottie-react";
import { getAnimacion, getMensajeClima } from "@/app/lib/weather-utils";

interface Props {
  claveClima: string;
}

const AnimatedWeather = ({ claveClima }: Props) => {
  // Obtiene mensaje descriptivo según el clima
  const mensaje = getMensajeClima(claveClima);
  // Obtiene animación asociada al clima
  const weatherAnimation = getAnimacion(claveClima);


  return (
    <div className="flex items-center justify-center bg-greenMateTransparent backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-md w-full max-w-2xl mx-auto">
      {weatherAnimation !== null ? (
        <>
          <div className="mr-6">
            <div className="w-[100px] h-[100px] relative">
              <Lottie animationData={weatherAnimation} loop autoPlay />
            </div>
          </div>
          <p className={`${quicksand.className} text-lg md:text-xl text-carbon text-center`}>
            {mensaje}
          </p>
        </>
      )
        : (
          <p className={`${quicksand.className} text-lg md:text-xl text-carbon text-center`}>
            {mensaje}
          </p>)
      }

    </div>
  );
}

export default AnimatedWeather
