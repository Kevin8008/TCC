const express = require("express");
const cors = require("cors");
const { request } = require("express");
const app = express();

app.use(cors());
app.use(express.json());
const users = [];
const candidates = [];
const votos = [];

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userId = users.find((userId) => userId.username === username);

  if (userId) {
    return response.status(400).json({ errMsg: "Usuario ja existe!" });
  }

  const usuario = {
    username,
    name,
  };

  users.push(usuario);
  return response.status(201).json(usuario);
});

app.post("/candidates", (request, response) => {
  const { candidateId, imageUrl, partyName, candidateName, partyId } =
    request.body;
  const candidatId = candidates.find(
    (candidatId) => candidatId.candidateId === candidateId
  );

  if (candidatId) {
    return response.status(400).json({ errMsg: "Candidato ja existe!" });
  }

  const candidate = {
    candidateId,
    candidateName,
    partyId,
    partyName,
    imageUrl,
    nome: candidateName,
  };

  candidates.push(candidate);
  console.log(candidates);

  return response.status(201).json(candidate);
});

app.get("/candidates", (request, response) => {
  return response.json(candidates);
});

app.get("/candidates/:id", (request, response) => {
  const { id } = request.params;
  const username = request.headers["x-bolovo-username"];
  const user = users.find((usuario) => usuario.username == username);
  const resposta = candidates.find((candidato) => candidato.candidateId == id);
  if (resposta == null) {
    return response.status(404).json({ errMsg: "Candidato não encontrado!" });
  }
  console.log(resposta);
  console.log("dentro da data" + new Date().toLocaleDateString() + "o usuario" + `${username}` + "Pesquisou um candidato.")
  console.log(user)
  return response.json(resposta);
});

app.post("/votes/:candidateId", (request, response) => {

  const { candidateId } = request.params;
  const  username = request.headers["x-bolovo-username"];
  const { candidateName, partyName } = request.body;
  const candidate = candidates.find(
    (candidate) => candidate.candidateId == candidateId
  );
  console.log(candidate);
  
  if (candidate == null) {

    return response.status(400).json({errMsg:"candidato não foi encontrado!"});

  } else {
    const vote = {
      username: username,
      candidateId: candidate.candidateId,
      partyName: candidate.partyName,
      partyId: candidate.partyId,
    };

    votos.push(vote);
    console.log(votos);
    console.log("dentro da data" + new Date().toLocaleDateString() + "o usuario" + `${username}` + "votou no candidato" + `${candidateName}`)
    contavoto(vote);
    console.log(`${username} seu voto foi confirmado no ${candidateName} do partido ${partyName}`)
    return response.json({Msg:`${username} seu voto foi confirmado no ${candidateName} do partido ${partyName}`});
  }
});

app.get("/votes/:candidateId", (request, response) => {
  const { candidateId } = request.params;
  let vote = { candidateId}
  let contagem = contavoto(vote);
  vote.contagem = contagem;
  
  return response.json(vote);
});

function contavoto(x){
  let contagem = 0;

  for (let c = 0; c < votos.length ; c++) {

    let voto = votos[c];
   if ( voto.candidateId == x.candidateId ){
    contagem++;
   }
  }
  console.log(contagem);
  return contagem
}


app.listen(3333);
