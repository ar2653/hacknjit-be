
  

<p  align="center"><img  src="./favicon.png"  width=100  height=100>

<p  align="center">Presented at HACKNJIT @ NJIT 2023</p>

<p  align="center"><img  src="./wave-dynamics.png"  width=100  height=100>

<h1  align="center">Wave Dynamics</h1></p>
  

###


###



<p  align="center">Made with Node js, Express Js, Google Cloud SQL</p>

### Product Brief:

Overview:
Wave Dynamics Backend is a robust and sophisticated web application designed to power realistic ocean wave simulations and visualizations. This backend system utilizes genuine real-world data and offers a comprehensive platform for understanding, predicting, and experiencing oceanic wave behaviors in an immersive digital environment.

## Backend Key Features

1. **Real-time Data Retrieval:** Utilizes the Meteomatics API to provide real-time data of marine metrics, including wave direction, significant wave height, ocean current speed, and wave period.

2. **Efficient Data Storage:** Stores retrieved metrics in a Google Cloud database, minimizing API calls and optimizing data retrieval through an innovative caching mechanism.

3. **Advanced Data Processing:** Performs calculations on the following metrics: 
   - `mean_wave_direction_first_swell:d`
   - `mean_wave_direction_second_swell:d`
   - `mean_wave_direction_third_swell:d`
   - `significant_wave_height_first_swell:m`
   - `significant_wave_height_second_swell:m`
   - `significant_wave_height_third_swell:m`
   - `ocean_current_speed:kn`
   - `mean_wave_period_first_swell:s`
   - `mean_wave_period_second_swell:s`
   - `mean_wave_period_third_swell:s`

4. **Wavelength Calculations:** Measures the wavelength of waves, providing crucial information for understanding wave behaviors and predicting wave patterns.

5. **Direction of Waves:** Offers insights into the direction of waves, allowing users to comprehend wave patterns and their impact on various applications.

6. **Wave Height Analysis:** Calculates and provides data on wave height, a critical parameter for assessing the suitability of marine operations and coastal activities.

7. **Customizable Data Exploration:** Empowers users to interact with and manipulate wave parameters, fostering a deeper understanding of ocean wave dynamics and coastal processes.

8. **Scalable and Reliable Infrastructure:** Utilizes Google Cloud services to ensure a scalable and reliable backend infrastructure, suitable for handling extensive data and user requests.

9. **Support for Research and Education:** Provides a valuable resource for students, researchers, and educators to study marine ecosystems, coastal processes, and wave dynamics in a visually engaging and interactive environment.

10. **Environmental and Safety Insights:** Supports the assessment of risks for maritime activities, coastal infrastructure, and natural disasters, contributing to preparedness and safety measures.

11. **Innovation and Development:** Facilitates the testing and development of new technologies and infrastructure for coastal regions and marine operations, promoting engineering and innovation.

12. **Public Awareness:** Promotes ocean science awareness, fostering public engagement and understanding of marine-related issues and their impact on our environment.

#### Calculations

Metrics used for Latitude and Longitude rounding

| Decimal places | Decimal degrees | Distance (meters) | Notes      |
|----------------|-----------------|-------------------|------------|
| 0              | 1.0             | 110,574.3         | 111 km     |
| 1              | 0.1             | 11,057.43         | 11 km      |
| 2              | 0.01            | 1,105.74          | 1 km       |
| 3              | 0.001           | 110.57            |            |
| 4              | 0.0001          | 11.06            |            |
| 5              | 0.00001         | 1.11             |            |
| 6              | 0.000001        | 0.11             | 11 cm      |
| 7              | 0.0000001       | 0.01             | 1 cm       |
| 8              | 0.00000001      | 0.001            | 1 mm       |

Marine Metrics used

1. **mean_wave_direction_first_swell:d**
   - Spectral mean wave direction computed using the first-most energetic partition of the swell spectrum. The swell spectrum is obtained by only considering the components of the two-dimensional wave spectrum that are not under the influence of the local wind.

2. **mean_wave_direction_second_swell:d**
   - Spectral mean wave direction computed using the second-most energetic partition of the swell spectrum. The swell spectrum is obtained by only considering the components of the two-dimensional wave spectrum that are not under the influence of the local wind.

3. **mean_wave_direction_third_swell:d**
   - Spectral mean wave direction computed using the third-most energetic partition of the swell spectrum. The swell spectrum is obtained by only considering the components of the two-dimensional wave spectrum that are not under the influence of the local wind.

4. **significant_wave_height_first_swell:m**
   - Significant wave height for the first most energetic partition of the swell spectrum, where the significant wave height is defined as 4 times the square root of the integral over all directions and all frequencies of the first partition of the swell spectrum. The swell spectrum is obtained by only considering the components of the two-dimensional wave spectrum that are not under the influence of the local wind.

5. **significant_wave_height_second_swell:m**
   - Significant wave height for the second most energetic partition of the swell spectrum, where the significant wave height is defined as 4 times the square root of the integral over all directions and all frequencies of the second partition of the swell spectrum. The swell spectrum is obtained by only considering the components of the two-dimensional wave spectrum that are not under the influence of the local wind.

6. **significant_wave_height_third_swell:m**
   - Significant wave height for the third most energetic partition of the swell spectrum, where the significant wave height is defined as 4 times the square root of the integral over all directions and all frequencies of the third partition of the swell spectrum. The swell spectrum is obtained by only considering the components of the two-dimensional wave spectrum that are not under the influence of the local wind.

7. **ocean_current_speed:kn**
   - These parameters describe the velocity of the surface ocean currents in knots.

8. **mean_wave_period_first_swell:s**
   - Spectral mean wave period obtained using the first integral moment of the total swell frequency spectrum. The integration is performed over all theoretical frequencies up to infinity. The total swell frequency spectrum is obtained by integrating the two-dimensional wave spectrum over all directions for all wave components that are no longer under the influence of the local wind (full spectrum without wind sea).

9. **mean_wave_period_second_swell:s**
   - Spectral mean wave period obtained using the second integral moment of the total swell frequency spectrum. The integration is performed over all theoretical frequencies up to infinity. The total swell frequency spectrum is obtained by integrating the two-dimensional wave spectrum over all directions for all wave components that are not under the influence of the local wind (full spectrum without wind sea).

10. **mean_wave_period_third_swell:s**
    - Mean wave period computed using the reciprocal frequency moment of the third most energetic partition of the swell spectrum. The swell spectrum is obtained by only considering the components of the two-dimensional wave spectrum that are not under the influence of the local wind (full spectrum without wind sea).


### Wavelength Calculations

You can calculate the wavelength of a wave using the formula:

`Wavelength (λ) = Wave Speed (v) / Frequency (f)`

Where:

- Wavelength (λ) is the distance between two consecutive wave crests (in meters).
- Wave Speed (v) is the speed at which the wave travels (in meters per second).
- Frequency (f) is the number of waves passing a fixed point in one second (in Hertz).

If you are given the significant wave height (Hs) and the wave period (T), you can calculate the wave speed (v) using the formula:

`Wave Speed (v) = 1.56 * (Hs / T)^0.5`

Where:

- Significant Wave Height (Hs) is the height of the wave from the trough to the crest (in meters).
- Wave Period (T) is the time it takes for one complete wave cycle to pass a fixed point (in seconds).

Once you have the wave speed and the frequency, you can use the formula to calculate the wavelength (λ).

##### Target Audience:

- Researchers and oceanographers
- Educational institutions (students and educators)
- Environmental and coastal planners
- Maritime and offshore industry professionals
- Engineering and technology development sectors
- General public interested in oceanic sciences and recreation

##### Future Developments:

Wave Dynamics Backend is poised for growth and improvement.

Potential future developments may include:
1. **Historical Data Integration:** Incorporate historical data of marine metrics to enable trend analysis, long-term forecasting, and deeper insights into oceanic patterns.

2. **Machine Learning and Predictive Analytics:** Implement machine learning models and predictive analytics to enhance the accuracy of wave behavior predictions and support data-driven decision-making in various marine-related fields.

3. **User Customization:** Enhance user experiences by allowing customization of the simulation environment, enabling users to tailor their simulations to specific research or educational needs.

4. **Additional Data Sources:** Expand data sources beyond Meteomatics API to provide a more comprehensive and diverse dataset for marine and coastal research.

5. **Mobile Application Integration:** Develop mobile applications to extend access to real-time and simulated ocean data, catering to a wider audience, including maritime professionals, coastal planners, and enthusiasts.

### Tech Stack:
- Front End - Web GL based library - Three js, Vue js + vite
- Back End - Node js, Express js
- Database - Google Cloud SQL Storage
- Cloud - Google Cloud Platform

### Checkout the Front-end code:
Front End - https://github.com/tabrezdn1/hacknjit-fe#readme

### Meet the Team:
- Ankush Ranapure <p><img  src="./ar.jpeg"  width=50  height=50><br> <a href="https://www.linkedin.com/in/ankush-ranapure/">LinkedIn </a><br> <a href="https://github.com/ar2653">Github</a>
- Shaik Tabrez <p><img  src="./st.jpeg"  width=50  height=50><br><a href="https://www.linkedin.com/in/shaik-tabrez/">LinkedIn </a> <br> <a href="https://github.com/tabrezdn1">Github</a>


### Roadmap to Development:
#### Phase 1 - Plan the app and setup the codebase

- Phase 1.1 - Node Js + Express JS code initialization.

- Phase 1.2 - Research on real-time Weather API.

- Phase 1.3 - Research around how to perform calculations.

#### Phase 2 - Implement the code functionality of simulation

- Phase 2.1 - Implement APIs using node and express.

- Phase 2.2 - Perform calculations based on research.

- Phase 2.3 - Implementation of robust error handling.

- Phase 2.4 - Create instances on Google Cloud, and a SQL database on Google cloud.

- Phase 2.5 - Efficient usage of Google Cloud SQL storage by caching the response from API.

#### Phase 3 - Plan the landing and form page

- Phase 3.1 - APIs testing with different metrics and inputs

- Phase 3.2 - Code cleanup and refactor.

### How does the app works?

- Run the app on your local machine and start the server
- Test the APIs using POSTMAN or any REST Client

### How to install

- Clone repository to your local machine

- Open terminal and cd into repository folder

- `command: npm install`

- `command: npm run dev`

### API Used:

`https://www.meteomatics.com/`