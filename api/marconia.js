export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=40.32&longitude=16.67&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,precipitation&timezone=Europe/Rome"
    );

    if (!response.ok) {
      throw new Error("Open-Meteo HTTP " + response.status);
    }

    const text = await response.text();
    const data = JSON.parse(text);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-store");

    res.status(200).json({
      observations: [{
        metric: {
          temp: data.current.temperature_2m,
          windSpeed: data.current.wind_speed_10m,
          pressure: data.current.surface_pressure,
          precipTotal: data.current.precipitation ?? 0
        },
        humidity: data.current.relative_humidity_2m,
        winddir: Math.round(data.current.wind_direction_10m),
        solarRadiation: 500
      }]
    });

  } catch (err) {
    res.status(500).json({
      error: "Errore dati Marconia",
      details: err.message
    });
  }
}
