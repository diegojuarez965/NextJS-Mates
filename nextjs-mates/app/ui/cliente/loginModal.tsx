type Props = {
	onClose: () => void
}

const LoginModal = ({ onClose }: Props) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
			<div className="mx-4 p-6 bg-white rounded-lg shadow-md">
				<h2 className="mb-4 text-lg font-semibold">Inicie sesión</h2>
				<p className="mb-4">Debes iniciar sesión para agregar al carrito</p>
				<div className="flex flex-col sm:flex-row justify-end gap-2">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
					>
						Cerrar
					</button>
					<button
						onClick={() => { window.location.href = '/login' }}
						className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
					>
						Iniciar sesion
					</button>
				</div>
			</div>
		</div>
	);
}

export default LoginModal