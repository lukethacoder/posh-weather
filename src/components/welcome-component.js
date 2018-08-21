import React, { Component, Fragment } from 'react'
import { Parallax } from 'react-spring'
import styled from 'styled-components'

// components
import {colors, fonts } from '../config/_variables'
import Button from './global/button'

const Slides = ({ offset, caption, onClick}) => (
    <Fragment>
        <SlideItem className="slideItem">
            <Parallax.Layer offset={offset} speed={0.5}>
                {caption}
            </Parallax.Layer>

            <Parallax.Layer offset={offset} speed={0}>
                <div onClick={onClick} >
                    <Button label="next" icon="GoChevronRight"/>
                    
                </div>
            </Parallax.Layer>
        </SlideItem>
    </Fragment>
)

class WelcomeSlider extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            userName: "steve",
            userLocation: "Canberra ACT"
        }
    }

    scroll = to => this.refs.parallax.scrollTo(to)

    render() {
        return (
            <WelcomeContainer>
                <section className="holdsParallax" style={{backgroundColor: "purple"}}>
                    <Parallax ref="parallax" pages={3} horizontal scrolling={false}>
                        <Slides className="Slides" offset={0}
                            onClick={() => this.scroll(1)}
                            caption={<p>
                                Welcome to Posh Weather. <br/>We believe in giving you the best weather experience money can buy
                            </p>}
                        />
                        <Slides className="Slides" offset={1}
                            onClick={() => this.scroll(2)}
                            caption={<p>
                                Jolly good to make your acquaintance. <br/>What may your name be?
                            </p>}
                        />
                        <Slides className="Slides" offset={2}
                            onClick={() => this.scroll(0)}
                            caption={<p>
                                Marvellous to meet you {this.state.userName}.
                                Our records suggest you reside at {this.state.userLocation}, 
                                is this correct?
                            </p>}
                        />
                    </Parallax>
                </section>
            </WelcomeContainer>
        )
    }
}

export default WelcomeSlider

const WelcomeContainer = styled.div`
    width: auto;
    height: 100%;
    margin: 0;
    font-family: ${fonts.serif};
    > section {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        > div {
            /* position: relative !important; */
            width: 50% !important;
            /* background-color: burlywood; */
            /* > div {
                display: flex;
                background-color: orange;
                width: 100%;
            } */
        }
    }
`

const SlideItem = styled.div`
    width: 100% !important;
    height: auto;
    display: grid;
    align-content: center;
    justify-content: center;
    background-color: navy;
    > div {
        p {
            text-align: left;
            color: ${colors.lightGrey};
            font-size: 2.25rem;
        }
        > div {
            position: absolute;
            bottom: 0;
            right: 0;
            > div {
                display: block;
            }
        }
    }
`