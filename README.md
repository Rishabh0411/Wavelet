# 🎵 Wavelet - Music Sync, Reimagined

A collaborative music listening application that lets you create and join rooms to listen to Spotify music together in real-time. Perfect for parties, study sessions, or just hanging out with friends online!

## ✨ Features

- 🎶 **Create Music Rooms** - Host your own music room with custom settings
- 🚪 **Join Rooms** - Enter a room code to join others' music sessions
- 🎵 **Spotify Integration** - Play, pause, and skip songs from Spotify
- 🗳️ **Democratic Skip System** - Vote to skip songs with configurable vote thresholds
- 👥 **Guest Controls** - Optionally allow guests to control playback
- 📱 **Responsive Design** - Beautiful UI that works on desktop and mobile
- 🔄 **Real-time Sync** - Everyone in the room stays synchronized

## 🛠️ Tech Stack

**Backend:**
- Django 5.1.7
- Django REST Framework
- SQLite Database
- Spotify Web API

**Frontend:**
- React 18
- Material-UI (MUI)
- React Router
- Modern JavaScript (ES6+)

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Spotify Developer Account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd music_controller
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install django djangorestframework requests

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Build the React app
npm run build
```

### 4. Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Update `spotify/credentials.py` with your credentials:

```python
CLIENT_ID = "your_spotify_client_id"
CLIENT_SECRET = "your_spotify_client_secret"
REDIRECT_URI = "http://127.0.0.1:8000/spotify/redirect"
```

⚠️ **Security Note:** Never commit real credentials to version control!

### 5. Run the Application

```bash
# From the project root directory
python manage.py runserver
```

Visit `http://127.0.0.1:8000` in your browser! 🎉

## 📖 How to Use

### Creating a Room

1. Click **"Create a Room"** on the homepage
2. Configure your room settings:
   - **Guest Control**: Allow guests to play/pause music
   - **Votes to Skip**: Number of votes needed to skip a song
3. Click **"Create Room"**
4. Share your room code with friends!

### Joining a Room

1. Click **"Join a Room"** on the homepage
2. Enter the room code provided by the host
3. Click **"Join Room"**
4. Start enjoying music together!

### Host Features

- **Spotify Authentication**: Automatically prompted when creating a room
- **Room Settings**: Update room configuration anytime
- **Full Control**: Play, pause, and skip without voting

### Guest Features

- **Music Control**: Play/pause if enabled by host
- **Skip Voting**: Vote to skip songs you don't like
- **Real-time Updates**: See current song and playback status

## 🏗️ Project Structure

```
music_controller/
├── api/                    # Django REST API
│   ├── models.py          # Room model
│   ├── views.py           # API endpoints
│   ├── serializers.py     # Data serialization
│   └── urls.py            # API routing
├── frontend/              # React frontend
│   └── src/components/    # React components
│       ├── Homepage.js    # Main page
│       ├── Room.js        # Room interface
│       ├── CreateRoomPage.js
│       ├── RoomJoinPage.js
│       ├── MusicPlayer.js
│       └── Info.js
├── spotify/               # Spotify integration
│   ├── models.py          # Token & Vote models
│   ├── views.py           # Spotify API endpoints
│   ├── util.py            # Spotify utilities
│   └── credentials.py     # API credentials
└── music_controller/      # Django project settings
    ├── settings.py
    └── urls.py
```

## 🔌 API Endpoints

### Room Management
- `POST /api/create-room` - Create a new room
- `POST /api/join-room` - Join existing room
- `GET /api/get-room` - Get room details
- `PATCH /api/update-room` - Update room settings
- `POST /api/leave-room` - Leave current room
- `GET /api/user-in-room` - Check user's current room

### Spotify Integration
- `GET /spotify/get-auth-url` - Get Spotify auth URL
- `GET /spotify/is-authenticated` - Check auth status
- `GET /spotify/current-song` - Get current playing song
- `PUT /spotify/play` - Play current song
- `PUT /spotify/pause` - Pause current song
- `POST /spotify/skip` - Skip current song

## 🎨 Features Explained

### Democratic Skip System
- Users vote to skip songs they don't like
- Host sets the required number of votes
- Host can skip immediately without votes
- Votes reset when song changes

### Session Management
- Django sessions track users across requests
- Room codes stored in user sessions
- Automatic cleanup when users leave

### Real-time Updates
- Current song updates every second
- Playback state synchronized across all users
- Vote counts update in real-time

## 🚀 Deployment

The app is configured for deployment on Render.com:

1. **Environment Variables:**
   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

2. **Static Files:** Configured for production serving

3. **Database:** Uses SQLite (consider PostgreSQL for production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

**"Room not found" error:**
- Check the room code is correct
- Ensure the room hasn't been deleted

**Spotify authentication fails:**
- Verify your Spotify credentials
- Check redirect URI matches exactly
- Ensure Spotify app is set to development mode

**Songs not playing:**
- Make sure you have an active Spotify Premium account
- Check if Spotify is open and logged in
- Verify you have an active device in Spotify

### Getting Help

- Check the [Issues](../../issues) page for known problems
- Create a new issue if you find a bug
- Include error messages and steps to reproduce

## 🎉 Enjoy Your Music Sessions!

Now you're ready to create amazing collaborative music experiences with Wavelet. Invite your friends, create a room, and let the music bring you together! 🎵✨
