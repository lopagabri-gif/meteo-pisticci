export default async function handler(req, res) {

  const apiKey = "badc97819d3b4f3e9c97819d3b6f3eee";
  const stationId = "IBASILIC18";

  try {

    const response = await fetch(
      `https://api.weather.com/v2/pws/observations/current?stationId=${stationId}&format=json&units=m&apiKey=${apiKey}`
    );

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.status(200).json(data);

  } catch (err) {

    res.status(500).json({
      error: "Errore dati Marconia",
      details: err.message
    });

  }

}
