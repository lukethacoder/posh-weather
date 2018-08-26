

// user for testing: https://api.darksky.net/forecast/ API_KEY_HERE /35.2384,149.0838

// re-enable before pushing live 
import axios from 'axios';

// import { userData } from './config/user-data';
// eslint-disable-next-line
import { CONFIG_DARK_SKY, MAPBOX_CONFIG } from './config/env';

// packages
import React, { Component } from 'react';
import styled from 'styled-components';
import { Transition, animated } from 'react-spring'
// import localStorage from 'node-localstorage';

// components
import Loading from './components/loading';
import Footer from './components/footer';
import logo from './images/posh_weather.svg';
import { colors, fonts } from './config/_variables';

// const apiKey = CONFIG_DARK_SKY.API_KEY;
// const darkSkyUrl = "https://api.darksky.net/forecast/";

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: MAPBOX_CONFIG.KEY });

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      username: 'User',
      index: 0,
    }
  }

  componentDidMount() {
    // checks local storage if user has entered a name
    if (typeof localStorage === "undefined" || localStorage === null) {
      let LocalStorage = require('node-localstorage').LocalStorage;
      // eslint-disable-next-line
      localStorage = new LocalStorage('./scratch');
    }

    // localStorage.setItem('username', 'John');
    // console.log(localStorage.getItem('username'));
    this.setState({
      username: localStorage.getItem('username')
    })
  }

  getUserLocation(user_query) {
    // axios({
    //   method:'get',
    //   url:'https://api.mapbox.com/geocoding/v5/mapbox.places/19%20band.json?access_token=' + MAPBOX_CONFIG.KEY + 'country=au&autocomplete=true'
    // })
    //   .then(function(response) {
    //   response.data
    //   console.log('​App -> getUserLocation -> response.data', response.data);
    // });

    geocodingClient
  .forwardGeocode({
    query: user_query,
    limit: 2
  })
  .send()
  .then(response => {
    const match = response.body;
    console.log('​App -> getUserLocation -> match', match);
  });

  // map over array of places

  return (
    <ul>
      
    </ul>
  )

// geocoding with proximity
// geocodingClient
//   .forwardGeocode({
//     query: 'Paris, France',
//     proximity: [-95.4431142, 33.6875431]
//   })
//   .send()
//   .then(response => {
//     const match = response.body;
//   });

// geocoding with countries
// geocodingClient
//   .forwardGeocode({
//     query: 'Paris, France',
//     countries: ['fr']
//   })
//   .send()
//   .then(response => {
//     const match = response.body;
//   });

// geocoding with bounding box
// geocodingClient
//   .forwardGeocode({
//     query: 'Paris, France',
//     bbox: [2.14, 48.72, 2.55, 48.96]
//   })
//   .send()
//   .then(response => {
//     const match = response.body;
//   });

  }

  // getAllWeatherData() {
  //   console.log("run getAllWeatherData()")
  //   let getDarkSkyData = new Promise(
  //     function(resolve, reject) {
  //       axios.get(darkSkyUrl + apiKey + "/35.2384,149.0838")
  //         .then(function(result) {
  //           let content = result.data;
  //           console.log(content)
  //           resolve(content)
  //         }
  //       );
  //     }
  //   );
  //   getDarkSkyData.then(
  //     function(result) {
  //       console.log("result")
  //       console.log(result)
  //       return result
  //     }
  //   )
  // }


  toggle = e => this.setState(state => ({ index: state.index === 4 ? 0 : state.index + 1 }))

  render() {

    const pages = [
      style => <animated.div style={{ ...style}}>
          <SlideItem>
              <p>Welcome to Posh Weather. <br/>
              {console.log(this)}
              We believe in giving you the best weather experience money can buy</p>
          </SlideItem>
      </animated.div>,
      style => <animated.div style={{ ...style}}>
          <SlideItem>
              <p>Jolly good to make your acquaintance. <br/>What may your name be?</p>
              <input id="name" type="text"
                  onChange={(evt) => { console.log(evt.target.value); localStorage.setItem('username', evt.target.value);}}
              />
          </SlideItem>
      </animated.div>,
      style => <animated.div style={{ ...style}}>
          <SlideItem>
              <p>Where are you from?</p>
              <input id="location" type="text"
                  onChange={(evt) => { this.getUserLocation(evt)}}
              />
          </SlideItem>
      </animated.div>,
      style => <animated.div style={{ ...style}}>
        <SlideItem>
            <p>We hope you enjoy your stay</p>
        </SlideItem>
    </animated.div>
    ];
    
    console.log(localStorage.getItem('username'));

    if (this.state.loading === true) {
      return <Loading/>
    }

    let welcomeSlider = null;


    let content = null;
    if (this.state.index >= 4) {
      content = (
        <div style={{color: 'white'}}>
          hola matey
        </div>
      )
    }

    if (this.state.index !== 3) {
      welcomeSlider = (
        <WelcomeSliderContainer>
          <WelcomeContainer>
              <SlideItem>
                  <Transition
                      native
                      from={{ opacity: 0, transform: 'translate3d(200%,0,0)' }}
                      enter={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                      leave={{ opacity: 0, transform: 'translate3d(0,0,0)' }}
                  >
                      {pages[this.state.index]}
                  </Transition>
              </SlideItem>
              <button onClick={this.toggle}>Next</button>
          </WelcomeContainer>
        </WelcomeSliderContainer>
      )
    }

    return (
      <AppContainer className="App">
        <TopBar>
          <p>{localStorage.getItem('username')}</p>
        </TopBar>
        <Header className="App-header">
          <img src={logo} alt="posh weather logo. Golden P with Posh weather written below."/>
        </Header>
        <MainContentContainer>
          {this.getUserLocation()}
          {content}
          {welcomeSlider}
        </MainContentContainer>
        <Footer/>
      </AppContainer>
    );
  }
}

export default App;

const TopBar = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: auto;
  p {
    color: ${colors.gold};
    font-size: 1rem;
    padding: 1% 5%;
  }
`

const AppContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: ${fonts.sans};
  min-height: 100vh;

  /* Gradients for dayz */
  background-color: ${colors.gradientGreyDark};
  background: ${colors.gradientGreyDark}k; /* Old browsers */
  background: -moz-linear-gradient(left, ${colors.gradientGreyDark} 0%, ${colors.gradientGreyLight} 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(left, ${colors.gradientGreyDark} 0%, ${colors.gradientGreyLight} 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to right, ${colors.gradientGreyDark} 0%, ${colors.gradientGreyLight} 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='${colors.gradientGreyDark}', endColorstr='${colors.gradientGreyLight}',GradientType=1 ); /* IE6-9 */
`

const MainContentContainer = styled.section`
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
  display: grid;
  align-content: center;
  justify-content: center;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  overflow: hidden;
`

const Header = styled.header`
  width: 100%;
  height: 10vh;
  padding: 5% 0 0 0;
  color: ${colors.white};
  display: grid;
  justify-content: center;
  img {
    display: block;
    width: auto;
    height: 100%;
  }
`

const WelcomeSliderContainer = styled.div`
  width: 50%;
  min-height: 250px;
  /* background-color: green; */
  padding: 10% 25%;
  position: relative;
  display: block;
}
`

const WelcomeContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    font-family: ${fonts.serif};
    h2 {
        color: white;
        position: absolute;
        top: 0;
    }
    button {
        position: absolute;
        bottom: 20%;
        /* right: 20%; */
        width: auto;
        padding: 0;
        font-size: 1rem;
    }
`

const SlideItem = styled.div`
    color: white;
    position: absolute;
    width: 100%;
    height: 450px;
    display: block;
    justify-content: center;
    align-content: center;
    will-change: transform, opacity;
    div {
        p {
            text-align: left;
            color: ${colors.lightGrey};
            font-size: 2.25rem;
        }
    }
`