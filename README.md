# Parksphere

A mobile parking management application built with React Native. Find, book, and manage parking spaces with ease.

## Features

- **Home Screen** - Browse available parking locations
- **Parking Details** - View detailed information about parking spots
- **Booking History** - Track your parking bookings
- **Menu Navigation** - Easy navigation between screens
- **Local Database** - Store parking data locally

## Tech Stack

- **React Native** - Cross-platform mobile development
- **Babel** - JavaScript transpiler
- **JavaScript** - Core language

## Project Structure

```
├── src/
│   ├── screens/          # App screens
│   │   ├── HomeScreen.js
│   │   ├── BookingHistory.js
│   │   ├── ParkingDetailScreen.js
│   │   └── MenuScreen.js
│   ├── data/             # Data management
│   │   └── seedParking.js
│   └── storage/          # Local storage
│       └── localDB.js
├── assets/               # Images and static files
├── App.js                # Main app component
├── index.js              # Entry point
├── app.json              # App configuration
├── babel.config.js       # Babel configuration
└── package.json          # Project dependencies
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DCP0001/parksphere.git
   cd parksphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the app**
   ```bash
   npm start
   ```

## Usage

- Launch the app to see available parking locations
- Tap on a parking spot to view details
- Book a parking spot through the booking interface
- View your booking history anytime
- Use the menu to navigate between different screens

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

This project is open source and available under the MIT License.

---

**Author:** DCP0001  
**Repository:** [github.com/DCP0001/parksphere](https://github.com/DCP0001/parksphere)
