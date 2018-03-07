import { Fragment } from "react"
import Head from "next/head"

import { PLACES_API } from "../variables"

const PlacesImport = () => (
    <Fragment>
        {
            <Head>
                <script type="text/javascript" src={PLACES_API}></script>
            </Head>
        }
    </Fragment>
)

export default PlacesImport