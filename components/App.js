import Header from "./Header"
import Head from "next/head"
import { Fragment } from 'react'


const App = ({ children }) => (
  <Fragment>
    <Head>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />

    </Head>

    <Header />
    <main>
      {children}
      <style jsx global>{`
        * {
          font-family: Roboto, sans-serif
        }
        body {
          margin: 0;
          padding: 25px 50px;
        }
        a {
          color: #22bad9;
        }
        p {
          font-size: 14px;
          line-height: 24px;
        }
        article {
          margin: 0 auto;
          max-width: 650px;
        }
        button {
          align-items: center;
          background-color: #22bad9;
          border: 0;
          color: white;
          display: flex;
          padding: 5px 7px;
        }
        button:active {
          background-color: #1b9db7;
          transition: background-color 0.3s;
        }
        button:focus {
          outline: none;
        }
      `}</style>
    </main>
  </Fragment>
)

export default App