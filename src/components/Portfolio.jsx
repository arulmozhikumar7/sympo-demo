import "./Portfolio.scss"
import React, {useEffect, useState} from 'react'
import NavSidebar from "/src/components/nav/desktop/NavSidebar.jsx"
import MainSlider from "/src/components/layout/MainSlider"
import NavHeaderMobile from "/src/components/nav/mobile/NavHeaderMobile.jsx"
import NavTabController from "/src/components/nav/mobile/NavTabController.jsx"
import NavPillsFixed from "/src/components/nav/mobile/NavPillsFixed.jsx"
import {useGlobalState} from "/src/providers/GlobalStateProvider.jsx"
import {useUtils} from "/src/helpers/utils.js"
import { toast,ToastContainer , Bounce} from "react-toastify"

function Portfolio() {
    const {getActiveSection, setFixedNavigationEnabled} = useGlobalState()
    const [isFirstPage, setIsFirstPage] = useState(true)
    const utils = useUtils()

    useEffect(() => {
        if(utils.isTouchDevice() && utils.isAndroid()) {
            utils.addClassToBody('body-android')
        }
    
        setTimeout(() => {
            toast.error('No onsite registrations!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
    
            // Second toast after 2 more seconds
            setTimeout(() => {
                toast.info('All Registrations Closed!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }, 2000); // Delay for second toast
        }, 6000); // First toast after 2 seconds
    }, [])
    

    /** Force scroll to top every time the active section changes... **/
    useEffect(() => {
        const __first = isFirstPage
        const top = 258
        const scrollParams = {top: top, behavior: 'instant'}
        setIsFirstPage(false)
        if(__first || window.scrollY < top)
            return

        setFixedNavigationEnabled(false)
        window.scrollTo(scrollParams)

        setTimeout(() => {
            window.scrollTo(scrollParams)
            setFixedNavigationEnabled(true)
        }, 100)
    }, [getActiveSection()])

    return (
        <div className={`portfolio-wrapper`}>
            <div className={`portfolio`}  id={`portfolio`}>
                <div className={`sidebar-wrapper`}>
                    <NavSidebar/>
                </div>

                <div className={`content-wrapper`}>
                    <div className={`content`}>
                        <NavHeaderMobile/>
                        <MainSlider/>
                    </div>
                </div>

                <NavPillsFixed/>

                <div className={`nav-tabs-wrapper`}>
                    <NavTabController/>
                </div>
            </div>
            <ToastContainer
position="top-right"
autoClose={10000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>
        </div>
    )
}

export default Portfolio