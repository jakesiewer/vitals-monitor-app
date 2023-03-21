# Lifelog

The goal of this project is to develop a **mental awareness app** that **tracks heart rate data and GPS data alongside journal entries** which allows the user to have a minute-by-minute log of their mental and bodily behaviour, giving them an **in-depth view at their emotional, physical, and cognitive patterns**, ultimately empowering them to make informed decisions for better mental health and overall well-being.

***Note, this may README may not be completely up to date. It will be added to as more features are implemented***

---
### Installation
***Contact me at jake.siewer.2020@mumail.ie if you would like an instance of these API keys to run this project yourself***
1. Clone this repository
2. Run `npm install`
2. Add .env file to root directory and frontend diectory
    <br>
    ![Outer File Structure](/assets/outer-file-structure.png)
    <br>
3. Add Fitbit contents to root .env (Fitbit for this application)
    <br>
    ![Root .env](/assets/server_env.png)
    <br>
4. Add Firebase, Fitbit, Strava, and Google Maps API keys to frontend .env
    <br>
    ![Frontend .env](/assets/frontend_env.png)
    <br>
5. Add serviceAccountKey.json (Firebase)
    <br>
    ![serviceAccountKey.json](/assets/serviceaccountkey.png)
    <br>
6. Run `npm start` in both root directory and frontend directory  
7. Access website through `http://localhost:3001/`
---
### Use
1. If you havent registered or logged in you wil be brought to the login screen at `http://localhost:3001/login`. Proceed as required
    <br>
    ![Login](/assets/login.png)
2. Next, you will be brought to the dashboard at `http://localhost:3000/home`
3. Click the button to log in to Fitbit
4. Select date and fetch your activities (Ideally <2 hours in length)
    <br>
    ![Fitbit Login](/assets/fitbit_login.png)
    <br>
5. Select different points on the chart to monitor your location and journal at that point
    <br>
    ![Chart](/assets/chart.png)
    ![Map](/assets/map.png)
    ![Journal](/assets/journal.png)
    <br>
    ***See below a complete view of the working home/dashboard page***
    <br>
    ![Home/Dashboard](/assets/home.jpeg)
    <br>
6. To log a journal click on the journal button in the header
    <br>
    ![Submit Journal](/assets/journal_submit.png)
    <br>
7. And to view your journals
    <br>
        ![View Journals](/assets/journal_view.png)
    <br>