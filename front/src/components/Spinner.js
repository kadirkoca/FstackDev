import React from "react"

export default function Spinner() {

    return (
        <div className="spinnerParent">
            <p className="bigtext">LOADING</p>
            <div className="spinner">
                <div className="tdot">
                    <div className="blob top"></div>
                    <div className="blob bottom"></div>
                    <div className="blob left"></div>
                    <div className="blob move-blob"></div>
                </div>
                <InfoText/>
            </div>
        </div>
    )
}

const InfoText = () => {
    const colors = ["#017777", "#DF68D3", "#D97582", "#377E4C", "#5E1263"]
    const string = "Please wait..! Something happening so important !"
    const chars = string.split("")
    const text = []
    for (let i = 0; i < chars.length; i++) {
        const randomColorNumber = Math.floor(Math.random() * colors.length)
        let marginRight = 0
        if (chars[i] === " ") {
            marginRight = '1rem'
        }

        const animationDelay = (Math.random() * (1 - 0.02) + 0.02).toFixed(2)
        const span = (<span key={i} className="tletters" style={{ color: colors[randomColorNumber], animationDelay:  animationDelay + "s", marginRight }}>{chars[i]}</span>)
        text.push(span)
    }
    return text
}