import "./Timeline.scss"
import React, { useState, useEffect } from 'react'
import { useUtils } from "/src/helpers/utils.js"
import CircleAvatar from "/src/components/generic/CircleAvatar.jsx"
import InfoBadge from "/src/components/generic/InfoBadge.jsx"
import { useLanguage } from "/src/providers/LanguageProvider.jsx"
import Tags from "/src/components/generic/Tags.jsx"
import FaIcon from "/src/components/generic/FaIcon.jsx"

const utils = useUtils()

function Timeline({ items }) {
    if (!items) {
        return <></>
    }
    useEffect(() => {
       console.log(items)
    }, [])
    return (<> <p className="timeline-title text-center text-danger fw-bold fs-4 mb-3">No Onspot Registrations..!</p>
        <div className="timeline-wrapper">
           
            <ul className="timeline">
                {items.map((item, key) => (
                    <TimelineItem item={item} key={key} />
                ))}
                <TimelineTrailer />
            </ul>
        </div></>
    )
}

function TimelineItem({ item }) {
    const { getSelectedLanguage, getString } = useLanguage()
    const [expanded, setExpanded] = useState(false) // Track expansion state

    if (item.dateEnded === 'now')
        item.dateEnded = getString('now')

    const dateDisplay = utils.formatDateInterval(
        item.dateStarted,
        item.dateEnded,
        getSelectedLanguage().id,
        true,
        true
    )

    return (
        <li className={`timeline-item ${expanded ? "expanded" : ""}`}>
            <div className="timeline-avatar-wrapper">
                <CircleAvatar img={item.img}
                    alt="timeline-item"
                    fallbackIcon={item.faIcon}
                    fallbackIconColors={item.faIconColors} />
            </div>

            <div className="timeline-content-wrapper">
                <header className="timeline-content-header mb-3">
                    <div className="timeline-content-header-left">
                        <h5 className="title fw-bold mb-2" dangerouslySetInnerHTML={{ __html: utils.parseJsonText(item.title) }} />
                        <div className="info ms-3 text-muted font-family-subheadings fw-bold text-2">
                            <FaIcon iconName="fa-solid fa-desktop" className="me-2" />
                            <span dangerouslySetInnerHTML={{ __html: item.info }} />
                        </div>
                    </div>

                    <div className="timeline-content-header-right">
                        {item.value ==="" ? <InfoBadge text="Registrations Closed" /> :<a href={item.value} target="_blank" rel="noopener noreferrer"> <InfoBadge text={"Register Now"} /></a>}
                       
                        
                    </div>
                </header>

                {/* HIDDEN BY DEFAULT - Only shown when expanded */}
                {expanded && (
                   <> <div className="timeline-content-body mb-1 mb-md-2">
                        <div className="text" dangerouslySetInnerHTML={{ __html: utils.parseJsonText(item.text) }} />

                        {item.tags && item.tags.length > 0 && (
                            <Tags strings={item.tags} className="text-2 mt-3 pt-0 pt-md-1" />
                        )}
                    </div>
                  <a href={item.firstLink?.href} target="_blank" rel="noopener noreferrer"><InfoBadge text={"Rulebook"}/></a>  &nbsp; </>
                )}
               
                {/* Show etails Button */}
                <button style={{ all: "unset", cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
    {expanded ?<InfoBadge text="Hide Details"/> : <InfoBadge iconName="" text="Event Details" />}
                </button>


            </div>
        </li>
    )
}

function TimelineTrailer() {
    return (
        <li className="timeline-item timeline-item-trailer">
            <div className="timeline-avatar-wrapper">
                <CircleAvatar />
            </div>
        </li>
    )
}

export default Timeline
