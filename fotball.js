const fetch = require('node-fetch');

const api = "https://api.vglive.no/v1/vg/tournaments/seasons/1442/standings/live";

module.exports = (res, lag) => {
  fetch(api)
  .then(response => response.json())
  .then(data => {
    if (lag) {
      const participant = data.participants.find(team => team.name.toLowerCase().match(lag.toLowerCase()));
      if (!participant) {
        res.json({
          messages: [
            {text: "Fant ikke noen lag med det navnet, prøv igjen..."}
          ]
        });
      }
      const standing = data.standings[0].results.find(standing => standing.participantId === participant.id);
      res.json({
        messages: [
          {text: `${participant.name} er på ${standing.rank}. plass i toppserien med ${standing.points} poeng ⚽`}
        ]
      });
    } else {
      const leaderTeamId = data.standings[0].results[0].participantId;
      const leaderTeam = data.participants.find(team => team.id === leaderTeamId);
      res.json({
        messages: [
          {text: `${leaderTeam.name} leder toppserien! ⚽`}
        ]
      });
    }
  })
  .catch(err => {
    res.json({
      messages: [
        {text: `Noe gikk galt, prøv igjen... ${err.message}`}
      ]
    });
  })
}
