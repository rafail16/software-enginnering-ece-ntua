# Backend
## Setup
### Postgres.db  
We use a postgres database with the following credentials :  
  Username:postgres     
  Password:password  
  Port:5433  
  database:saasdb50
  host:'localhost'    
 
 You need to create this database before running the project's components  
 
 ### Nest.js Project (Datalayer)
 A nest.js project is used in conjuction with TypeORM for the datalayer implementation. Nest project runs on Port 3000.  
 Full description/implementation can be found under the folder /datalayer
 
 ### Express Project (QAManager)
 This Express project implements a part of our whole project's business logic.It runs on port 5000 and it's connected   
 via http with datalayer service to implement CRUD operations on the database. Full description/implementation can be found  
 under the folder /QAManager
 
 ### Express Project (Analytics)
 This Express project implements a part of our whole project's business logic. It runs on port 4000 and it's connected via http  
 with the datalayer service. This service doesn't interact with the QAManager service. They can be run independently. This service  
 only requires the datalayer service.Full description/implementation can be found  under the folder /Analytics
 
 ### Express Project (Authenticator)
 This project implements the authentication service of our project. It issues JWT tokens and verifies users existing in our database.
 It interacts with the datalayer service and currently acts as a main router of our applications (Haven't integrated ESB yet). This service  
 interacts with all the services described above. Full description/implementation can be found under the folder /Authenticator
 
### Run backend (After the setup of Postgres.db)
1. Open a terminal ,go to /datalayer and execute ```npm run start```  *PORT : 3000*
2. Open a terminal ,go to /QAManager and execute ```npm run start```  *PORT : 5000*
3. Open a terminal ,go to /Analytics and execute ```npm run start``` *PORT : 4000*
4. Open a terminal ,go to /Authenticator and execute ```npm run start``` *PORT : 8000*
5. Open a terminal ,go to /ESB and execute ```npm run start``` *PORT : 3001* (will be used as Proxy)

## Endpoints
### Option 1
**BASEURL : localhost:8000**  

|Endpoint|Method|Parameters in body|Returns|
|-|-|-|-|
|/register|POST|username,password|{status:OK}|
|/signin|POST|username,password|{token:*jwt*}|
|/QuestionsPerKW|GET|keyword:"" **or** id:""|Questions list|
|/QuestionsPerDay|GET|day:"" **or** ( datefrom:"",dateto:"")|Questions list|
|/AnswersOfQuestion|GET| question:id (requires questionid)|Answers list|
|/AnswersOfUser|GET|user:id (requires userid)|Answer list|
|/AddQuestion|POST|user:{id:"",...} , title:"",text:"",date_asked:""|{status:OK}|
|/AddAnswer|POST|user:{id:"",...} , text:"",question:{id:"",...},date_answered:""|{status:OK}|

### Option 2 (Will be used in deployment)
**BASEURL : localhost:3001/proxy**
Endpoints are exactly as described above but are called somewhat differently. 

 URL : http://localhost:3001/proxy
 Method : POST
 Body : Params same as Option 1 + **endpoint:""** , **method:""**
 Headers : Same as Option 1 (JWT Bearer token)

Sample Call :   
  URL : http://localhost:3001/proxy  
  Method : POST  
  Body : {  
    "endpoint":"AnswersOfQuestion",  
    "method":"Get",  
    "question" : 1,  
    "username":"testuser",  
    "password":"testuser"  
 }  
 Headers : {   
   "Authorization" : Bearer Token  
 }  
