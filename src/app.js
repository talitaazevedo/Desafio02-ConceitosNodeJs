const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/* Middleware  sends a message if likes on req.body*/
function likesMiddleware(req,res,next){
  const hasLikes = req.body.likes;
  if(hasLikes){
   
    return res.status(401).json({likes:0});
  
  }
  return next();
}

function logRequests(req,res,next){

  const { method, url} = req;
  const logLabel = `[${method.toUpperCase()}] ${url}`
  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}
app.use(logRequests);
app.use(likesMiddleware);
app.get("/repositories", (request, response) => {
  const {title} = request.query;
  const results = title
    ? repositories.filter(r => r.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0
    
  }
  repositories.push(repository)
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const { title, url, techs} = request.body;
  const repoIndex = repositories.findIndex(r => r.id === id);
  if(repoIndex < 0){
    return response.status(400).send();
  }
  const  repoLikes = repositories[repoIndex].likes;

  
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repoLikes,
    

    
    
  }
  
  repositories[repoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const repoIndex = repositories.findIndex(r => r.id === id);
  if(repoIndex < 0){
    return res.status(400).send();
  }

  repositories.splice(repoIndex,1);

  return res.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const{ id} = request.params;
  const repository = repositories.find(repository => repository.id === id);
  if(!repository){
    return response.status(400).send();
  }


  repository.likes +=1;
  return response.json(repository);
});

module.exports = app;
