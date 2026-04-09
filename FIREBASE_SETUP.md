🚀 Dynamic Firebase Setup Guide for Job Board App
1. Understanding the Architecture
This application is built as a Single Page Application (SPA) using React and Vite.
Why we use "Dynamic Configuration"
Normally, Firebase keys are "hardcoded" into the app. If you want to change the database, you have to change the code and redeploy.
Our Solution: We built a system where the app checks your browser's localStorage for a configuration. This allows you to:
Deploy the site once to Cloudflare Pages.
Log in to your own Admin Panel.
Paste a new Firebase JSON to instantly switch the backend without touching the code.
Why "Test Mode"?
We enable Test Mode in Firestore because it removes all security restrictions for 30 days. This allows your app to start saving job applications and logs immediately. Note: For a professional production app, you would eventually write "Rules" to restrict access to only logged-in admins.
2. Step-by-Step Firebase Console Guide
Phase A: Create the Project
Go to the Firebase Console.
Click Add project.
Enter your project name (e.g., myjobcf) and click Continue.
(Optional) Disable Google Analytics for a faster setup, then click Create project.
Once ready, click Continue to enter your Project Dashboard.
Phase B: Register the Web App (Get your JSON)
On the Project Overview screen, click the Web icon ( </> ).
App nickname: Enter any name.
Firebase Hosting: Do NOT check this box (Cloudflare handles your hosting).
Click Register app.
You will see a code block. Look for the firebaseConfig object.
Copy ONLY the JSON part. It should look like this:
code
JSON
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "...",
  "measurementId": "..."
}
Phase C: Enable the Database (Firestore)
If you skip this, your app will show errors when trying to save data.
In the left-hand sidebar, click Build (Hammer icon).
Click Firestore Database.
Click the Create database button.
Location: Select a region (e.g., nam5 for US or eur3 for Europe). Click Next.
Security Rules: Select Start in test mode.
Click Create. Wait for the dashboard to load (it will show "Data", "Rules", etc.).
3. Connecting to your Live Website
Now that your Firebase backend is ready, you need to link it to your Cloudflare deployment.
Open your website URL (e.g., https://your-site.pages.dev/admin).
Login to Admin Panel:
Username: admin
Password: root@1234
Navigate to Database Connectivity: Scroll to the bottom of the Admin page.
Paste the JSON: Delete any old text in the box and paste the JSON you copied in Phase B.
Save: Click Save Configuration.
Automatic Reload: The page will refresh.
4. How to Verify it is Working
Go to the "Contact" or "Job Application" page on your website.
Submit a test application.
Go back to your Firebase Console -> Firestore Database.
You should see a new "Collection" appear (e.g., applications or logs) containing the data you just submitted.