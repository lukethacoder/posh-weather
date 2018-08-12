import React from 'react'
// import Lottie from 'react-lottie'
import * as animationData from '../config/loading.json'

const Loading = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidyMid slice'
        }
    };
    return (
        <div classname="loading-component">
            {/* <Lottie
                options={defaultOptions}
                width={60}
                height={80}
            /> */}
            <p>Loading weather data</p>
        </div>
    )
}

export default Loading