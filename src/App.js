import clear from "./weather-icons-master/design/fill/animation-ready/clear-day.svg";
import cloudy from "./weather-icons-master/design/fill/animation-ready/cloudy.svg";
import snow from "./weather-icons-master/design/fill/animation-ready/snow.svg"
import rain from "./weather-icons-master/design/fill/animation-ready/rain.svg"
import thunderstorms from "./weather-icons-master/design/fill/animation-ready/thunderstorms.svg";
import mist from "./weather-icons-master/design/fill/animation-ready/mist.svg";
import drizzle from "./weather-icons-master/design/fill/animation-ready/drizzle.svg";
import  fog from "./weather-icons-master/design/fill/animation-ready/fog.svg";
import dust from "./weather-icons-master/design/fill/animation-ready/dust.svg";
import haze from "./weather-icons-master/design/fill/animation-ready/haze.svg";
import smoke from "./weather-icons-master/design/fill/animation-ready/smoke.svg";
import tornado from "./weather-icons-master/design/fill/animation-ready/tornado.svg";


import './App.css';
import React,{useState,useEffect,useCallback} from 'react';
import axios from "axios";
import {MdGpsFixed,MdOutlineLocationOn} from 'react-icons/md';
var d2d=require('degrees-to-direction');


function App() {
  const months = ["January", "February", "March", "April", "May", 
  "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const day=new Date().getDay();
  const dates=new Date().getDate();
  const mon=new Date().getMonth();
  const [lat, setLat]=useState();
  const [lon, setLon]=useState();
  const [city, setCity]=useState("");
  const [location,setLocation]=useState("");
  const [cityList, setCityList]=useState([]);
  const [temp,setTemp]=useState();
  const [weather,setWeather]=useState("");
  const [date,setDate]=useState(`${days[day]}, ${dates} ${months[mon]}`);
  const [wind,setWind]=useState("");
  const [humidity,setHumidity]=useState("");
  const [visibility,setVisibility]=useState("");
  const [airpressure,setAirPressure]=useState("");
  const [cloud,setCloud]=useState("");
  const [sideBar,setSideBar]=useState(false);
  const [changeTemp,setChangeTemp]=useState(true);
  const [forecast,setForecast]=useState([]);
  const [deg,setDeg] =useState("");

  const API_KEY = "8512e4e71399125c9d9590a288018dc1";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const url2 = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;
  const url3=`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
  const url4=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`

  const getLocation = async()=>{
      if(city.length!==0){
        await axios.get(url2).then((response) => {
          setCityList(response.data);
          // setCityList(response.data)
        }).catch((err) => {
          console.log(err);
        })
      }
  }
  const getWeather=async()=>{
    await axios.get(url).then((response)=>{
      // console.log(response.data.wind);
      setTemp(response.data.main.temp);
      setHumidity(response.data.main.humidity);
      setVisibility(response.data.visibility+"%");
      setWind(response.data.wind.speed);
      setDeg(response.data.wind.deg);
      setAirPressure(response.data.main.pressure);
      setCloud(response.data.clouds.all+"%");
      setWeather(response.data.weather[0].main);
    }).catch((err)=>{
      console.log("err");
    })
  }
  const updateLocation=async()=>{
    await axios.get(url3).then((response)=>{
      // console.log(response.data[0].name);
      setLocation(response.data[0].name+", "+response.data[0].state+", "+response.data[0].country);
    })
    .catch((err)=>{
      console.log("err gps");
    })
  }
  const getGPSLocation=()=>{
    navigator.geolocation.getCurrentPosition(function(position) {
      // console.log(position);
      let lati=position.coords.latitude;
      let longi=position.coords.longitude;
      updateLocation();
      setSideBar(false)
      setLat(lati);
      setLon(longi);
      
    });
    // console.log("hello");  
  }

  const getForecast=async()=>{
    await axios.get(url4).then((response)=>{
      // console.log(response.data.list);
      const map=new Map();
      response.data.list.map((user,i)=>{
        const arr=response.data.list[i].dt_txt.split(" ");
        // console.log(arr.length);
        map.set(arr[0],{idx:i,
          temp:response.data.list[i].main.temp,
          temp_min:response.data.list[i].main.temp_min,
          temp_max:response.data.list[i].main.temp_max,
          weather:response.data.list[i].weather[0].main,
        })
        const array=[]
        map.forEach(function(val, key) {
          array.push({ date: key, temp_min: val.temp_min, temp_max:val.temp_max ,weather:val.weather, temp:val.temp});
        });
        if(array.length>5){
          array.shift();
        }
        setForecast(array);
      });

    })
    .catch((err)=>{
      console.log('forecast err');
    })
  }
  const getlatlon=(lat,lon,name,state,country)=>{
    // console.log(lat,lon);
    setLat(lat);
    setLon(lon);
    setLocation(name+", "+state+", "+country);
    setCity(name+", "+state+", "+country);
    setSideBar(false)

  }
  const getChangeTemp=(temperature)=>{
    console.log(temperature);
    console.log((temperature-273.15).toFixed(1)+" Celsius");
    return changeTemp?
    (temperature-273.15).toFixed(1)
    :
    (((temperature-273.15)*1.8)+32).toFixed(1)
  }

  const getImg=(weatherer)=>{
    console.log("clear")
    if(weatherer==="Clear"){
      return clear
    }
    if(weatherer==="Clouds"){
      // console.log(weatherer)
      return cloudy
    }
    
    if(weatherer==="Snow"){
      // console.log(weatherer)
      return snow
    }
    if(weatherer==="Rain"){
      // console.log(weatherer)
      return rain
    }
    if(weatherer==="Drizzle"){
      // console.log(weatherer)
      return drizzle
    }
    if(weatherer==="Thunderstorm"){
      // console.log(weatherer)
      return thunderstorms
    }
    if(weatherer==="Mist"){
      // console.log(weatherer)
      return mist
    }
    if(weatherer==="Smoke"){
      // console.log(weatherer)
      return smoke
    }
    if(weatherer==="Haze"){
      // console.log(weatherer)
      return haze
    }
    if(weatherer==="Dust"){
      // console.log(weatherer)
      return dust
    }
    if(weatherer==="Fog"){
      // console.log(weatherer)
      return fog
    }
    if(weatherer==="Sand"){
      // console.log(weatherer)
      return mist
    }
    if(weatherer==="Ash"){
      // console.log(weatherer)
      return mist
    }
    if(weatherer==="Squall"){
      // console.log(weatherer)
      return mist
    }
    if(weatherer==="Tornado"){
      // console.log(weatherer)
      return tornado
    }
  }
  useEffect(() => {
    getLocation();
    // console.log("location");
    return () => {
    }
  },[city])
  useEffect(() => {
    getWeather();
    // console.log("weather");
    return ()=>{
    }
  }, [lat,lon,location])
  useEffect(()=>{
    getForecast();
    return()=>{
    }
  },[lat,lon,location])
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(function(position) {
      // console.log(position);
      setSideBar(false)
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
      updateLocation();
    });
  },[])
  
  
  return (
    <div className='main_page'>
        <article className='first_Half'>
          {
            !sideBar?
            <div className='sidebar'>
              <header className='first_half_before'>
              <button onClick={()=>setSideBar(true)} className="btn">Search For Places</button>
              <button onClick={()=>getGPSLocation()} className="btn"  style={{width:"3rem",height:"3rem",fontSize:"x-large",borderRadius:"50%"}}><MdGpsFixed style={{marginTop:"4px", marginRight:"-2px"}}/></button>
              </header>
              <div className='img'>
                <img src={getImg(weather)} alt={weather} ></img>
                {/* <img src={getImg(weather)}></img> */}
                </div>
              <div className='sidebar_temp'><p >{temp!==undefined?<span>{getChangeTemp(temp)}</span>:null}{temp!==undefined?<span>{changeTemp?`℃`:`℉`}</span>:null}</p></div>
              
              <div className='sidebar_weather'><p>{weather}</p></div>
              <footer className='sidebar_footer'>
                <p>
                  <span>Today . </span>
                  <span> {date}</span>
                </p>
                
                <p>{location.length===0?null:<><MdOutlineLocationOn/>{location}</>}</p>
              </footer>
            </div>
            :
            <header className='first_half_after'>
              <input type="search"  onChange={(e) => {setCity(e.target.value)}} placeholder="search location"  value={city} className="input"></input>              
            
            <div>
              {cityList.length!==0?
                  cityList.map((user,i)=>{
                    return <div className="list" onClick={()=>getlatlon(cityList[i].lat,cityList[i].lon,cityList[i].name,cityList[i].state,cityList[i].country)} key={cityList[i].id}>{`${cityList[i].name}, ${cityList[i].state}, ${cityList[i].country}`}</div>
                  })
                  :null
                }
            </div>
            </header>
          }
        </article>

        <div className='second_Half'>
          <div className='second_Half_header'>
            <button onClick={()=>setChangeTemp(true)} style={{color:"#110E3C",fontweight:"bold", background:"#E7E7EB"}}>{`℃`}</button>
            <button onClick={()=>setChangeTemp(false)} style={{color:"#E7E7EB"}}>{`℉`}</button>
          </div>
          <div className='forecast'>
            {
              forecast.length===0?<h3>Please Select Location</h3>:
              forecast.map((user,i)=>{
                return <div >
                  <p>{days[new Date(forecast[i].date).getDay()]}, {new Date(forecast[i].date).getDate()} {months[new Date(forecast[i].date).getMonth()]}</p>
                  <img src={getImg(forecast[i].weather)} title={forecast[i].weather} alt={forecast[i].weather} /> 
                  <p style={{fontSize:"1rem"}}>
                    <span >{getChangeTemp(forecast[i].temp_max)}{changeTemp?`℃`:`℉`} </span> 
                    <span style={{color:"#A09FB1"}}> {getChangeTemp(forecast[i].temp_min)}{changeTemp?`℃`:`℉`} </span>  
                  </p>
                </div>
              })
            }
          </div>
          <div className='highlights'>
            <h2> Today's Highlights </h2>
          </div> 
          <div className='highlights_div'>
            <div>
              <p className='high_head'> Wind Status </p> 
              <p className='high_val'> {wind.length!==0?wind+" mph":null} </p>
              <div>{deg.length===0?null:d2d(deg)}</div>
            </div>
            <div>
              <p className='high_head'>Humidity</p>
              <p className='high_val'>{humidity.length!==0?humidity+" %":null}</p>
              <div className='progress_bar' style={{  width: "100%",background: "#E7E7EB",borderRadius: "80px"}}>
                <div style={{width: humidity+"%",background: "#FFEC65",borderRadius: "80px",color: "blue"}}>
                {humidity.length!==0?humidity+" %":null}
                </div>
              </div>
            </div>
            <div>
              <p className='high_head'>Air Pressure</p>
              <p className='high_val'>{airpressure.length!==0?airpressure+" mb":null}</p>
            </div>
            <div>
              <p className='high_head'>Visibility</p>
              <p className='high_val'>{visibility.length!==0?parseInt(visibility)/1000+" km":null}</p>
            </div>
          </div>
        </div>
        
    </div>
  );
}

export default App; 