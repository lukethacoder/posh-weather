import React from 'react'
import styled from 'styled-components'
import { colors, fonts } from '../config/_variables';
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
            <h1>Loading weather data</h1>
            <hr></hr>
        </LoadingContainer>
    )
}

export default Loading

const LoadingContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    width: 100%;
    margin: 0;
    padding: 0;
    height: 100%;

    background-color: ${colors.gradientGreyDark};
    background: ${colors.gradientGreyDark}k; /* Old browsers */
    background: -moz-linear-gradient(left, ${colors.gradientGreyDark} 0%, ${colors.gradientGreyLight} 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(left, ${colors.gradientGreyDark} 0%, ${colors.gradientGreyLight} 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to right, ${colors.gradientGreyDark} 0%, ${colors.gradientGreyLight} 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='${colors.gradientGreyDark}', endColorstr='${colors.gradientGreyLight}',GradientType=1 ); /* IE6-9 */

    h1 {
        font-family: ${fonts.sans};
        color: ${colors.gold};
        align-self: flex-end;
        justify-self: center;
    }
    hr {
        height: 2px;
        width: 20%;
        color: ${colors.gold};
        background-color: ${colors.gold};
        align-self: flex-start;
        justify-self: center;
    }
`