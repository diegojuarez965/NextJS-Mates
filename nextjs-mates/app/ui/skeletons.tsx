export function ClientesTableRowSkeleton() {
  return (
    <tr className="border-b border-gray-100">
      <td className="px-4 py-4 text-center">
        <div className="mx-auto h-5 w-32 rounded bg-gray-100" />
      </td>
      <td className="px-4 py-4 text-center">
        <div className="mx-auto h-5 w-48 rounded bg-gray-100 break-all" />
      </td>
      <td className="px-4 py-4 text-center">
        <div className="mx-auto h-8 w-28 rounded bg-gray-100" />
      </td>
    </tr>
  );
}

export function VentaCardSkeleton() {
  return (
    <div className="rounded-xl border p-4 shadow-sm w-full max-w-sm space-y-3 animate-pulse">

      <div className="flex justify-between gap-2 items-center">
        <div className="h-4 w-40 bg-gray-300 rounded" /> 
        <div className="h-6 w-20 bg-gray-300 rounded-full" /> 
      </div>

      <div className="h-4 w-24 bg-gray-300 rounded" />

      <div className="space-y-2">
        <div className="h-4 w-50 bg-gray-300 rounded" />
        <div className="h-4 w-50 bg-gray-300 rounded" />
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-6 w-20 bg-green-200 rounded" />
      </div>
    </div>
  );
}

export function ClientesTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile skeletons */}
          <div className="md:hidden space-y-4">
            <ClientesMobileSkeleton />
            <ClientesMobileSkeleton />
            <ClientesMobileSkeleton />
            <ClientesMobileSkeleton />
            <ClientesMobileSkeleton />
            <ClientesMobileSkeleton />
          </div>

          {/* Desktop skeletons */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-center text-sm font-normal bg-gray-100">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium text-center">
                  Nombre
                </th>
                <th scope="col" className="px-4 py-5 font-medium text-center">
                  Email
                </th>
                <th scope="col" className="px-4 py-5 font-medium text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <ClientesTableRowSkeleton />
              <ClientesTableRowSkeleton />
              <ClientesTableRowSkeleton />
              <ClientesTableRowSkeleton />
              <ClientesTableRowSkeleton />
              <ClientesTableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ClientesMobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4 shadow">
      <div className="flex flex-col border-b border-gray-100 pb-4 gap-2">
        <div className="h-4 w-24 rounded bg-gray-100" />
        <div className="h-5 w-40 rounded bg-gray-100 break-all" />
        <div className="h-4 w-24 rounded bg-gray-100" />
        <div className="h-5 w-52 rounded bg-gray-100 break-all" />
      </div>
      <div className="pt-4">
        <div className="h-8 w-32 rounded bg-gray-100" />
      </div>
    </div>
  );
}

export function TableRowClientSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Mate */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center justify-center gap-3">
          <div className="h-[200px] w-[200px] bg-gray-100"></div>
          <div className="h-6 w-32 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Material */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="flex items-center justify-center">
          <div className="h-6 w-24 rounded bg-gray-100 flex"></div>
        </div>
      </td>
      {/* Color */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="flex items-center justify-center">
          <div className="h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Precio */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="flex items-center justify-center">
          <div className="h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-6 w-32 rounded bg-gray-100"></div>
        </div>
      </td>
    </tr>
  );
}

export function TableRowAdminSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Mate */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center justify-center gap-3">
          <div className="h-[200px] w-[200px] bg-gray-100"></div>
          <div className="h-6 w-32 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Material */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="flex items-center justify-center">
          <div className="h-6 w-24 rounded bg-gray-100 flex"></div>
        </div>
      </td>
      {/* Color */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="flex items-center justify-center">
          <div className="h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Precio */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="flex items-center justify-center">
          <div className="h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Vendidos */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="flex items-center justify-center">
          <div className="h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-7 w-7 rounded bg-gray-100"></div>
          <div className="h-7 w-7 rounded bg-gray-100"></div>
        </div>
      </td>
    </tr>
  );
}

export function MatesMobileAdminSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex flex-col justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-12 w-12 rounded-full bg-gray-100"></div>
          <div className="h-10 w-20 rounded bg-gray-100"></div>
        </div>
        <div className="mt-2 h-3 w-8 rounded bg-gray-100"></div>
        <div className="mt-2 h-3 w-8 rounded bg-gray-100"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="mt-2 h-6 w-24 rounded bg-gray-100"></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-gray-100"></div>
          <div className="h-10 w-10 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

export function MatesMobileClientSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex flex-col justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-12 w-12 rounded-full bg-gray-100"></div>
          <div className="h-10 w-20 rounded bg-gray-100"></div>
        </div>
        <div className="mt-2 h-3 w-8 rounded bg-gray-100"></div>
        <div className="mt-2 h-3 w-8 rounded bg-gray-100"></div>
      </div>
      <div className="flex flex-col w-full items-left justify-between pt-4">
        <div>
          <div className="mt-2 h-6 w-24 rounded bg-gray-100"></div>
          <div className="mt-2 h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

export function MatesTableClientSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <MatesMobileClientSkeleton />
            <MatesMobileClientSkeleton />
            <MatesMobileClientSkeleton />
            <MatesMobileClientSkeleton />
            <MatesMobileClientSkeleton />
            <MatesMobileClientSkeleton />
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-center text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Mate
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Material
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Color
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Precio
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <TableRowClientSkeleton />
              <TableRowClientSkeleton />
              <TableRowClientSkeleton />
              <TableRowClientSkeleton />
              <TableRowClientSkeleton />
              <TableRowClientSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function MatesTableAdminSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <MatesMobileAdminSkeleton />
            <MatesMobileAdminSkeleton />
            <MatesMobileAdminSkeleton />
            <MatesMobileAdminSkeleton />
            <MatesMobileAdminSkeleton />
            <MatesMobileAdminSkeleton />
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-center text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Mate
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Material
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Color
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Precio
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Vendidos
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <TableRowAdminSkeleton />
              <TableRowAdminSkeleton />
              <TableRowAdminSkeleton />
              <TableRowAdminSkeleton />
              <TableRowAdminSkeleton />
              <TableRowAdminSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function graficoSkeleton() {
  return (
    <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden relative animate-pulse">
      {/* Grid lines */}
      <div className="absolute top-1/6 w-full h-px bg-gray-300" />
      <div className="absolute top-1/3 w-full h-px bg-gray-300" />
      <div className="absolute top-1/2 w-full h-px bg-gray-300" />
      <div className="absolute top-2/3 w-full h-px bg-gray-300" />
      <div className="absolute top-5/6 w-full h-px bg-gray-300" />

      {/* Y-axis ticks */}
      <div className="absolute left-2 top-1/6 h-4 w-8 bg-gray-300 rounded" />
      <div className="absolute left-2 top-1/3 h-4 w-8 bg-gray-300 rounded" />
      <div className="absolute left-2 top-1/2 h-4 w-8 bg-gray-300 rounded" />
      <div className="absolute left-2 top-2/3 h-4 w-8 bg-gray-300 rounded" />
      <div className="absolute left-2 top-5/6 h-4 w-8 bg-gray-300 rounded" />

      {/* Simulated Line */}
      <svg className="absolute w-full h-full">
        <polyline
          points="0,150 40,130 80,160 120,110 160,130 200,90 240,120 280,80 320,100 360,70 400,90"
          fill="none"
          stroke="#ccc"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 2"
        />
      </svg>

      {/* X-axis labels */}
      <div className="absolute bottom-2 left-12 h-4 w-10 bg-gray-300 rounded" />
      <div className="absolute bottom-2 left-32 h-4 w-10 bg-gray-300 rounded" />
      <div className="absolute bottom-2 left-64 h-4 w-10 bg-gray-300 rounded" />
      <div className="absolute bottom-2 left-96 h-4 w-10 bg-gray-300 rounded" />
    </div>
  );

}

export function TopMatesSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="w-32 h-4 bg-gray-200 rounded" />
            <div className="w-24 h-3 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}


export function WeatherAnimationSkeleton() {
  return (
    <div className="flex items-center justify-center bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-md w-full max-w-2xl mx-auto animate-pulse">
      <div className="mr-6">
        <div className="w-[100px] h-[100px] bg-gray-300 rounded-full" />
      </div>
      <div className="flex-1 h-6 bg-gray-300 rounded w-2/3" />
    </div>
  );
}

export function SkeletonTitulo() {
  return (
    <div className="w-64 h-10 bg-gray-200 rounded-md animate-pulse mx-auto md:mx-0" />
  );
}
