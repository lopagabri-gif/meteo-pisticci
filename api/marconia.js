export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const apiKey = "badc97819d3b4f3e9c97819d3b6f3eee";
    const stationId = "IBASILIC18";

    const url =
      "https://api.weather.com/v2/pws/observations/current?stationId=" +
      stationId +
      "&format=json&units=m&apiKey=" +
      apiKey;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "Errore dati Marconia",
      details: error.message
    });
  }
}
