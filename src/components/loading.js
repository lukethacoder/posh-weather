import React from 'react'
import styled from 'styled-components'
// import Lottie from 'react-lottie'
// import * as animationData from '../config/loading.json'

const Loading = () => {
    // const defaultOptions = {
    //     loop: true,
    //     autoplay: true,
    //     animationData: animationData,
    //     rendererSettings: {
    //         preserveAspectRatio: 'xMidyMid slice'
    //     }
    // };
    return (
        <LoadingContainer classname="loading-component">
            {/* <Lottie
                options={defaultOptions}
                width={60}
                height={80}
            /> */}
            <h1 style={{color: "white", textAlign: "center"}}>Loading weather data</h1>
        </LoadingContainer>
    )
}

export default Loading

const LoadingContainer = styled.div`
    width: 100vw;
    height: 50vh;
    background-color: pink;
    color: red;
`