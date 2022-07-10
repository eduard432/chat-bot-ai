const Register = () => {
	return (
		<>
			<h2 className="mb-10 py-2 bg-gradient-to-r text-transparent bg-clip-text from-emerald-500 to-amber-500 text-white text-6xl md:text-8xl text-center">
				Registro
			</h2>
			<form className="border border-white px-6 py-8 w-72">
				{/* <label htmlFor="tel">Telefono:</label> */}
				<p className="font-semibold text-xl text-white">Telefono:</p>
				<input
					ref={(ref) => ref?.focus()}
					type="tel"
					className="border border-white bg-transparent py-1 my-1 px-2 focus:outline-none text-white block w-full"
				/>
				<button className="bg-green-500 text-white px-6 py-1 mt-5 rounded-md text-xl font-semibold w-full">
					Empezar
				</button>
			</form>
			<form className="border border-white px-6 py-8 w-72">
				{/* <label htmlFor="tel">Telefono:</label> */}
				<p className="font-semibold text-xl text-white">Código:</p>
				<input
					ref={(ref) => ref?.focus()}
					type="number"
					className="border border-white bg-transparent py-1 my-1 px-2 focus:outline-none text-white block w-full"
				/>
				<div >
					<p className="text-white break-words">
						Te hemos enviado un código a tu número de whatsapp
					</p>
				</div>
				<button className="bg-cyan-500 text-white px-6 py-1 mt-5 rounded-md text-xl font-semibold w-full">
					Verificar
				</button>
			</form>
		</>
	)
}

export default Register
