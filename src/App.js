// packages
import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Transition, animated, Spring } from 'react-spring'

// components
import Loading from './components/loading';
// import Footer from './components/footer';
import logo from './images/posh_weather.svg';
import { colors, fonts, view } from './config/_variables';
import placeholder from './config/placeholder_weather'
import { dayOfWeek, getTheMonth, dateInMonth, TwentyFourToTwleve } from './config/date_data'


// global variables
const apiKey = process.env.REACT_APP_CONFIG_DARK_SKY;
const darkSkyUrl = "https://api.darksky.net/forecast/";
const herokuCORS = "https://cors-anywhere.herokuapp.com/";

const mapboxKey = process.env.REACT_APP_MAPBOX_CONFIG;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapboxKey });

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      index: 0,
      DLCbutton: false,
      allWeatherData: placeholder,
      geoCodeData: '',
      renderSearchOptions: [],
      interimLocationVal: '',
      bareView: true,
      ExtendedView: false,
      DailyForecast: false,
      WeeklyForecast: false,
      ExtensiveWeather: false,
      ClassyAudio: false,
      dlcView: false,
    }

  }

  checkUserDLC() {
    if (localStorage.getItem('ExtendedView') === 'unlocked') {
      this.setState({
        ExtendedView: true,
        bareView: false
      });
    } else {
      this.setState({
        ExtendedView: false,
        bareView: true
      });
    }
    if (localStorage.getItem('DailyForecast') !== null) {
      this.setState({
        DailyForecast: true
      });
    }
    if (localStorage.getItem('WeeklyForecast') !== null) {
      this.setState({
        WeeklyForecast: true
      });
    }
    if (localStorage.getItem('ExtensiveWeather') !== null) {
      this.setState({
        ExtensiveWeather: true
      });
    }
    if (localStorage.getItem('ClassyAudio') !== null) {
      this.setState({
        ClassyAudio: true
      });
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

    // check user DLC 
    this.checkUserDLC();

    if (localStorage.getItem('username') !== 'User' && localStorage.getItem('location_name') !== 'Location') {
      this.setState({
        index: 4
      });
    }
  }

  getUserLocation(user_query) {
    geocodingClient.forwardGeocode({
      query: user_query,
      limit: 5
  })
  .send()
  .then(response => {
    if (this.state.renderSearchOptions !== response.body.features) {
      this.setState({
        renderSearchOptions: response.body.features
      });
    }
  });

  }
  getAllWeatherData() {
    if (this.state.allWeatherData === placeholder) {
      this.setState({
        loading: true
      })
    }

    // if (this.state.index !== 4) {
    //   return console.log('you already got the data, stop running');
    // }
    if (localStorage.getItem('location_name') === null ||
        localStorage.getItem('location_lon') === null ||
        localStorage.getItem('location_lat') === null
    ) {
      // this.getUserLocation(this.state.renderSearchOptions);
      localStorage.setItem('location_lon', this.state.renderSearchOptions[0].geometry.coordinates[0])
      localStorage.setItem('location_lat', this.state.renderSearchOptions[0].geometry.coordinates[1])
      localStorage.setItem('location_name', this.state.renderSearchOptions[0].text)
    }

    let lon = localStorage.getItem('location_lon');
    let lat = localStorage.getItem('location_lat');

    axios({
        method: 'GET',
        url: herokuCORS + darkSkyUrl + apiKey + "/" + lat + "," + lon +"",
        responseType: 'json',
        params: {
          units: "auto"
        }
    }).then( (response) => {
        if (response === this.state.allWeatherData) {
            alert('error creating timeline entry');
        }
        this.setState({
          index: this.state.index + 1,
          allWeatherData: response.data,
          loading: false
        })
        // this.setState({
        //   allWeatherData: response,
        //   loading: false
        // });
    });
  }

  getTheDate() {
    let today = new Date();
    let returnTime = dayOfWeek[today.getDay()] + ' ' + dateInMonth[today.getDate()] + ' of ' + getTheMonth[today.getMonth()]; 
    return returnTime
  }

  editUsername() {
    console.log("coming soon")
  }

  editLocation() {
    console.log("coming soon")
  }

  degreesToDirection(num) {
      var val = Math.floor((num / 22.5) + 0.5);
      var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
      return arr[(val % 16)];
  }

  // daily forecast functions
  mapDailyForecastTime(weather_data) {
    let dailyForecast = weather_data.map((key, index) =>
      {
        // caps hours to 24hrs
        if (index >= 24) {
          return null
        }
        else {
          return (
            <li key={key.time}>
              <H3f>{ TwentyFourToTwleve[new Date(new Date(key.time * 1000).toISOString()).getHours()] }</H3f>
            </li>
          )
        }
      }
    )
    return dailyForecast;
  }

  mapDailyForecastDay(weather_data) {
    let dailyForecast = weather_data.map((key, index) =>
      {
        // caps hours to 24hrs
        if (index >= 24) {
          return null
        }
        else {
          return (
            <li key={key.time}>
              <LineHR100/>
              <H2f>{ Math.round(key.temperature * 1000 / 1000 ) }°</H2f>
              <LineHR100/>
            </li>
          )
        }
      }
    )
    return dailyForecast;
  }

  mapDailyForecastPrecip(weather_data) {
    let dailyForecast = weather_data.map((key, index) =>
      {
        // caps hours to 24hrs
        if (index >= 24) {
          return null
        }
        else {
          let tempPercent = key.precipProbability * 100;
          let dynamicGridTemplate = '1fr ' + (key.precipProbability * 60) + '%';
          return (
            <li key={key.time} style={{marginBottom: '8px'}}>
              <GraphDiv style={{display: 'grid', gridTemplateRows: dynamicGridTemplate}}>
                <H3f>{tempPercent}%</H3f>
                <div/>
              </GraphDiv>
            </li>
          )
        }
      }
    )
    return dailyForecast;
  }

  // weekly forecast functions
  mapWeeklyForecastTime(weather_data) {
    let weeklyForecast = weather_data.map((key, index) =>
      {
        if (index === 0) {
          return null
        }
        else {
          return (
            <li key={key.time}>
              <H3f>{ dayOfWeek[new Date(new Date(key.time * 1000).toISOString()).getDay()] }</H3f>
            </li>
          )
        }
      }
    )
    return weeklyForecast;
  }

  mapWeeklyForecastDay(weather_data) {
    let weeklyForecast = weather_data.map((key, index) =>
      {
        if (index === 0) {
          return null
        }
        else {
          return (
            <li key={key.time}>
              <LineHR100/>
              <H2f>{ Math.round(key.temperatureLow * 100 / 100 ) }°/{ Math.round(key.temperatureHigh * 100 / 100 ) }°</H2f>
              <LineHR100/>
            </li>
          )
        }
      }
    )
    return weeklyForecast;
  }

  mapWeeklyForecastPrecip(weather_data) {
    let weeklyForecast = weather_data.map((key, index) =>
      {
        let tempPercent = Math.round(key.precipProbability * 1000 / 10);
        let dynamicGridTemplate = '1fr ' + (key.precipProbability * 60) + '%';
        if (index === 0) {
          return null
        }
        else {
          return (
            <li key={key.time} style={{marginBottom: '8px'}}>
              <GraphDiv style={{display: 'grid', gridTemplateRows: dynamicGridTemplate}}>
                <H3f>{tempPercent}%</H3f>
                <div/>
              </GraphDiv>
            </li>
          )
        }
      }
    )
    return weeklyForecast;
  }

  toggle = e => this.setState(state => ({ index: state.index === 5 ? 0 : state.index + 1 }))


  getDLC(value, force) {
    localStorage.setItem(value, 'unlocked')
    if (force !== null) {
      this.forceUpdate();
    }
  }

  showDlcOptions() {
    this.setState({
      dlcView: true,
      bareView: false,
      ExtendedView: false,
      DailyForecast: false,
      WeeklyForecast: false,
      ExtensiveWeather: false,
      ClassyAudio: false,
    })
  }

  hideDlcOptions() {
    this.setState({
      dlcView: false,
    })
    this.checkUserDLC();
  }

  handleRemoveDLC() {
    localStorage.clear();
    this.setState({
      index: 1
    });
  }

  render() {

    const { renderSearchOptions } = this.state;

    // welcome slides (if no local storage data)
    const pages = [
      style => <animated.div key="1" style={{ ...style}}>
          <SlideItem>
            <SerifText>Welcome to Posh Weather. <br/>
            We believe in giving you the best weather experience money can buy</SerifText>
          </SlideItem>
      </animated.div>,
      style => <animated.div key="2" style={{ ...style}}>
          <SlideItem>
            <SerifText>Jolly good to make your acquaintance. <br/>What may your name be?</SerifText>
            <UserInput id="name_of_user" type="text" autocomplete="no_today" required
                onChange={(evt) => { localStorage.setItem('username', evt.target.value);}}
            />
          </SlideItem>
      </animated.div>,
      style => <animated.div key="3" style={{ ...style}}>
          <SlideItem>
              <SerifText>Where are you right now?</SerifText>
              {/* <input id="location" type="text" required
                  onChange={(evt) => {this.forceUpdate(); this.getUserLocation(evt.target.value);}}
              /> */}
              <UserInput id="location" type="text" autocomplete="no_today" required
                  // onChange={(evt) => {this.forceUpdate(); this.getUserLocation(evt.target.value);}}
                  onChange={(evt) => {this.getUserLocation(evt.target.value);}}
              />
              {
                renderSearchOptions.map(key =>
                  <Spring key={key.id}
                    from={{opacity: 0, paddingTop: "-100px"}} to={{opacity: 1, paddingTop: "0px" }}
                  >
                    {styles =>
                      <LocationOptions style={styles} key={key.id}
                        onClick={() => {
                          this.toggle();
                          localStorage.setItem('location_lon', key.geometry.coordinates[0]);
                          localStorage.setItem('location_lat', key.geometry.coordinates[1]);
                          localStorage.setItem('location_name', key.text);
                        }}
                      >{key.text}</LocationOptions>
                    }
                  </Spring>
                )
              }
          </SlideItem>
      </animated.div>,
      style => <animated.div key="4" style={{ ...style}}>
        <SlideItem>
            <SerifText>We hope you enjoy your experience</SerifText>
        </SlideItem>
    </animated.div>
    ];

    if (this.state.loading === true) {
      return <Loading/>
    }

    let welcomeSlider = null;
    let bareView = null;
    let ExtendedView = null;
    let DailyForecast = null;
    let WeeklyForecast = null;
    let ExtensiveWeather = null;
    let ClassyAudio = null;
    let DlcView = null;

    const DlcData = [
      {
        "title": "Extended Current",
        "state_ref": "ExtendedView",
        "cost": "50"
      },
      {
        "title": "Daily Forecast",
        "state_ref": "DailyForecast",
        "cost": "100"
      },
      {
        "title": "Weekly Forecast",
        "state_ref": "WeeklyForecast",
        "cost": "250"
      },
      {
        "title": "Extensive Weather",
        "state_ref": "ExtensiveWeather",
        "cost": "500"
      },
      {
        "title": "Classy Audio",
        "state_ref": "ClassyAudio",
        "cost": "1000"
      },
    ]

    

    if (this.state.dlcView === true) {
      DlcView = (
        <DlcViewContainer>
          <H2f>Weather Expansion Packs</H2f>
          <section>
          {
            DlcData.map((key, index) =>
              {
                let textOpacity = '0.5';
                let buyOrNah = true;
                if (localStorage.getItem(`${key.state_ref}`) === "unlocked") {
                  textOpacity = '1'
                  buyOrNah = false
                }
                return (
                  <div key={index}>
                    <H3f style={{opacity: textOpacity}}>
                      {buyOrNah ? 'Locked' : 'Unlocked'}
                    </H3f>
                    <LineHR/>
                    <H2f style={{opacity: textOpacity}}>{key.title}</H2f>
                    <LineHR/>
                    {buyOrNah ?
                    // <H3f><button value={key.state_ref} onClick={(evt) => this.getDLC(evt.target.value)}>
                    <H3f><DlcButton value={key.state_ref} onClick={(evt) => this.getDLC(evt.target.value, 'force')}>
                      Unlock now for ${key.cost}/month</DlcButton>
                    </H3f>
                    :
                    <H3f>Thank you for your purchase</H3f>}
                  </div>
                )
              }
            )
          }
          <DlcButton onClick={() => this.hideDlcOptions()}>Go back to the Weather</DlcButton>
          </section>
        </DlcViewContainer>
      )
    }

    // Extended View (from base view)
    if (this.state.ExtendedView === true) {
      this.getAllWeatherData();
      ExtendedView = (
        <ExtendedViewContaier>
          <LineHR/>
          <section>
            <div className="side_view_left">
              <H3f>Low</H3f>
              <H2f>{Math.round( this.state.allWeatherData.daily.data[0].temperatureLow * 10 / 10)}°</H2f>
            </div>
            <div className="main_section">
              <div>
                <H3f>Currently</H3f>
                <CurrentWeather>{Math.round( this.state.allWeatherData.currently.temperature * 10 / 10)}°</CurrentWeather>
              </div>
              <div>
                <H3f>Apparent</H3f>
                <H2f>{Math.round( this.state.allWeatherData.currently.apparentTemperature * 10 / 10)}°</H2f>
              </div>
            </div>
            <div className="side_view_right">
              <H3f>High</H3f>
              <H2f>{Math.round( this.state.allWeatherData.daily.data[0].temperatureHigh  * 10 / 10)}°</H2f>
            </div>
          </section>
          <LineHR/>
        </ExtendedViewContaier>
      )
    }

    // Daily Forecast
    if (this.state.DailyForecast === true) {
      DailyForecast = (
        <DailyForecastContainer>
          <H2f>Daily Forecast</H2f>
          <div>
            <section>
              <ul>
                {this.mapDailyForecastTime(this.state.allWeatherData.hourly.data)}
              </ul>
              <ul>
                {this.mapDailyForecastDay(this.state.allWeatherData.hourly.data)}
              </ul>
              <ul>
                {/* map precipProbability */}
                {this.mapDailyForecastPrecip(this.state.allWeatherData.hourly.data)}
              </ul>
            </section>
          </div>
        </DailyForecastContainer>
      )
    }

    // Weekly Forecast
    if (this.state.WeeklyForecast === true) {
      WeeklyForecast = (
        <WeeklyForecastContainer>
          <H2f>Weekly Forecast</H2f>
          <div>
            <section>
              <ul>
                {this.mapWeeklyForecastTime(this.state.allWeatherData.daily.data)}
              </ul>
              <ul>
                {this.mapWeeklyForecastDay(this.state.allWeatherData.daily.data)}
              </ul>
              <ul>
                {this.mapWeeklyForecastPrecip(this.state.allWeatherData.daily.data)}
              </ul>
            </section>
          </div>
        </WeeklyForecastContainer>
      )
    }

    // Extensive Weather
    if (this.state.ExtensiveWeather === true) {
      ExtensiveWeather = (
        <ExtensiveWeatherContainer>
          <H2f>Extensive Weather Data</H2f>
          <LineHR/>
          <section>
            <div>
              <H3f>Wind</H3f>
              {/* convert windBearing to letter bearings e.g. SW, NE */}
              <H5f>{this.degreesToDirection(this.state.allWeatherData.currently.windBearing)} {Math.round( this.state.allWeatherData.currently.windSpeed  * 10 / 10)} km/h</H5f>
            </div>
            <div>
              <H3f>Humidity</H3f>
              <H5f>{Math.round( this.state.allWeatherData.currently.humidity  * 10 / 10)}%</H5f>
            </div>
            <div>
              <H3f>Dew Point</H3f>
              <H5f>{this.state.allWeatherData.currently.dewPoint}°</H5f>
            </div>
            <div>
              <H3f>UV Index</H3f>
              <H5f>{this.state.allWeatherData.currently.uvIndex}</H5f>
            </div>
            <div>
              <H3f>Visibility</H3f>
              <H5f>{this.state.allWeatherData.currently.uvIndex}km</H5f>
            </div>
            <div>
              <H3f>Air Pressure</H3f>
              <H5f>{Math.round( this.state.allWeatherData.currently.pressure  * 10 / 10)}mb</H5f>
            </div>
          </section>
          <LineHR/>
        </ExtensiveWeatherContainer>
      )
    }

    //classy audio
    if (this.state.ClassyAudio === true) {
      ClassyAudio = (
        <ClassyAudioContainer>
          <H2f>Posh Vibes</H2f>
          <LineHR/>
          <div>
            <iframe
              title="spotify embed"
              src="https://open.spotify.com/embed/user/12162909955/playlist/1yeKPPV6xZ0ESc3zc4EVnY"
              width="100%"
              height="350"
              frameBorder="0"
              allowtransparency="true"
              allow="encrypted-media"
            ></iframe>
          </div>
          <LineHR/>
        </ClassyAudioContainer>
      )
    }
    // content if local Storage exists already (username + location)
    if (this.state.index >= 4 && this.state.bareView === true) {
      this.getAllWeatherData();
      bareView = (
        <BareViewContainer style={{color: 'white'}}>
          <LineHR/>
              <div>
                <H3f style={{textAlign: "center"}}>Currently</H3f>
                <CurrentWeather style={{textAlign: "center"}}>{Math.round( this.state.allWeatherData.currently.temperature * 10 / 10)}°</CurrentWeather>
              </div>
          <LineHR/>
        </BareViewContainer>
      )
    }

    // welcome slider
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
              <DlcButton onClick={this.toggle}>Next</DlcButton>
          </WelcomeContainer>
        </WelcomeSliderContainer>
      )
    } else {
      welcomeSlider = null;
    }

    return (
      <AppContainer className="App">
        <Spring delay={1000} from={{opacity: 0, paddingTop: "-100px"}} to={{opacity: 1, paddingTop: "24px" }}>
          {styles =>
            <TopBar style={styles}>
              <p><span onClick={(evt) => this.editUsername(evt.target.value)}>{localStorage.getItem('username')}</span> | <span onClick={() => this.editLocation}>{localStorage.getItem('location_name')}</span></p>
              <p>{this.getTheDate()}</p>
            </TopBar>
          }
        </Spring>
        <Header className="App-header">
          <img src={logo} alt="posh weather logo. Golden P with Posh weather written below."/>
        </Header>
        <MainContentContainer>
          {DlcView}
          {bareView}
          {ExtendedView}
          {welcomeSlider ? null :
            DlcView ? null : 
              <DlcButton onClick={() => this.showDlcOptions()}>Expansion Packs</DlcButton>
          }
          {DailyForecast}
          {WeeklyForecast}
          {ExtensiveWeather}
          {ClassyAudio}
          {welcomeSlider}
        </MainContentContainer>
        <FooterContainer classname="loading-component">
            <ul>
                <li>Built by <a href="https://lukesecomb.digital">Luke Secomb</a></li>
                {/* <li onClick={() => this.removeLocalDLC()}>reset Weather Expansion Data</li> */}
                <li onClick={() => this.handleRemoveDLC()}>reset Weather Expansion Data</li>
                <li>Powered by <a href="https://darksky.net/poweredby/" rel="nofollow noreferrer">Dark Sky</a></li>
            </ul>
        </FooterContainer>
      </AppContainer>
    );
  }
}

export default App;

const UserInput = styled.input`
  color: ${colors.gold};
  background-color: transparent;
  border: 0px solid white;
  border-bottom: 2px solid ${colors.gold};
  font-size: 2.25rem;
  width: 100%;
  &:focus {
    outline-color: -webkit-focus-ring-color;
    outline-style: auto;
    outline-width: 0;  
    border-bottom: 1px solid ${colors.gold};
  }
`

const DlcButton = styled.button`
  cursor: pointer;
  margin: 0 auto 48px auto;
  display: block;
  border: 2px solid ${colors.gold};
  border-radius: 24px;
  padding: 8px 16px;
  background-color: transparent;
  color: ${colors.gold};
  transition: .25s;
  &:hover {
    background-color: ${colors.gold_sub};
    padding: 8px 20px;
    transition: .25s;
  }
  &:focus {
    outline-color: -webkit-focus-ring-color;
    outline-style: auto;
    outline-width: 0;
  }
`
const CurrentWeather = styled.h1`
  font-family: serif;
  font-size: 5rem;
  color: ${colors.white};
  @media (min-width: ${view.tablet}) {
    font-size: 7.5rem;
  }
`
const H2f = styled.h2`
  font-size: 1.75rem;
  font-family: serif;
  color: ${colors.white};
  text-align: center;
  width: 80%;
  margin: 0 auto;
  @media (min-width: ${view.tablet}) {
    font-size: 2.5rem;
  }
`
const H3f = styled.h3`
  font-family: sans-serif;
  color: ${colors.gold};
  text-align: center;
  font-size: 1.25rem;
`
const H5f = styled.h5`
  font-family: serif;
  color: ${colors.white};
  text-align: center;
  font-size: 1.25rem;
`
const SerifText = styled.p`
  font-family: serif;
  color: ${colors.white};
`
const LineHR = styled.hr`
  width: 80%;
  border-color: ${colors.gold};
  @media (min-width: ${view.desktop}) {
    width: 50%;
  }
`
const LineHR100 = styled.hr`
  width: 100%;
  position: sticky;
  border-color: ${colors.gold};
`
const GraphDiv = styled.div`
  width: 75%;
  border-bottom: 2px solid ${colors.gold};
  height: 75px;
  display: grid;
  padding: 0;
  margin: 0 auto;
  p {
    align-self: flex-end;
    text-align: center;
    margin: 0;
    padding: 0;
  }
  div {
    align-self: flex-end;
    width: 90%;
    height: 100%;
    margin: 0 auto;
    background-color: ${colors.gold};
    opacity: .5;
  }
`

const DlcViewContainer = styled.div`
  > h2 {
    margin-bottom: 48px;
  }
  section {
    div {
      margin-bottom: 96px;
      h2 {
        margin: 24px auto;
      }
      h3 {
        position: relative;
        width: 100%;
        input {
          position: absolute;
        }
        button {
          background-color: transparent;
          color: ${colors.gold};
        }
      }

    }
  }
`

const ClassyAudioContainer = styled.div`
  div {
    width: 80%;
    margin: 24px auto;
    @media (min-width: ${view.desktop}) {
      width: 50%;
    }

  }
`

const WeeklyForecastContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  @media (min-width: ${view.desktop}) {
    width: 50%;
  }
  > div {
    overflow-y: scroll;
    ::-webkit-scrollbar {
      height: 5px;
      width: 0;
    }
    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 12px ${colors.darkGrey};
      box-shadow: inset 0 0 12px ${colors.darkGrey};
      background-color: ${colors.darkGrey};
    }
    ::-webkit-scrollbar-thumb {
      background-color: ${colors.gold};
      border: 0 solid ${colors.gold};
    }
    section {
      min-width: 850px;
      display: grid;
      grid-template-columns: 100%;
      ul {
        list-style-type: none;
        padding: 0;
        margin: 24px 0;
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: 1;
        color: ${colors.white};
        li {
          min-width: 150px;
          @media (min-width: ${view.desktop}) {
            min-width: 150px;
          } 
          h3 {
            margin: 0 auto 8px auto;
            align-self: flex-end;
          }
          h2 {
            margin: 24px auto;
          }
        }
      }
    }
  }
`

const DailyForecastContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  @media (min-width: ${view.desktop}) {
    width: 50%;
  }
  > div {
    overflow-y: scroll;
    ::-webkit-scrollbar {
      height: 5px;
      width: 0;
    }
    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 12px ${colors.darkGrey};
      box-shadow: inset 0 0 12px ${colors.darkGrey};
      background-color: ${colors.darkGrey};
    }
    ::-webkit-scrollbar-thumb {
      background-color: ${colors.gold};
      border: 0 solid ${colors.gold};
    }
    section {
      min-width: 1244px;
      display: grid;
      grid-template-columns: 100%;
      ul {
        list-style-type: none;
        padding: 0;
        margin: 24px 0;
        display: grid;
        grid-template-columns: repeat(24, 1fr);
        grid-template-rows: 1;
        color: ${colors.white};
        li {
          min-width: 120px;
          @media (min-width: ${view.desktop}) {
            min-width: 150px;
          }
          h3 {
            margin: 0 auto 8px auto;
            align-self: flex-end;
          }
          h2 {
            margin: 24px auto;
          }
        }
      }
    }
  }
  
`

const ExtensiveWeatherContainer = styled.div`
  section {
    margin: 48px auto;
    div {
      display: grid;
      grid-template-columns: 50% 50%;
      align-content: center;
      margin: 8px auto;
      h3 {
        justify-self: flex-end;
        margin: 0 4px 0 0;
      }
      h5 {
        justify-self: flex-start;
        margin: 0 0 0 4px;
      }
    }
  }
`

const ExtendedViewContaier = styled.div`
  section {
    width: 80%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 25% 50% 25%;
    /* side_view */
    @media (min-width: ${view.desktop}) {
      width: 50%;
    }
    .main_section {
      display: grid;    
      grid-template-rows: 85% 1fr;
      grid-template-columns: 100%;
      > div {
        display: grid;
        text-align: center;
        &:nth-of-type(1) {
          h3 {          
            margin: 48px auto 0 auto;
          }
        }
        &:nth-of-type(2) {
          h3 {          
            margin: 8px auto 0 auto;
          }
        }
        h3 {
          align-self: flex-end;
        }
        h2 {
          align-self: flex-start;
          margin: 8px auto 24px auto;
        }
        h1 {
          align-self: flex-start;
          margin: 8px auto 24px auto;
        }
      }
    }
    .side_view_left, .side_view_right {
      display: grid;
      align-content: center;
      h3 {
        margin: 48px auto 0 auto;
      }
      h2 {
        margin: 8px auto 48px auto;
      }
    }
    .side_view_left {
      justify-content: flex-end;
      margin-right: 8px;

    }
    .side_view_right {
      justify-content: flex-start;
      margin-left: 8px;
    }
  }
`
const BareViewContainer = styled.div`
  div {
    display: grid;
    grid-template-rows: 20% 80%;
    h3 {
      align-self: flex-end;
      margin: 48px auto 0 auto;
    }
    h1 {
      align-self: flex-start;
      margin: 12px auto 48px auto;
    }
  }
`

const TopBar = styled.div`
  /* position: fixed; */
  /* top: 0; */
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: 100%;
  grid-auto-rows: 1fr 1fr;
  padding: 24px 0;
  @media (min-width: ${view.tablet}) {
    grid-template-columns: 50% 50%;
    grid-auto-rows: 1fr;
    width: 100%;
  }

  p {
    text-transform: uppercase;
    color: ${colors.gold};
    font-size: 1rem;
    padding: 1% 5%;
    margin: 0;
    text-align: center;
    @media (min-width: ${view.tablet}) {
      font-size: 1rem;
      padding: 1% 5%;
    }
    &:nth-of-type(1) {
      @media (min-width: ${view.tablet}) {
        text-align: left;
        align-self: flex-start;
      }
    }
    &:nth-of-type(2) {
      @media (min-width: ${view.tablet}) {
        text-align: right;
        align-self: flex-end;
      }
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
  > div {
    margin-bottom: 175px;
  }
`

const Header = styled.header`
  width: 100%;
  height: 10vh;
  padding: 3% 0 10% 0;
  color: ${colors.white};
  display: grid;
  justify-content: center;
  @media (min-width: ${view.tablet}) {
    width: 100%;
    height: 12vh;
    padding: 3% 0 4% 0;
  }
  img {
    display: block;
    width: auto;
    height: 100%;
  }
`

const WelcomeSliderContainer = styled.div`
  width: 90%;
  min-height: 250px;
  /* background-color: green; */
  padding: 125px 5% 10% 5%;
  position: relative;
  display: block;
  @media (min-width: ${view.mobile}) {
    width: 80%;
    min-height: 250px;
    padding: 20% 10% 10% 10%; 
  }
  @media (min-width: ${view.tablet}) {
    width: 70%;
    min-height: 250px;
    padding: 15% 15% 10% 15%; 
  }
  @media (min-width: ${view.desktop}) {
    width: 50%;
    min-height: 250px;
    padding: 10% 25% 10% 25%; 
  }
}
`

const LocationOptions = styled.li`
  list-style-type: none;
  font-size: 2.25rem;
  color: ${colors.gold_sub};
  transition: .5s;
  cursor: pointer;
  &:hover {
    color: ${colors.gold};
    transition: .5s;
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
    @media (min-width: ${view.desktop}) {
      
    }
    div {
        p {
            text-align: left;
            color: ${colors.lightGrey};
            font-size: 2.25rem;
        }
        button {
          position: absolute;
          top: -4%;
          /* right: 20%; */
          width: auto;
          // padding: 0;
          font-size: 1rem;
        }
    }
`

const FooterContainer = styled.footer`
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: ${fonts.sans};
    position: relative;
    bottom: 0;
    left: 0;
    ul {
        list-style-type: none;
        padding: 24px 48px;
        margin: 0;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        /* justify-content: center; */
        opacity: .5;
        transition: .5s;
        &:hover {
            opacity: 1;
            transition: .5s;
        }
        li {
            color: ${colors.white};
            font-size: .75rem;
            &:nth-of-type(2) {
                cursor: pointer;
            }
            a {
                color: ${colors.gold};
                text-decoration: none;
                transition: .5s;
                opacity: 1;
                &:hover {
                    opacity: .5;
                    transition: .5s;
                }
            }
            &:nth-child(1) {
                text-align: left;
            }
            &:nth-child(2) {
                text-align: center;
            }
            &:nth-child(3) {
                text-align: right;
            }
        }
    }
`