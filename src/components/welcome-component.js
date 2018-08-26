// import React, { Component } from 'react'
// import { Transition, animated } from 'react-spring'
// import styled from 'styled-components'

// // components
// import {colors, fonts } from '../config/_variables'
// // import Button from './global/button'

// class WelcomeSlider extends Component {
//     constructor(props) {
//         super(props);
    
//         this.state = {
//             user: "steve",
//             userLocation: "Canberra ACT",
//             index: 0
//         }

//         this.toggle = this.toggle.bind(this);
//     }

//     toggle = e => this.setState(state => ({ index: state.index === 3 ? 0 : state.index + 1 }))

//     render() {
//         const pages = [
//             style => <animated.div style={{ ...style}}>
//                 <SlideItem>
//                     <p>Welcome to Posh Weather. <br/>
//                     {console.log(this)}
//                     We believe in giving you the best weather experience money can buy</p>
//                 </SlideItem>
//             </animated.div>,
//             style => <animated.div style={{ ...style}}>
//                 <SlideItem>
//                     <p>Jolly good to make your acquaintance. <br/>What may your name be?</p>
//                     <input id="name" type="text"
//                         onChange={(evt) => { console.log(evt.target.value); localStorage.setItem('username', evt.target.value);}}
//                     />
//                 </SlideItem>
//             </animated.div>,
//             style => <animated.div style={{ ...style}}>
//                 <SlideItem>
//                     <p>We hope you enjoy your stay</p>
//                 </SlideItem>
//             </animated.div>
//         ];
        
//         console.log(localStorage.getItem('username'));
//         if (this.state.index !== 3) {
//             return (
//                 <WelcomeContainer>
//                     <SlideItem>
//                         <Transition
//                             native
//                             from={{ opacity: 0, transform: 'translate3d(200%,0,0)' }}
//                             enter={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
//                             leave={{ opacity: 0, transform: 'translate3d(0,0,0)' }}
//                         >
//                             {pages[this.state.index]}
//                         </Transition>
//                     </SlideItem>
//                     <button onClick={this.toggle}>Next</button>
//                 </WelcomeContainer>
//             )
//         }
//         return (
            
//         )
//     }
// }

// export default WelcomeSlider

// const WelcomeContainer = styled.div`
//     position: relative;
//     width: auto;
//     height: 100%;
//     margin: 0;
//     font-family: ${fonts.serif};
//     h2 {
//         color: white;
//         position: absolute;
//         top: 0;
//     }
//     button {
//         position: absolute;
//         bottom: 20%;
//         /* right: 20%; */
//         width: auto;
//         padding: 0;
//         font-size: 1rem;
//     }
// `

// const SlideItem = styled.div`
//     color: white;
//     position: absolute;
//     width: 100%;
//     height: 450px;
//     display: block;
//     justify-content: center;
//     align-content: center;
//     will-change: transform, opacity;
//     div {
//         p {
//             text-align: left;
//             color: ${colors.lightGrey};
//             font-size: 2.25rem;
//         }
//     }
// `