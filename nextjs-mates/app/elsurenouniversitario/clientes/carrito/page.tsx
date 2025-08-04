import { CarritoTable } from "@/app/ui/cliente/carritoTable"
import { satisfy } from "@/app/ui/fonts"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Carrito',
};

export default async function Page() {
    return (
        <div className='w-full min-h-screen overflow-y-hidden mt-2 mb-2'>
            <div className="ml-6 mr-6">
                <div className="flex w-full items-center justify-between">
                    <h1 className={`${satisfy.className} text-4xl text-carbon mt-6 ml-4`}>Carrito</h1>
                </div>
                <div>
                    <CarritoTable />
                </div>
            </div>
        </div>
    )
}