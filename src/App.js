

// user for testing: https://api.darksky.net/forecast/ API_KEY_HERE /35.2384,149.0838

// re-enable before pushing live 
// import axios from 'axios';

// import { userData } from './config/user-data';
// import { CONFIG_DARK_SKY } from './config/env';

// packages
import React, { Component } from 'react';
import styled from 'styled-components';
// import localStorage from 'node-localstorage';

// components
import Loading from './components/loading';
import Footer from './components/footer';
import WelcomeSlider from './components/welcome-component';
import logo from './images/posh_weather.svg';
import { colors, fonts } from './config/_variables';


// const apiKey = CONFIG_DARK_SKY.API_KEY;
// const darkSkyUrl = "https://api.darksky.net/forecast/";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      username: 'User'
    }
  }

  componentDidMount() {
    // checks local storage if user has entered a name
    if (typeof localStorage === "undefined" || localStorage === null) {
      let LocalStorage = require('node-localstorage').LocalStorage;
      // eslint-disable-next-line
      localStorage = new LocalStorage('./scratch');
    }

    localStorage.setItem('username', 'John');
    console.log(localStorage.getItem('username'));
    this.setState({
      username: localStorage.getItem('username')
    })
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

  render() {

    if (this.state.loading === true) {
      return <Loading/>
    }

    return (
      <AppContainer className="App">
        <TopBar></TopBar>
        <Header className="App-header">
          <img src={logo} alt="posh weather logo. Golden P with Posh weather written below."/>
        </Header>
        <MainContentContainer>
          {/* <button onClick={ () => this.getAllWeatherData()}>Click me for weather</button> */}
          <WelcomeSliderContainer>
            <WelcomeSlider/>
          </WelcomeSliderContainer>
        </MainContentContainer>
        <Footer/>
      </AppContainer>
    );
  }
}

export default App;

const TopBar = styled.div`
  width: 100%;
  height: 25px;
`

const WelcomeSliderContainer = styled.div`
  min-width: 50%;
  max-height: 250px;
  /* background-color: green; */
  padding: 10% 25%;
  position: relative;
  display: block;
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
  display: block;
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