type Props = {
	onClose: () => void;
	onDelete: () => void;
	vendidos: number
}

const DeleteModal = ({ onClose, onDelete, vendidos }: Props) => {

	return (
		<div>
			{vendidos === 0 &&
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
					<div className="mx-4 p-6 bg-white rounded-lg shadow-md">
						<h2 className="mb-4 text-lg font-semibold">Eliminar Mate</h2>
						<p className="mb-4">¿Estás seguro de que quieres eliminar este mate?</p>
						<div className="flex flex-col sm:flex-row justify-end gap-2">
							<button
								onClick={onClose}
								className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
							>
								Cancelar
							</button>
							<button
								onClick={onDelete}
								className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
							>
								Eliminar
							</button>
						</div>
					</div>
				</div>
			}
			{vendidos > 0 &&
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
					<div className="mx-4 p-6 bg-white rounded-lg shadow-md">
						<h2 className="mb-4 text-lg font-semibold">Eliminar Mate</h2>
						<p className="mb-4">No puedes eliminar un mate vendido</p>
						<div className="flex flex-col sm:flex-row justify-end gap-2">
							<button
								onClick={onClose}
								className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
							>
								Cerrar
							</button>
						</div>
					</div>
				</div>
			}
		</div>
	);

}

export default DeleteModal