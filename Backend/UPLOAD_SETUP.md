# Upload Configuration Guide

## Overview

This application supports both Cloudinary (cloud storage) and local file storage for handling file uploads. The system automatically falls back to local storage if Cloudinary is not configured.

## Cloudinary Setup (Recommended)

### 1. Create a Cloudinary Account

- Go to [Cloudinary](https://cloudinary.com/) and create a free account
- Get your Cloud Name, API Key, and API Secret from your dashboard

### 2. Configure Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 3. Benefits of Cloudinary

- Automatic image optimization
- CDN delivery
- Image transformations
- Video processing
- Cloud storage

## Local Storage (Fallback)

If Cloudinary is not configured, files will be stored locally in the `uploads/` directory:

- Images: `uploads/images/`
- Videos: `uploads/videos/`

### Accessing Local Files

Files uploaded locally are served statically and can be accessed via:

- Images: `http://localhost:3000/uploads/images/filename.jpg`
- Videos: `http://localhost:3000/uploads/videos/filename.mp4`

## Upload Endpoints

### Single Image Upload

```
POST /api/upload/image/single
Content-Type: multipart/form-data
Body: { image: file }
```

### Multiple Images Upload

```
POST /api/upload/image/multiple
Content-Type: multipart/form-data
Body: { images: [file1, file2, ...] } (max 5 files)
```

### Avatar Upload

```
POST /api/upload/avatar
Content-Type: multipart/form-data
Body: { avatar: file }
```

### Video Upload

```
POST /api/upload/video
Content-Type: multipart/form-data
Body: { video: file }
```

### Channel Update (Multiple Files)

```
PUT /api/dashboard/channel
Content-Type: multipart/form-data
Body: {
  channelAvatar: file (optional),
  channelBanner: file (optional),
  // other channel data
}
```

## File Type Restrictions

### Images

- Allowed formats: JPEG, JPG, PNG
- Max size: 100MB (single), 5MB (multiple), 2MB (avatar)

### Videos

- Allowed formats: MP4
- Max size: 5MB

## Response Format

### Success Response

```json
{
  "statusCode": 200,
  "message": "File uploaded successfully!",
  "data": {
    "url": "file_url",
    "public_id": "file_id",
    "format": "file_format",
    "size": "file_size"
  }
}
```

## Error Handling

The system includes comprehensive error handling for:

- File type validation
- File size limits
- Missing files
- Upload failures
- Configuration issues

## Notes

- The `uploads/` directory is automatically created if it doesn't exist
- Local files are served statically by Express
- Cloudinary configuration is validated at startup
- The system gracefully falls back to local storage if Cloudinary is unavailable
