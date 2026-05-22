export default async function handler(req, res) {

  try {

    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=40.35&longitude=16.83&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure"
    );

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.status(200).json({
      observations: [{
        metric: {
          temp: data.current.temperature_2m,
          windSpeed: data.current.wind_speed_10m,
          pressure: data.current.surface_pressure,
          precipTotal: 0
        },
        humidity: data.current.relative_humidity_2m,
        winddir: "--"
      }]
    });

  } catch (err) {

    res.status(500).json({
      error: "Errore dati Marconia",
      details: err.message
    });

  }

}
