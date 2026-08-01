import React, {useState, useEffect} from "react";
import  '../../assets/styles/ClockWeather.css';

export const WeatherWidget = () => {

    const [weatherData, setWeatherData] = useState({
        temp : 24,
        condition : '맑음',
        icon: '☀️',
        city: '서울'
    });
    useEffect(()=>{},[])

    return (
        <div className = 'weather-widget-container'>
            <div className = 'weather-widget-icon'>{weatherData.icon}</div>
            <div className = 'weather-widget-info'>
                <div className = 'weather-widget-temp'>{weatherData.temp}°C</div>      
                <div className = 'weather-widget-condition'>{weatherData.condition}</div>      
                <div className = 'weather-widget-city'>{weatherData.city}</div>
            </div>
        </div>
    )

}