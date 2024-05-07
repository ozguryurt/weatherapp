import { useEffect, useState } from 'react';
import './App.css'

import { FiWind } from "react-icons/fi";
import { CiTempHigh } from "react-icons/ci";
import { WiHumidity } from "react-icons/wi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

function App() {

  const [theme, setTheme] = useState(null)
  const [cityName, setCityName] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [weatherForecast, setWeatherForecast] = useState(null)

  useEffect(() => {
    const userTheme = localStorage.theme;
    console.log(userTheme)

    if (userTheme !== undefined) {
      if (userTheme === "light") {
        document.documentElement.classList.remove("dark")
        localStorage.theme = "light"
        setTheme("light")
      } else if (userTheme === "dark") {
        document.documentElement.classList.add("dark")
        localStorage.theme = "dark"
        setTheme("dark")
      }
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark")
        localStorage.theme = "dark"
        setTheme("dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.theme = "light"
        setTheme("light")
      }
    }
  }, [])

  const handleTheme = () => {
    const userTheme = localStorage.theme || null;

    if (userTheme === "light") {
      document.documentElement.classList.add("dark")
      localStorage.theme = "dark"
      setTheme("dark")
    } else if (userTheme === "dark") {
      document.documentElement.classList.remove("dark")
      localStorage.theme = "light"
      setTheme('light')
    }
  }

  const handleSearch = async () => {
    const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${import.meta.env.VITE_APIKEY}`)
    const currentData = await currentRes.json()
    setCurrentWeather(currentData)

    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${import.meta.env.VITE_APIKEY}`)
    const forecastData = await forecastRes.json()

    var newForecastData = { ...forecastData }
    // Group by Date
    if (forecastData.cod !== "404") {
      newForecastData.list = []
      let groupedByDate = []
      let tempDate = forecastData.list[0].dt_txt.split(" ")[0]
      forecastData.list.forEach(item => {
        if (item.dt_txt.split(" ")[0] == tempDate) {
          groupedByDate.push(item)
        } else {
          newForecastData.list.push([tempDate, ...groupedByDate])
          tempDate = item.dt_txt.split(" ")[0]
          groupedByDate = []
          groupedByDate.push(item)
        }
      });
    }
    setWeatherForecast(newForecastData)
  }

  return (
    <>
      <div className="container mx-auto p-5 dark:bg-zinc-800 bg-slate-50 flex flex-col gap-y-3 justify-center items-center">
        <button className='button-main' onClick={handleTheme}>
          {
            theme === "dark" ?
              <MdOutlineLightMode size={25} />
              :
              <MdOutlineDarkMode size={25} />
          }
        </button>
        <input type="text" placeholder='City name' className='input-main lg:w-6/12 w-full' onChange={(e) => setCityName(e.target.value)} />
        <button className='button-main lg:w-6/12 w-full' onClick={handleSearch}>Search</button>
      </div>
      {
        currentWeather !== null && currentWeather?.cod === 200 &&
        <div className="container mx-auto p-5 flex justify-center items-center">
          <div className="lg:w-6/12 w-full flex flex-col dark:bg-zinc-700 bg-slate-200 rounded py-5">
            <div className='flex flex-col justify-center items-center'>
              <p className="text-center lg:text-3xl text-xl font-bold">{currentWeather?.name?.toUpperCase()}</p>
              <p className="text-center lg:text-lg text-sm font-normal">Now</p>
            </div>
            <div className="grid grid-cols-2">
              <div className='flex justify-center items-center'>
                <img src={`http://openweathermap.org/img/w/${currentWeather?.weather[0]?.icon}.png`} alt="" className='w-36 h-36' />
              </div>
              <div className="flex justify-center items-center">
                <table>
                  <thead>
                    <tr></tr>
                    <tr></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><IoIosInformationCircleOutline size={25} /></td>
                      <td>{currentWeather?.weather[0].description[0].toUpperCase() + currentWeather?.weather[0].description.slice(1).toLowerCase()}</td>
                    </tr>
                    <tr>
                      <td><FiWind size={25} /></td>
                      <td>{currentWeather?.wind?.speed} m/s wind</td>
                    </tr>
                    <tr>
                      <td><CiTempHigh size={25} /></td>
                      <td>{currentWeather?.main?.temp} °C</td>
                    </tr>
                    <tr>
                      <td><WiHumidity size={25} /></td>
                      <td>{currentWeather?.main?.humidity}% humidity</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
      {
        weatherForecast !== null && weatherForecast?.cod === "200" &&
        <div className='container mx-auto p-5 flex flex-col justify-center items-center'>
          {
            weatherForecast?.list?.map((dates, dateIndex) => (
              <div className='flex flex-col gap-y-3 lg:w-6/12 w-full mb-24' key={dateIndex}>
                <p className='text-center lg:text-lg text-sm font-bold'>
                  {new Date(dates[0]).toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
                {
                  dates.slice(1).map((forecast, forecastIndex) => (
                    <div key={forecastIndex} className="flex flex-col dark:bg-zinc-700 bg-slate-200 rounded py-5">
                      <div className='flex flex-col justify-center items-center'>
                        <p className="text-center lg:text-lg text-sm font-normal">{forecast?.dt_txt.split(" ")[1]}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className='flex justify-center items-center'>
                          <img src={`http://openweathermap.org/img/w/${forecast?.weather[0]?.icon}.png`} alt="" className='w-36 h-36' />
                        </div>
                        <div className="flex justify-center items-center">
                          <table>
                            <thead>
                              <tr></tr>
                              <tr></tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td><IoIosInformationCircleOutline size={25} /></td>
                                <td>{forecast?.weather[0].description[0].toUpperCase() + forecast?.weather[0].description.slice(1).toLowerCase()}</td>
                              </tr>
                              <tr>
                                <td><FiWind size={25} /></td>
                                <td>{forecast?.wind?.speed} m/s wind</td>
                              </tr>
                              <tr>
                                <td><CiTempHigh size={25} /></td>
                                <td>{forecast?.main?.temp} °C</td>
                              </tr>
                              <tr>
                                <td><WiHumidity size={25} /></td>
                                <td>{forecast?.main?.humidity}% humidity</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      }
      {
        currentWeather?.cod === "404" && weatherForecast?.cod === "404" &&
        <div className='container mx-auto p-5 flex justify-center items-center gap-y-5'>
          <div className='lg:w-6/12 w-full flex flex-col dark:bg-zinc-700 bg-slate-200 rounded py-5'>
            <p className="text-center lg:text-3xl text-xl font-bold">
              City not found.
            </p>
          </div>
        </div>
      }
    </>
  )
}

export default App
