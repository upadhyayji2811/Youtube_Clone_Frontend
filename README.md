# YouTube Clone - Frontend

This is the React frontend of the YouTube Clone application, built with Vite and Tailwind CSS.

---

## Git Repositories

- [Frontend Github Repo](https://github.com/upadhyayji2811/Youtube_Clone_Frontend.git)

---

## live link for Demo

- [live link](https://youtube-clone-frontend-theta.vercel.app/)

---

![Upload Video API Screenshot](.src/assets/Screenshot 2025-05-30 101913.png)
![Upload Video API Screenshot](.src/assets/Screenshot 2025-05-30 101913.png)

---

## Usage

- Explore videos on the home page
- Register or Login to upload videos and comment
- Create and manage your own channel
- Like/Dislike videos
- Search for content with real-time suggestions

---

## 📁 Folder Structure

```
youtube_clone_frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ChannelPage.jsx
│   │   └── CreateChannel.jsx
│   │   ├── Header.jsx
│   │   └── HomePage.jsx
│   │   ├── PageNotFound.jsx
│   │   └── Sidebar.jsx
│   │   ├── SignIn.jsx
│   │   └── UploadVideoForm.jsx
│   │   ├──VideoPlayer.jsx
│   ├── utils
│   │   ├── timeAgo.js
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
|   ├── index.html

```

## 💡 Features

- Multi-step forms (auth, upload)
- Responsive video player
- Channel management with banner
- Modal-based forms for UX
- Sidebar with subscriptions and filters

---

### Set up MongoDB Locally for backend database

- Download MongoDB and install MongoDB Compass: [https://www.mongodb.com/products/self-managed/community-edition](https://www.mongodb.com/products/self-managed/community-edition)
- Start MongoDB Server
- Open MongoDB Compass
- Connect using:

```
MONGO_URI=mongodb+srv://upadhyayshivam301:RxB3OSVstmzxjJD4@cluster0.mbqjzqv.mongodb.net/
```

---

## ⚙️ Local Setup

```bash
cd youtube_clone_frontend
npm install
npm run dev
```

---

REACT_APP_API_BASE_URL=http://localhost:5173/

```

## Usage

- Explore videos on the home page
- Register or Login to upload videos and comment
- Create and manage your own channel
- Subscribe to other channels
- Like/Dislike videos
- Search for content with real-time suggestions

---

## 📦 Dependencies

- React + Vite
- React Router
- Axios
- Tailwind CSS

```
