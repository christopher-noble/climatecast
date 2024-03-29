# ClimateCast

ClimateCast is a responsive, user-friendly weather dashboard application that provides real-time weather information for cities around the globe. Built with Next.js, React, TypeScript, and Tailwind UI components, it features an elegant design with intuitive navigation. The application integrates WeatherAPI.com for weather data, supporting both Celsius and Fahrenheit units, and includes features like autocomplete search and error handling for invalid inputs. Try it in production! [climatecast.vercel.app](https://climatecast.vercel.app/)

## Features

- **Weather Data from WeatherAPI.com:** Fetches real-time weather information for most known cities worldwide.
- **Temperature Unit Conversion:** Supports displaying temperature in both Celsius and Fahrenheit.
- **Autocomplete Search:** Provides suggestions as you type, for an efficient search experience.
- **Error Handling:** Gracefully handles invalid inputs with user-friendly error messages.
- **Responsive Design:** Built with Tailwind UI components for a mobile-responsive layout.
- **Iconography:** Uses weather icons from WeatherAPI.com and FontAwesome for enhanced UI.
- **Comprehensive Testing:** Includes Jest for unit testing and Cypress for end-to-end testing.
- **Automatic Data Caching:** Leveraging Next.js's built-in data caching, ClimateCast automatically caches the returned values of fetch in the Data Cache on the server.

## Tech Stack

This application is built with the following technologies:

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Jest**
- **Cypress**

## Testing

ClimateCast includes comprehensive automated testing to ensure application reliability and stability:

- **Unit Testing with Jest:** Ensures individual components and functions work as expected.
- **End-to-End Testing with Cypress:** Simulates user interactions to test the application as a whole.

### Running Tests

- **Unit Tests with Jest:**

```
npm test
```

- **End-to-End Tests with Cypress:**
- To run tests headlessly:

  ```
  npx cypress run
  ```

- To open the Cypress Test Runner for interactive testing:

  ```
  npx cypress open
  ```

## Getting Started

Follow these instructions to get ClimateCast up and running on your local machine for development and testing.

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
 `git clone https://github.com/christopher-noble/ClimateCast`

2. Navigate to the project directory:
 `cd ClimateCast`

3. Install dependencies:
 `npm install`

4. Load the `.env.local` file sent via email into the root directory of the app. This file contains essential environment variables required for WeatherAPI.com.

### Running the Application

1. Start the development server:
 `npm run dev`

2. Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

## License

Distributed under the MIT License. See `LICENSE` for more information.
