# Frontend Setup Guide

## Overview

This is the React frontend for the YouTube clone application. It communicates with the backend API for user authentication, file uploads, and other features.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 3000

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Development

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` by default.

## API Configuration

The frontend uses a centralized API configuration located in `src/config/api.js`. This file manages all API endpoints and can be configured using environment variables.

### Available Endpoints

- **Authentication**: `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`
- **Upload**: `/api/upload/image/single`, `/api/upload/avatar`, `/api/upload/video`
- **User**: `/api/users`
- **Videos**: `/api/videos`
- **Dashboard**: `/api/dashboard/*`

## File Upload Features

### Avatar Upload

- Supported formats: JPEG, JPG, PNG, GIF
- Maximum size: 5MB
- Preview functionality included
- Automatic validation

### Video Upload

- Supported formats: MP4
- Maximum size: 5MB
- Progress tracking (to be implemented)

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure the backend is running on the correct port
   - Check that CORS is properly configured in the backend
   - Verify the API URL in the environment configuration

2. **File Upload Fails**

   - Check file size and format restrictions
   - Ensure the backend upload middleware is properly configured
   - Verify that the uploads directory exists and is writable

3. **Authentication Issues**
   - Check that the backend auth routes are properly configured
   - Verify JWT token handling
   - Ensure proper error handling in the frontend

### Debug Steps

1. Check browser console for errors
2. Verify network requests in browser dev tools
3. Check backend server logs
4. Ensure both frontend and backend are running
5. Verify environment variables are set correctly

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Environment Variables

| Variable       | Description          | Default                 |
| -------------- | -------------------- | ----------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |

## Notes

- The frontend uses Vite for fast development and building
- Tailwind CSS is used for styling
- React Router is used for navigation (to be implemented)
- File uploads support both Cloudinary and local storage
