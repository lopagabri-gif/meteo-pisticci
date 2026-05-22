export default async function handler(req, res) {

  const apiKey = "badc97819d3b4f3e9c97819d3b6f3eee";
  const stationId = "IBASILIC18";

  try {

    const url =
      `https://api.weather.com/v2/pws/observations/current?stationId=${stationId}&format=json&units=m&apiKey=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json"
      }
    });

    const text = await response.text();

    try {

      const data = JSON.parse(text);

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "no-store");

      return res.status(200).json(data);

    } catch {

      return res.status(500).json({
        error: "API non valida",
        response: text
      });

    }

  } catch (err) {

    return res.status(500).json({
      error: "Errore server",
      details: err.message
    });

  }

}
