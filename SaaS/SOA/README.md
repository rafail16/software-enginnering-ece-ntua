
# AskMeAnything Draft
## What we have at the end of Sprint #1
### Frontend
A simple Frontend_v1 has been constructed containing the following pages:
#### 1. SignUp 
   ![signup](https://i.imgur.com/PAJSKQ7.png)
#### 2. Login 
   ![login](https://i.imgur.com/pSnDPPX.png)
#### 3. Landing Page
![LandingPage](https://i.imgur.com/jOF17JD.png)
#### 4. My Home Page
 ![HomePage](https://i.imgur.com/EK7OxLc.png)
#### 5. Ask A Question
 ![Question](https://i.imgur.com/zXBgmcS.png)
#### 6. Answer A Question
 ![Answer](https://i.imgur.com/bvoigve.png)


### Backend
When it comes to backend the **Authenticator_v1** has been constructed. The authenticator's core functionality  
is to check if the provided (through an http post request) plain-text password matches the **hashed** password   
which resides in the database. After the authentication a token (JWT) is created and returned in json format   
Apart from that , a simple integration is needed to use the register endpoint provided in the Authenticator_v1.  

### Database
ER Diagrams has been created and is under /Diagrams/ directory.  



