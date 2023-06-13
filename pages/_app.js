import '@/styles/globals.css'
import Head from 'next/head'
import Navbar from '/components/Navbar'
import Footer from '/components/Footer'
import Prism from 'prismjs'
import "../styles/prism-one-dark.css"
import 'prismjs/components/prism-python';

export default function App({ Component, pageProps }) {
  return  <>
            <Head>
              <title>Welcome</title>
              <link rel="shortcut icon" href="/icosahedron.png"/>
            </Head>
            <Navbar/>
            <main className="container">
              <Component {...pageProps} />
            </main>
            <Footer/>
          </>
}
