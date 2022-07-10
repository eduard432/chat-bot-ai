import { FC } from 'react'
import Head from 'next/head'

type Props = {
	title?: string
	children: JSX.Element
}

const Layout: FC<Props> = ({ children }) => {
	return (
		<>
			<Head>
				<title>Chat Compa</title>
				<meta name="description" content="Empieza a chatear con alguien!!" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="bg-black h-screen font-mono max-h-screen">
				<div className="h-full flex flex-col items-center justify-center">
					{children}
				</div>
			</div>
		</>
	)
}

export default Layout
