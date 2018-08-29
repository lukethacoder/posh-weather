

import { CONFIG_DARK_SKY, MAPBOX_CONFIG } from './config/env';

// packages
import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Transition, animated, Spring } from 'react-spring'

// components
import Loading from './components/loading';
import Footer from './components/footer';
import logo from './images/posh_weather.svg';
import { colors, fonts } from './config/_variables';
import placeholder from './config/placeholder_weather'
import { dayOfWeek, getTheMonth, dateInMonth } from './config/date_data'

// global variables
const apiKey = CONFIG_DARK_SKY.API_KEY;
const darkSkyUrl = "https://api.darksky.net/forecast/";

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: MAPBOX_CONFIG.KEY });

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      index: 0,
      allWeatherData: placeholder,
      geoCodeData: '',
      renderSearchOptions: [],
      interimLocationVal: ''
    }
  }

  componentDidMount() {
    // checks local storage if user has entered a name
    if (typeof localStorage === "undefined" || localStorage === null) {
      let LocalStorage = require('node-localstorage').LocalStorage;
      // eslint-disable-next-line
      localStorage = new LocalStorage('./scratch');
      
    }

    if (localStorage.getItem('username') === null) {
      localStorage.setItem('username', 'User');
    }

    if (localStorage.getItem('location_name') === null) {
      localStorage.setItem('location_name', 'Location');
    }

    if (localStorage.getItem('username') !== 'User' && localStorage.getItem('location_name') !== 'Location') {
      this.setState({
        index: 4
      });
    }

    console.log('placeholder-weather data', this.state.allWeatherData);
  }

  getUserLocation(user_query) {
    geocodingClient.forwardGeocode({
      query: user_query,
      limit: 5
  })
  .send()
  .then(response => {
    const match = response.body;
    this.setState({
      renderSearchOptions: response.body.features
    });
    console.log('​App -> getUserLocation -> match', match);

  });

  }
  getAllWeatherData() {
    if (this.state.allWeatherData === placeholder) {
      this.setState({
        loading: true
      })
    }

    if (this.state.index !== 4) {
      return console.log('you already got the data, stop running');
    }
    console.log("run getAllWeatherData()")
    if (localStorage.getItem('location_name') === null ||
        localStorage.getItem('location_lon') === null ||
        localStorage.getItem('location_lat') === null
    ) {
      // this.getUserLocation(this.state.renderSearchOptions);
      localStorage.setItem('location_lon', this.state.renderSearchOptions[0].geometry.coordinates[0])
      localStorage.setItem('location_lat', this.state.renderSearchOptions[0].geometry.coordinates[1])
      localStorage.setItem('location_name', this.state.renderSearchOptions[0].place_name)
    }

    let lon = localStorage.getItem('location_lon');
    let lat = localStorage.getItem('location_lat');
    // axios.get(darkSkyUrl + apiKey + "/" + lat + "," + lon +"")
    //   .then(function(result) {
    //     let content = result.data;
    //     resolve(content)
    //   }
    // );

    axios({
        method: 'GET',
        url: darkSkyUrl + apiKey + "/" + lat + "," + lon +"",
    }).then( (response) => {
        if (response === "") {
            alert('error creating timeline entry');
        }
        this.setState(state => ({ index: state.index + 1, allWeatherData: response.data }));
        console.log('​App -> getAllWeatherData -> this.state.allWeatherData', this.state.allWeatherData);
    }).then((response) => {
      if (response !== null || this.state.loading === true) {
        this.setState({
          loading: false
        });
      }
    });
    // getDarkSkyData.then((response) => this.setState({allWeatherData: response}));
  }

  getTheDate() {
    let today = new Date();
    let returnTime = dayOfWeek[today.getDay()] + ' ' + dateInMonth[today.getDate()] + ' of ' + getTheMonth[today.getMonth()]; 
    return returnTime
  }

  toggle = e => this.setState(state => ({ index: state.index === 5 ? 0 : state.index + 1 }))

  render() {

    const { renderSearchOptions } = this.state;


    // welcome slides (if no local storage data)
    const pages = [
      style => <animated.div key="1" style={{ ...style}}>
          <SlideItem>
              <p>Welcome to Posh Weather. <br/>
              {console.log(this)}
              We believe in giving you the best weather experience money can buy</p>
          </SlideItem>
      </animated.div>,
      style => <animated.div key="2" style={{ ...style}}>
          <SlideItem>
              <p>Jolly good to make your acquaintance. <br/>What may your name be?</p>
              <input id="name" type="text" required
                  onChange={(evt) => { console.log(evt.target.value); localStorage.setItem('username', evt.target.value);}}
              />
          </SlideItem>
      </animated.div>,
      style => <animated.div key="3" style={{ ...style}}>
          <SlideItem>
              <p>Where are you right now?</p>
              {/* <input id="location" type="text" required
                  onChange={(evt) => {this.forceUpdate(); this.getUserLocation(evt.target.value);}}
              /> */}
              <input id="location" type="text" required
                  onChange={(evt) => {this.forceUpdate(); this.getUserLocation(evt.target.value);}}
              />
              {
                renderSearchOptions.map(key =>
                  <Spring
                    from={{opacity: 0, paddingTop: "-100px"}} to={{opacity: 1, paddingTop: "0px" }}
                  >
                    {styles =>
                      <li style={styles} key={key.id}
                        onClick={() => {
                          this.toggle();
                          localStorage.setItem('location_lon', key.geometry.coordinates[0]);
                          localStorage.setItem('location_lat', key.geometry.coordinates[1]);
                          localStorage.setItem('location_name', key.place_name);
                        }}
                      >{key.place_name}</li>
                    }
                  </Spring>
                )
              }
          </SlideItem>
      </animated.div>,
      style => <animated.div key="4" style={{ ...style}}>
        <SlideItem>
            <p>We hope you enjoy your stay</p>
        </SlideItem>
    </animated.div>
    ];

    if (this.state.loading === true) {
      return <Loading/>
    }

    let welcomeSlider = null;
    let content = null;

    // content if local Storage exists already (username + location)
    if (this.state.index >= 4) {
      this.getAllWeatherData();
      content = (
        <div style={{color: 'white'}}>
          <h1>{this.state.allWeatherData.currently.temperature}</h1>
        </div>
      )
    }

    if (this.state.index !== 4) {
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
    } else {
      welcomeSlider = null;
    }

    return (
      <AppContainer className="App">
        <Spring delay={1000} from={{opacity: 0, paddingTop: "-100px"}} to={{opacity: 1, paddingTop: "0px" }}>
          {styles =>
            <TopBar style={styles}>
              <p>{localStorage.getItem('username')} | {localStorage.getItem('location_name')}</p>
              <p>{this.getTheDate()}</p>
            </TopBar>
          }
        </Spring>
        <Header className="App-header">
          <img src={logo} alt="posh weather logo. Golden P with Posh weather written below."/>
        </Header>
        <MainContentContainer>
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
  /* position: fixed; */
  /* top: 0; */
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-auto-rows: 1fr;
  p {
    text-transform: uppercase;
    color: ${colors.gold};
    font-size: 1rem;
    padding: 1% 5%;
    &:nth-of-type(2) {
      text-align: right;
    }
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