import '@/styles/globals.css'
import Head from 'next/head'
import Navbar from '/components/Navbar'
import Footer from '/components/Footer'

export default function App({ Component, pageProps }) {
  return  <>
            <Head>
              <title>Welcome</title>
            </Head>
            <Navbar/>
            <main className="container">
              <Component {...pageProps} />
            </main>
            <Footer/>
          </>
}
