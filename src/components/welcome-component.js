import React, { Component,Fragment } from 'react'
import { Parallax } from 'react-spring'
import styled from 'styled-components'
import {colors, fonts } from '../config/_variables'

// components
import Button from './global/button'

const Slides = ({ offset, caption, onClick}) => (
    <Fragment>
        <Parallax.Layer offset={offset} speed={0.2} onClick={onClick}>
            <p>{caption}</p>
            <div>just some text m8</div>
        </Parallax.Layer>

        <Parallax.Layer offset={offset} speed={-0.2} onClick={onClick}>
            <Button onClick={onClick} label={"next >"}/>
        </Parallax.Layer>
    </Fragment>
)

class WelcomeSlider extends Component {
    // constructor(props) {
    //     super(props);
    
    //     this.state = {
    //         index: 0
    //     }
    // }

    scroll = to => this.refs.parallax.scrollTo(to)

    render() {
        return (
            <WelcomeContainer>
                <Parallax ref="parallax" pages={3} horizontal scrolling={false}>
                    <Slides offset={0} caption="whoasdjge" onClick={() => this.scroll(1)}/>
                    <Slides offset={1} caption="sgsdaghs" onClick={() => this.scroll(0)}/>
                </Parallax>
            </WelcomeContainer>
        )
    }
}

export default WelcomeSlider

const WelcomeContainer = styled.div`
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0 0 25% 0;
    font-family: ${fonts.serif};
    > div {
        display: grid;
        p {
            text-align: left;
            color: ${colors.lightGrey};
            font-size: 2.25rem;
        }
        button {
            display: block;
            float: right;
        }
    }
`