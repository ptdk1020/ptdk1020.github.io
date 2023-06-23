import '@/styles/globals.css'
import Head from 'next/head'
import Navbar from '/components/Navbar'
import Footer from '/components/Footer'
import Prism from 'prismjs'
import "../styles/prism-one-dark.css"
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-bash'

export default function App({ Component, pageProps }) {
  return  <>
            <Head>
              <title>Welcome</title>
              <link rel="shortcut icon" href="/icosahedron.png"/>
              <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0"/>
            </Head>
            <Navbar/>
            <main className="container">
              <Component {...pageProps} />
            </main>
            <Footer/>
          </>
}
