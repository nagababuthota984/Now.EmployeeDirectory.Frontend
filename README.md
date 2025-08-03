# Employee Directory Frontend

A minimalistic ChatGPT-like interface for an employee directory. This application provides both chat and voice interfaces to interact with the employee directory.

## Features

- Modern, minimalistic UI similar to ChatGPT
- Text-based chat interface
- Voice recognition for hands-free interaction
- Integration with MCP server backend

## Technologies Used

- React with TypeScript
- Styled Components for styling
- Speech Recognition API for voice commands
- Axios for API communication

## Getting Started

### Prerequisites

- Node.js and npm installed
- Backend MCP server running

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with:
   ```
   REACT_APP_API_BASE_URL=http://localhost:3001
   ```
   (Replace with your actual MCP server URL)

### Running the Application

Start the development server:

```
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Building for Production

```
npm run build
```

## Usage

- Type questions or commands in the chat interface
- Click the microphone button to use voice commands
- Speak clearly into your microphone to see real-time speech-to-text conversion
- Click the microphone button again to stop recording and send the command
- Toggle "Auto-Send" to automatically send the transcript when you stop speaking
- Use the "Send" button to manually send the final transcript
- Use the "Clear" button to discard the current transcript and start over

## Backend Integration

This frontend communicates with a Model Context Protocol (MCP) server backend. It sends text commands from both the chat and voice interfaces to the backend and displays the responses.

## License

MIT

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
