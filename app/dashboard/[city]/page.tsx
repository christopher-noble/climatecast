"use client"

import React from 'react';
import { useEffect, useState } from 'react'
import CurrentWeatherCard from '@/components/cards/current-weather-card'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { currentWeatherAtom, hourlyWeatherAtom, multiDayWeatherAtom, temperatureUnitAtom } from '@/store'
import { useAtom } from 'jotai'
import SevenDayCard from '@/components/cards/seven-day-card'
import { fetchWeatherData } from '@/services/weather-service'
import HourlyCard from '@/components/cards/hourly-card'
import { isFutureHour } from '@/utils/dateTimeFormatter'
import FourteenDayCard from '@/components/cards/fourteen-day-card'
import LoadingSpinner from '@/components/loading-spinner'
import { WeatherApiResponseSuccess, ForecastDay, HourlyWeather } from '@/utils/interfaces/weather'
import NavBar from '@/components/nav-bar'
import { DEFAULT_CITY, ERROR_MESSAGES, FORECAST_START, FOURTEEN_DAY_FORECAST_END, SEVEN_DAY_FORECAST_END, WEATHER_API_SUCCESS_FIELD } from '@/utils/constants'
import { CityProps } from '@/utils/interfaces/page-props'
import '@/styles/dashboard-styles.css';
import { isFullLocation } from '@/utils/helpers';
import Reload from '@/components/buttons/reload-button';
import TemperatureButton from '@/components/buttons/temperature-button';

/**
 * Dashboard page component that displays weather information for a specified city.
 * This component fetches weather data for the default city or the city provided in the URL parameters.
 * It displays the current weather, hourly forecasts for the next 24 hours, and multi-day forecasts
 * for 7 and 14 days. It utilizes several child components to render various weather details,
 * including `CurrentWeatherCard`, `HourlyCard`, `SevenDayCard`, and `FourteenDayCard`.
 *
 * Props:
 * - `params`: An object containing a city property for route parameters.
 */

const Dashboard: React.FC<CityProps> = ({ params }) => {
    const [currentWeather, setCurrentWeather] = useAtom<WeatherApiResponseSuccess | null>(currentWeatherAtom);
    const [hourlyWeather, setHourlyWeather] = useAtom<HourlyWeather[] | null>(hourlyWeatherAtom);
    const [multiDayWeather, setMultiDayWeather] = useAtom<ForecastDay[] | null>(multiDayWeatherAtom);
    const [loadingState, setLoadingState] = useState<boolean>(true);
    const [error, setError] = useState<string | null>('');
    const [temperatureUnit, setTemperatureUnit] = useAtom(temperatureUnitAtom);

    useEffect(() => {
        if (currentWeather === null) {
            const getDefaultData = async (): Promise<void> => {
                const result = await fetchWeatherData(params.city || DEFAULT_CITY);
                if (WEATHER_API_SUCCESS_FIELD in result) {
                    setCurrentWeather(result);
                    setLoadingState(false);

                    // To get the next 24 hours, we get the first 48 hours, which is subject to a conditional statement later
                    const flattenedHours = [
                        ...result?.forecast.forecastday[0].hour,
                        ...result?.forecast.forecastday[1].hour,
                    ];
                    setHourlyWeather(flattenedHours);
                    setMultiDayWeather(result.forecast.forecastday);
                }
                else {
                    setError(ERROR_MESSAGES.INVALID_CITY);
                }
            }
            getDefaultData();
        }
        else {
            setLoadingState(false);
        }
    }, []);

    const getTempByUnit = (cTemp: number, fTemp: number) => {
        if (temperatureUnit === 'F') {
            return fTemp;
        }
        else {
            return cTemp;
        }
    }

    return (
        <>
            <div className="min-h-full">
                <NavBar params={{
                    city: params.city
                }} />
                {loadingState ?
                    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-200 bg-opacity-50 z-50 flex justify-center items-center">
                        <LoadingSpinner />
                        <div className="min-h-dvh"></div>
                    </div>
                    :
                    <>
                        <header className="bg-blue-50 shadow">
                            <div className="flex flex-col sm:flex-row justify-between mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {currentWeather?.location?.name ?
                                    <h1 className="subheading-primary">{isFullLocation(currentWeather.location.name, currentWeather.location.region, currentWeather.location.country)}</h1>
                                    : <LoadingSpinner />
                                }
                                <div className='flex flex-row sm:justify-between space-x-6 sm:space-x-10 mt-5 sm:mt-0 w-full sm:w-auto'>
                                    <TemperatureButton />
                                    <Reload />
                                </div>
                            </div>
                        </header>
                        <main>
                            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                                <div className="w-full min-h-screen bg-gradient-to-t from-white to-blue-100 dark:from-blue-400 dark:to-blue-500 shadow-lg rounded-lg p-4">
                                    <br></br>
                                    {currentWeather ?
                                        <CurrentWeatherCard
                                            date={currentWeather.current.last_updated}
                                            description={currentWeather.current.condition.text}
                                            temperature={getTempByUnit(currentWeather.current.temp_c, currentWeather.current.temp_f)}
                                            iconUrl={currentWeather.current.condition.icon}
                                            feelsLike={currentWeather.current.feelslike_c}
                                            uvIndex={currentWeather.current.uv}
                                            visibility={currentWeather.current.vis_km}
                                            precipitation={currentWeather.current.precip_mm}
                                            humidity={currentWeather.current.humidity}
                                            windDegreee={currentWeather.current.wind_degree}
                                            windDirection={currentWeather.current.wind_dir}
                                            highTemp={getTempByUnit(currentWeather.forecast.forecastday[0].day.maxtemp_c, currentWeather.forecast.forecastday[0].day.maxtemp_f)}
                                            lowTemp={getTempByUnit(currentWeather.forecast.forecastday[0].day.mintemp_c, currentWeather.forecast.forecastday[0].day.mintemp_f)}
                                            sunrise={currentWeather.forecast.forecastday[0].astro.sunrise}
                                            sunset={currentWeather.forecast.forecastday[0].astro.sunset}
                                            tempUnit={temperatureUnit}
                                        >
                                        </CurrentWeatherCard>
                                        :
                                        <LoadingSpinner />
                                    }
                                    <h1 className="label-primary">Hourly</h1>
                                    <ScrollArea className="scroll-area-container">
                                        <div className="scroll-area-primary">
                                            <div className="flex justify-center items-center flex-wrap">
                                                {hourlyWeather ? hourlyWeather.map((element, index) => (
                                                    isFutureHour(element.time.toString()) ?
                                                        <HourlyCard
                                                            key={index}
                                                            hour={element.time.toString()}
                                                            temp={getTempByUnit(element.temp_c, element.temp_f)}
                                                            iconUrl={element.condition.icon}
                                                            description={element.condition.text}
                                                            tempUnit={temperatureUnit}
                                                        /> : ''
                                                ))
                                                    : <LoadingSpinner />
                                                }
                                            </div>
                                        </div>
                                        <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                    <h1 className="label-primary">7 Day Trend</h1>
                                    <ScrollArea className="scroll-area-container">
                                        <div className="scroll-area-primary">
                                            <div className="card-container">
                                                {multiDayWeather ? multiDayWeather.slice(FORECAST_START, SEVEN_DAY_FORECAST_END).map((element, index) => (
                                                    <SevenDayCard
                                                        key={index}
                                                        date={element.date}
                                                        iconUrl={element.day.condition.icon}
                                                        highTemp={getTempByUnit(element.day.maxtemp_c, element.day.maxtemp_f)}
                                                        lowTemp={getTempByUnit(element.day.mintemp_c, element.day.mintemp_f)}
                                                        description={element.day.condition.text}
                                                        tempUnit={temperatureUnit}
                                                    />
                                                ))
                                                    : <LoadingSpinner />
                                                }
                                            </div>
                                        </div>
                                        <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                    <h1 className="label-primary">14 Day Trend</h1>
                                    <ScrollArea className="scroll-area-container">
                                        <div className="scroll-area-primary">
                                            <div className="card-container">
                                                {multiDayWeather ? multiDayWeather.slice(FORECAST_START, FOURTEEN_DAY_FORECAST_END).map((element, index) => (
                                                    <FourteenDayCard
                                                        key={index}
                                                        date={element.date}
                                                        iconUrl={element.day.condition.icon}
                                                        highTemp={getTempByUnit(element.day.maxtemp_c, element.day.maxtemp_f)}
                                                        lowTemp={getTempByUnit(element.day.mintemp_c, element.day.mintemp_f)}
                                                        tempUnit={temperatureUnit}
                                                        description={''} />
                                                ))
                                                    : <LoadingSpinner />
                                                }
                                            </div>
                                        </div>
                                        <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                </div>
                            </div>
                        </main>
                    </>
                }
            </div>
        </>
    )
}

export default Dashboard;