import sunny from '@/public/lottie/sunny.json';
import moon from '@/public/lottie/moon.json';
import moonCloudy from '@/public/lottie/moonCloudy.json';
import cloudy from '@/public/lottie/cloudy.json';
import partlyCloudy from '@/public/lottie/partlyCloudy.json';

// Mensajes según clima y momento del día
const frases: Record<string, string> = {
    'fria-despejado-dia': 'El sol engaña, pero el mate calienta. Ideal para disfrutar al abrigo ☀️🧣🧉',
    'fria-despejado-noche': 'La noche está fresca, pero con un mate todo mejora 🌌🧉',
    'fria-parcial-dia': 'Un cielo indeciso y un día fresco… ¡el mate siempre resuelve! ☁️🧉',
    'fria-parcial-noche': 'Mate en mano, mantita en piernas. Noche ideal para quedarse 🛋️🧉',
    'fria-nublado-dia': 'Día gris y fresco: el mate es tu abrigo portátil ☁️🧥🧉',
    'fria-nublado-noche': 'Noche cerrada, mate abierto. Calor que viene del alma 🌑🔥🧉',

    'agradable-despejado-dia': '¡Un día perfecto! Llevate tu mate y salí a disfrutar del sol ☀️🧉',
    'agradable-despejado-noche': 'Una noche suave para compartir charlas y mates bajo las estrellas ✨🧉',
    'agradable-parcial-dia': 'Ni frío ni calor… el mate le pone sabor al día ☁️🧉',
    'agradable-parcial-noche': 'Las nubes traen calma y el mate, compañía 🌥️🧉',
    'agradable-nublado-dia': 'Día tranquilo, cielo cubierto. Tu mate, como siempre, al rescate ☁️🧉',
    'agradable-nublado-noche': 'Noche templada y nublada… una ronda de mates no falla 🌙🧉',

    'calurosa-despejado-dia': 'Solazo y calor… pero igual, ¡un mate fresco o un tereré entra como piña! ☀️🥵🧉',
    'calurosa-despejado-noche': 'Noche cálida, estrellas brillando… ¡ideal para un mate tranquilo 🌠🧉!',
    'calurosa-parcial-dia': 'Aunque el calor apriete, un buen mate no se negocia ☀️🧉',
    'calurosa-parcial-noche': 'Mate bajo el cielo estrellado y sin abrigo, ¡la noche acompaña! ✨🧉',
    'calurosa-nublado-dia': 'El cielo tapa el sol, pero el calor sigue… ¡igual se toma mate! ☁️🧉',
    'calurosa-nublado-noche': 'Noche cálida y nublada, mate suave y charla asegurada 🌙🧉',
};

// Clasifica clima según temperatura, cobertura de nubes y día/noche
export function clasificarClima(temp: number, isDay: boolean, cloudCover: number) {
    let tempCategory: 'fria' | 'agradable' | 'calurosa';
    if (temp <= 16) tempCategory = 'fria';
    else if (temp >= 25) tempCategory = 'calurosa';
    else tempCategory = 'agradable';

    let nubeCategory: 'despejado' | 'parcial' | 'nublado';
    if (cloudCover < 30) nubeCategory = 'despejado';
    else if (cloudCover <= 70) nubeCategory = 'parcial';
    else nubeCategory = 'nublado';

    return `${tempCategory}-${nubeCategory}-${isDay ? 'dia' : 'noche'}`;
}

// Devuelve mensaje según clave clima
export function getMensajeClima(clave: string) {
    return frases[clave] ?? 'El día es único, como tu mate. ¡Disfrutalo! 🧉';
}

// Devuelve animación Lottie según clave clima
export function getAnimacion(clave: string) {
    if (clave.includes('despejado-dia')) return sunny;
    if (clave.includes('despejado-noche')) return moon;
    if (clave.includes('parcial-dia')) return partlyCloudy;
    if (clave.includes('parcial-noche')) return moonCloudy;
    if (clave.includes('nublado')) return cloudy;
    return null
}


interface Recomendacion {
    color: string,
    material: string
}

// Devuelve recomendación de mate según clima
export function getRecomendacionClimatica(clave: string): Recomendacion {
    if (clave.includes('fria')) return { color: 'marron', material: 'madera' };
    if (clave.includes('calurosa')) return { color: 'beige', material: 'ceramica' };
    if (clave.includes('agradable')) return { color: 'verde', material: 'acero' };
    return { color: 'negro', material: 'plastico' }
}