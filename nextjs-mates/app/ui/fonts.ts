import { Lusitana, Inter, Satisfy, Quicksand } from 'next/font/google';

export const lusitana = Lusitana({
    subsets: ['latin'],
    variable: '--font-lusitana',
    weight: ['400', '700'],
})

export const satisfy = Satisfy({
    subsets: ['latin'],
    variable: '--font-satisfy',
    weight: ['400'],
})

export const quicksand = Quicksand({
    subsets: ['latin'],
    variable: '--font-quicksand',
    weight: ['400', '700'],
})

export const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})      