# 🌍 Yavi — Smart Travel Companion

### Plan Smarter. Travel Better. Stay Safer. ✈️

Yavi is a smart travel companion designed to make trip planning easier by bringing essential travel features together in one platform. Instead of switching between multiple websites, users can explore travel options, manage bookings, get personalized suggestions, and access an emergency SOS feature.

## 🌐 Project Links

- **Live Website:** `https://vercel.com/mrrishavraj97531-8161s-projects/yavi-smart-travel-companion`
- **GitHub Repository:** https://github.com/rishav97531/yavi-smart-travel-companion

## 📌 About the Project

Planning a trip often means managing different websites for travel arrangements, accommodations, transportation, and destination research. In an emergency, finding a quick way to share your location can also be important.

Yavi aims to simplify this experience by providing a single platform for travel planning and assistance. The project focuses on convenience, personalization, and traveler safety through an intuitive web interface.

## ✨ Key Features

- 🧭 **Smart Travel Planning:** Organize travel plans in one place.
- ✈️ **Flight Management:** Explore and manage flight-related booking options.
- 🏨 **Hotel Management:** Access hotel-related travel options.
- 🚕 **Cab Management:** Manage transportation options for your journey.
- 🤖 **Yavi Suggests:** Discover personalized travel suggestions.
- 🆘 **Emergency SOS:** Send emergency alerts with location and time information through the configured email/SMS functionality.
- 🔐 **Authentication:** User authentication through Firebase.
- 📱 **Responsive Interface:** Designed to provide a convenient experience across different screen sizes.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend interface |
| Tailwind CSS | Styling and responsive layouts |
| Framer Motion | UI animations and transitions |
| Axios | HTTP requests and API communication |
| Firebase Authentication | User authentication |
| Firebase Admin SDK | Backend Firebase integration |
| Node.js | Backend runtime |
| Express.js | Backend API framework, if used in the current implementation |
| MongoDB | Data storage |
| Cohere API | AI-related functionality, where configured |

*The technologies listed above should be checked against the final codebase before treating this table as the definitive implementation stack.*

## 🏗️ How It Works

1. **Access the platform:** Open Yavi and authenticate if required.
2. **Plan your trip:** Explore the available travel-planning features.
3. **Manage travel options:** Use the flight, hotel, and cab sections.
4. **Explore suggestions:** Check Yavi Suggests for relevant travel recommendations.
5. **Stay prepared:** Use the SOS feature when necessary, subject to the configured permissions and services.

## 🚀 Getting Started

### Prerequisites

Install the following tools before running the project locally:

- Node.js and npm
- Git
- MongoDB, if your backend uses a local MongoDB instance
- Required Firebase project configuration
- API credentials for any external services enabled in your setup

### 1. Clone the Repository

```bash
git clone https://github.com/rishav97531/yavi-smart-travel-companion.git
cd yavi-smart-travel-companion
```

### 2. Install Dependencies

Install dependencies in the frontend and backend directories according to the project's folder structure.

```bash
npm install
```

If the frontend and backend have separate `package.json` files, run `npm install` in each respective directory.

### 3. Configure Environment Variables

Create the required `.env` files using the variable names expected by the existing source code.

Typical configuration may include:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
COHERE_API_KEY=your_cohere_api_key
```

Configure Firebase and any other external service credentials according to the project's implementation.

**Security:** Never commit real API keys, passwords, private keys, Firebase service-account files, or other secrets to GitHub. Keep them in environment variables and add sensitive files to `.gitignore`.

### 4. Start the Application

Run the frontend and backend using the scripts defined in their respective `package.json` files.

For example, if the frontend uses Vite:

```bash
npm run dev
```

For a backend that defines a start script:

```bash
npm start
```

The exact commands and local URLs depend on the scripts and configuration in your repository.

## 🔒 Security and Privacy

- Keep all secret credentials outside the public repository.
- Use authentication and appropriate authorization checks for protected resources.
- Restrict access to emergency contact information and location data.
- Verify that email/SMS delivery and external API integrations are properly configured.
- Do not rely on the SOS feature as a replacement for official emergency services.

## 🎯 Project Goals

- Simplify travel planning through a unified interface.
- Reduce the effort required to manage travel arrangements.
- Provide useful, personalized travel suggestions.
- Make emergency contact and location sharing easier when configured.
- Build a practical full-stack application using modern web technologies.

## 🔮 Future Improvements

- Real-time travel updates and notifications.
- More advanced AI-based itinerary recommendations.
- Improved travel budget tracking.
- Additional map and route integrations.
- Enhanced booking workflows and trip history.
- More comprehensive testing and deployment monitoring
