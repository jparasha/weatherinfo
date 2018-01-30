import React from 'react';
//import ReactDOM from 'react-dom';
import fetch  from 'node-fetch';
//import Promise from 'es6-promise';
//import './index.css';
/**
* www.devhamsters.com
*/

class WeatherApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        city: undefined,
        country: undefined,
        temperature: undefined,
        humidity: undefined,
        wind: undefined,
        message:undefined
      };
    };
    static defaultProps = {
      city: 'Bangalore',
    };
    _getWeatherInfo = (city) => {
      const main = this;
      let query = null;
      main.setState({
          infoStatus: 'loading'
      });
      if (!city || city === '') {
        query = this.props.city;
      } else {
        query = city;
      }
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=faebc48dd208018631655ea3ee910731`)
      .then( function(response) {
        return response;
      })
      .then( function(response) {
        setTimeout( function() {
          main.setState({
          infoStatus: 'loaded'
        });
        }, 300);
        return response.json();
      })
      .then( function(data) {
        main.setState({
          city: data.name,
          country: data.sys.country,
          temperature: data.main.temp,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          message:data.weather[0].description
        });
      })
      .catch( function() {
        main.setState({
          infoStatus: 'error'
        });
      })
    };
    componentWillMount() {
      this._getWeatherInfo();
    };
    _handleSubmit = (event) => {
      event.preventDefault();
      this._getWeatherInfo(event.target.search.value);
    };
    render() {
      const { 
        city, 
        country,
        temperature, 
        humidity, 
        wind, 
        message,
        infoStatus 
      } = this.state;
      let data = null;
      if (infoStatus === 'loaded') {
        let inp= document.getElementById('input');
          inp.value="";
          inp.blur();
        data = <div className="weatherInfo">
            <div className="cityName">
              <div>{city} <span>({country})</span></div>
            </div>
            <div className="tempInfo">
              <div>Temperature<span>{temperature}º</span></div>
              <div>Sky<span>{message}</span></div>
              <div>Humidity<span>{humidity}%</span></div>
              <div>Wind<span>{wind}m/s</span></div>
            </div>
          </div>
      } else if (infoStatus === 'loading') {
        data = <div className="info loading">Loading weather data...</div>
      } else if (infoStatus === 'error') {
        data = <div className="info error">Error while loading weather data. Try again later.</div>
      }
      return (
        <div className="weatherApp">
          <div className="weatherQuery">
            <form onSubmit={this._handleSubmit}>
              <input 
                type="text" 
                name="search"
                id= "input"
                placeholder="Search a City..."
              />
            </form>
          </div>
          {data}
        </div>
      );
    };
  }
   
  export default WeatherApp;
 // ReactDOM.render(<WeatherApp />, document.getElementById('app'));