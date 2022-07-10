import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const Home: NextPage = () => {
	return (
		<>
			<h1 className="py-2 bg-gradient-to-r text-transparent bg-clip-text from-emerald-500 to-amber-500 text-white text-8xl md:text-9xl text-center">
				Hola?
			</h1>
			<Link href="/start">
				<button className="bg-green-600 text-white px-6 py-1 mt-20 rounded-md text-xl font-semibold">
					Empezar
				</button>
			</Link>
			{/* <button className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-6 py-2 mt-10 rounded-md text-2xl font-semibold">
					Empezar
				</button> */}
		</>
	)
}

export default Home
