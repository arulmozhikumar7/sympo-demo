import "./Section.scss"
import React, { useEffect, useState } from 'react'
import { useGlobalState } from "/src/providers/GlobalStateProvider.jsx"
import Box from "/src/components/wrappers/Box.jsx"
import BorderWrap from "/src/components/wrappers/BorderWrap.jsx"
import Scrollable from "/src/components/capabilities/Scrollable.jsx"
import { useLanguage } from "/src/providers/LanguageProvider.jsx"
import { useUtils } from "/src/helpers/utils.js"
import CountdownTimer from "/src/components/CountdownTimer.jsx";
import ArticleCards from "/src/components/articles/ArticleCards.jsx"
import ArticleContactForm from "/src/components/articles/ArticleContactForm.jsx"
import ArticleGrid from "/src/components/articles/ArticleGrid.jsx"
import ArticleInfoBlock from "/src/components/articles/ArticleInfoBlock.jsx"
import ArticleList from "/src/components/articles/ArticleList.jsx"
import ArticlePortfolio from "/src/components/articles/ArticlePortfolio.jsx"
import ArticleServices from "/src/components/articles/ArticleServices.jsx"
import ArticleTestimonials from "/src/components/articles/ArticleTestimonials.jsx"
import ArticleThread from "/src/components/articles/ArticleThread.jsx"
import ArticleTimeline from "/src/components/articles/ArticleTimeline.jsx"
import FullScreenToggleButton from "/src/components/widgets/FullScreenToggleButton"
import { useData } from "/src/providers/DataProvider.jsx"
import FaIcon from "/src/components/generic/FaIcon.jsx"
import { useWindow } from "/src/providers/WindowProvider.jsx"
import { useScheduler } from "/src/helpers/scheduler.js"
import SympoLogo from "../widgets/Logo3d"
import ImageView from "../generic/ImageView"

const TransitionClasses = {
    HIDDEN: 'section-transition-hidden',
    HIDING: 'section-transition-hiding',
    SHOWING: 'section-transition-showing',
    SHOWN: 'section-transition-shown',
    FORCE_SHOW: 'section-transition-show-without-transition'
}

const ARTICLES = {
    ArticleCards,
    ArticleContactForm,
    ArticleGrid,
    ArticleInfoBlock,
    ArticleList,
    ArticlePortfolio,
    ArticleServices,
    ArticleTestimonials,
    ArticleThread,
    ArticleTimeline
}

const utils = useUtils()
const scheduler = useScheduler()

function Section({ section }) {
    const { getSettings } = useData()
    const { isSectionActive, didRenderFirstSection, setDidRenderFirstSection } = useGlobalState()
    const { isBreakpoint, isMobileLayout, focusMainView } = useWindow()
    const [transitionClass, setTransitionClass] = useState(TransitionClasses.HIDDEN)

    const settings = getSettings()
    const scrollableEnabled = !isMobileLayout() && !utils.isTouchDevice()
    const articles = section.content && section.content["articles"] ?
        section.content["articles"] :
        []

    useEffect(() => {
        const isActive = isSectionActive(section.id)
        if (isActive) {
            _showSection()
        }
        else {
            _hideSection()
        }
    }, [isSectionActive(section.id)])

    const _showSection = () => {
        if (transitionClass === TransitionClasses.SHOWN)
            return

        if (didRenderFirstSection) {
            setTransitionClass(TransitionClasses.SHOWING)
            scheduler.clearAllWithTag('section-' + section.id)
            _changeStateAfterTimeout(TransitionClasses.SHOWN, 30)
        }
        else {
            setDidRenderFirstSection(true)
            setTransitionClass(TransitionClasses.SHOWN)
        }
    }

    const _hideSection = () => {
        if (transitionClass === TransitionClasses.HIDDEN)
            return

        setTransitionClass(TransitionClasses.FORCE_SHOW)
        scheduler.clearAllWithTag('section-' + section.id)
        _changeStateAfterTimeout(TransitionClasses.HIDING, 30)
        _changeStateAfterTimeout(TransitionClasses.HIDDEN, 1000)
    }

    const _changeStateAfterTimeout = (state, timeInMilliseconds) => {
        scheduler.schedule(() => {
            setTransitionClass(state)
        }, timeInMilliseconds, 'section-' + section.id)
    }

    return (
        <>
            {transitionClass !== TransitionClasses.HIDDEN && (
                <Box className={`lead-section ${transitionClass}`} opaque={true} id={`lead-section-${section.id}`}>

                    <div className={`lead-section-content`}>
                        {settings['fullScreenButtonEnabled'] && !utils.isIOS() && !isMobileLayout() && !utils.isSafari() && (
                            <div className={`full-screen-toggle-wrapper ${isBreakpoint('lg') ? 'full-screen-toggle-wrapper-top-right' : 'full-screen-toggle-wrapper-top-left'}`}>
                                <FullScreenToggleButton enabled={true}
                                    className={`fullscreen-toggle`} />
                            </div>)
                        }

                        <Scrollable id={`scrollable-${section.id}`}
                            scrollActive={transitionClass === TransitionClasses.SHOWN}
                            scrollEnabled={transitionClass !== TransitionClasses.HIDDEN && scrollableEnabled}>
                            <BorderWrap>
                                <section className={`w-100`}>
                                    <SectionHeader section={section} />
                                    <SectionContent articles={articles} />
                                </section>
                            </BorderWrap>
                        </Scrollable>
                    </div>
                </Box>
            )}
        </>
    )
}

function SectionHeader({ section }) {
    const { getTranslation } = useLanguage()
    const { isBreakpoint } = useWindow()

    let title = utils.parseJsonText(getTranslation(section.content["locales"], "title_long"))
    let subtitle = section.content["locales"]?.subtitle
        ? utils.parseJsonText(getTranslation(section.content["locales"], "subtitle"))
        : null;
    let prefix = utils.parseJsonText(getTranslation(section.content["locales"], "title_long_prefix", true))
    if (!isBreakpoint("lg")) {
        title = getTranslation(section.content["locales"], "title")
        title = `<span class="text-highlight">${title}</span>`
        prefix = null
    }

    return (
        <div className={`section-header w-full px-0  text-center ${prefix ? `mt-0` : `mt-1 mt-sm-2 mt-lg-4`}`}>
            {prefix && (
                <div className={`fw-bold text-muted lead-2 font-family-headings mb-2`}>
                    <FaIcon className={`me-2 opacity-50`} iconName={'fa-solid '} />

                    <span dangerouslySetInnerHTML={{ __html: prefix || `` }} />
                </div>
            )}

            <h3 className={`fw-bold pb-4 ${isBreakpoint('lg') ? 'lead-4' : ''} mx-4 mb-0`}
                dangerouslySetInnerHTML={{ __html: title }} />

            {subtitle && (
                <h5 className={` ${isBreakpoint('lg') ? 'lead-4' : ''}  mx-4 mb-0 `}
                    dangerouslySetInnerHTML={{ __html: subtitle }} />
            )}
            
            {/* {isBreakpoint('lg') ?
                <></> :
                <div>
                    <img src="/images/pictures/finallogo.png"  alt="" className="img-fluid "/>
                </div>} */}
            {section.id === 'about' &&<><SympoLogo /> <CountdownTimer /></>}

        </div>
    )
}

function SectionContent({ articles }) {
    const shouldAddSpacerAfterTitle = false

    return (
        <div className={`section-content ${shouldAddSpacerAfterTitle ? 'mt-md-5' : ''}`}>
            {articles.map((article, key) => 
            {
                const Component = ARTICLES[article.component]
                let mtClass = `mt-4 pt-1 pt-md-3`
                if (article.config?.ignorePaddingTop)
                    mtClass = `mt-4`

                return (
                    <div className={`article-wrapper ${mtClass}`} key={key}>
                        {Component && (
                            <Component data={article} />
                        )}

                        {!Component && (
                            <div className={`alert alert-danger text-3`}>
                                Component <strong>{article.component}</strong> not found! Make sure the component exists and is listed on the <i>ARTICLES</i> dictionary on <b>Section.jsx</b>.
                            </div>
                        )}
                      {key === 1 &&(<div className="flex justify-center items-center">
                      <div className="image-poster">
                      <ImageView
                        className={"w-[50%]"}
                        alt={"poster"}
                        src={"poster.png"}
                      />
                      </div>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15540.783435972458!2d80.1733791317028!3d13.15004234162027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5264a10c856599%3A0xac3348f41097ba7f!2sVelammal%20Engineering%20College!5e0!3m2!1sen!2sin!4v1740116319490!5m2!1sen!2sin"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>)}
                    </div>
                )
                 })} 
        </div>
    )
}

export default Section