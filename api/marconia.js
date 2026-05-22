export default async function handler(req, res) {

  const apiKey = "badc97819d3b4f3e9c97819d3b6f3eee";
  const stationId = "IBASILIC18";

  try {

    const url =
      `https://api.weather.com/v2/pws/observations/current?stationId=${stationId}&format=json&units=m&apiKey=${apiKey}`;

    const response = await fetch(url);

    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-store");

    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({
        error: "La API non ha restituito JSON",
        status: response.status,
        response: text
      });
    }

  } catch (err) {

    return res.status(500).json({
      error: "Errore dati Marconia",
      details: err.message
    });

  }

}
