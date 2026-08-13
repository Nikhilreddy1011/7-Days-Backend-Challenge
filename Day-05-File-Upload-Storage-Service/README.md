# Day 5 — File Upload & Storage Service

A complete backend mini-project built with **Node.js, Express.js, MongoDB, Mongoose, Multer, Streams, and Cloudinary**.

This project is part of a **7-Day Backend Challenge** and focuses on building a practical file-upload and storage service with validation, cloud storage, metadata management, streaming, downloading, deletion, and error handling.

---

## 📌 Project Overview

The application provides backend APIs for:

- Uploading image files
- Uploading PDF files
- Handling `multipart/form-data`
- Validating file extensions
- Validating MIME types
- Limiting file size
- Temporarily storing files using Multer
- Uploading files to Cloudinary
- Storing file metadata in MongoDB
- Viewing/streaming files
- Downloading files
- Deleting files
- Deleting cloud files from Cloudinary
- Cleaning up temporary local files
- Handling upload and application errors
- Protecting secrets with environment variables

### Main Storage Principle

```text
                    File Upload
                         |
                         v
                      Multer
                         |
                         v
                  Temporary File
                         |
                         v
                    Cloudinary
                         |
              +----------+----------+
              |                     |
              v                     v
         Actual File          File Metadata
              |                     |
              |                     v
              |                  MongoDB
              |
              v
        Cloud Storage
```

MongoDB stores file metadata while Cloudinary stores the actual file.

---

# 🎯 Day 5 Objectives

The Day 5 project covers:

- Multer
- Multipart Form Data
- File Upload
- Image Upload
- PDF Upload
- File Validation
- File Size Limits
- Streams
- Buffer vs Streams
- File Download APIs
- File Deletion
- Cloudinary
- MongoDB Metadata
- Temporary File Cleanup
- Error Handling
- Environment Variables
- Storage Best Practices
- API Testing with Postman

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| Multer | Multipart file upload handling |
| Cloudinary | Cloud file storage |
| dotenv | Environment variable management |
| JavaScript | Backend programming language |
| Postman | API testing |

---

# 📂 Project Structure

```text
Day-05-File-Upload-Storage-Service/
│
├── config/
│   ├── db.js
│   └── cloudinary.js
│
├── controllers/
│   └── fileController.js
│
├── middleware/
│   └── uploadMiddleware.js
│
├── models/
│   └── File.js
│
├── routes/
│   └── fileRoutes.js
│
├── utils/
│   └── fileStream.js
│
├── uploads/
│
├── app.js
├── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Folder Responsibilities

### `config/`

```text
config/
├── db.js
└── cloudinary.js
```

- `db.js` — MongoDB connection
- `cloudinary.js` — Cloudinary configuration

### `controllers/`

```text
controllers/
└── fileController.js
```

Contains business logic for:

- Uploading files
- Streaming/viewing files
- Downloading files
- Deleting files

### `middleware/`

```text
middleware/
└── uploadMiddleware.js
```

Contains:

- Multer configuration
- File storage
- File filtering
- MIME validation
- Extension validation
- File-size limits

### `models/`

```text
models/
└── File.js
```

Stores uploaded-file metadata.

### `routes/`

```text
routes/
└── fileRoutes.js
```

Connects HTTP endpoints with middleware and controllers.

### `utils/`

```text
utils/
└── fileStream.js
```

Contains reusable stream-related helpers.

### `uploads/`

Temporary local upload directory.

It should not be committed to Git.

---

# 🏗️ Overall Architecture

```text
                         +----------------+
                         |     Client     |
                         |    Postman     |
                         +-------+--------+
                                 |
                                 | HTTP Request
                                 v
                         +----------------+
                         |    Express     |
                         |     Server     |
                         +-------+--------+
                                 |
                                 v
                         +----------------+
                         |     Routes     |
                         +-------+--------+
                                 |
                                 v
                         +----------------+
                         |    Multer      |
                         |    Middleware  |
                         +-------+--------+
                                 |
                                 v
                         +----------------+
                         | File Validation|
                         +-------+--------+
                                 |
                                 v
                         +----------------+
                         |  Controller    |
                         +-------+--------+
                                 |
                   +-------------+-------------+
                   |                           |
                   v                           v
           +---------------+            +---------------+
           |  Cloudinary   |            |    MongoDB    |
           | Actual File   |            | File Metadata |
           +---------------+            +---------------+
```

---

# 🔄 Complete Upload Architecture

```text
Client
  |
  | multipart/form-data
  v
Express
  |
  v
Route
  |
  v
Multer
  |
  +--> File Size Validation
  |
  +--> MIME Validation
  |
  +--> Extension Validation
  |
  v
Temporary Local File
  |
  v
Cloudinary
  |
  +--> secure_url
  +--> public_id
  +--> resource_type
  +--> format
  |
  v
MongoDB
  |
  +--> originalName
  +--> fileName
  +--> mimeType
  +--> size
  +--> path
  +--> cloudinaryPublicId
  +--> cloudinaryUrl
  +--> cloudinaryResourceType
  +--> cloudinaryFormat
  |
  v
Temporary File Cleanup
  |
  v
201 Created
```

---

# ☁️ Cloudinary Architecture

Cloudinary is used for persistent cloud storage.

```text
                  Node.js Server
                       |
                       v
                +-------------+
                | Cloudinary  |
                +-------------+
                       |
          +------------+------------+
          |            |            |
          v            v            v
      public_id    secure_url    format
          |            |            |
          +------------+------------+
                       |
                       v
                    MongoDB
                    Metadata
```

The Cloudinary response provides information such as:

- `public_id`
- `secure_url`
- `resource_type`
- `format`

The application stores these values in MongoDB.

---

# 🗄️ MongoDB Architecture

MongoDB stores file metadata rather than the complete file.

Example:

```json
{
    "originalName": "resume.pdf",
    "fileName": "178659739791-64058789.pdf",
    "mimeType": "application/pdf",
    "size": 2612726,
    "path": "uploads/178659739791-64058789.pdf",
    "cloudinaryPublicId": "day-05-file-upload/example",
    "cloudinaryUrl": "https://res.cloudinary.com/example",
    "cloudinaryResourceType": "image",
    "cloudinaryFormat": "pdf"
}
```

The exact Cloudinary `resource_type` depends on the configured upload behavior.

---

# 📤 Upload API

## Endpoint

```http
POST /api/files/upload
```

Local URL:

```text
http://localhost:5000/api/files/upload
```

## Request Type

```text
multipart/form-data
```

The field name is:

```text
file
```

Example:

```text
Key: file
Type: File
```

---

# 🧪 Postman Upload Test

1. Open Postman.
2. Create a `POST` request.
3. Enter:

```text
http://localhost:5000/api/files/upload
```

4. Select `Body`.
5. Select `form-data`.
6. Add:

```text
Key: file
Type: File
```

7. Select an image or PDF.
8. Click `Send`.

---

# ✅ Successful Upload Response

A successful upload returns:

```text
201 Created
```

Example:

```json
{
    "message": "File uploaded successfully",
    "file": {
        "id": "6a7d501ef68f3c0faea092e3",
        "originalName": "HCT - Evaluation.pdf",
        "fileName": "178659739791-64058789.pdf",
        "mimeType": "application/pdf",
        "size": 2612726,
        "cloudinaryPublicId": "day-05-file-upload/example",
        "cloudinaryUrl": "https://res.cloudinary.com/example",
        "cloudinaryResourceType": "image",
        "cloudinaryFormat": "pdf",
        "uploadedAt": "2026-08-13T05:03:26.029Z"
    }
}
```

---

# 📁 Supported File Types

The application allows:

```text
.jpg
.jpeg
.png
.webp
.gif
.pdf
```

Validation checks:

```text
                 Uploaded File
                       |
             +---------+---------+
             |                   |
             v                   v
        MIME Type            Extension
             |                   |
             +---------+---------+
                       |
                       v
                   Validation
                       |
             +---------+---------+
             |                   |
            Valid              Invalid
             |                   |
             v                   v
          Upload              Reject
```

---

# 🔐 File Validation

Allowed MIME types:

```text
image/jpeg
image/png
image/webp
image/gif
application/pdf
```

Allowed extensions:

```text
.jpg
.jpeg
.png
.webp
.gif
.pdf
```

The application checks both MIME type and extension.

---

# 📦 File Size Limit

The maximum allowed file size is:

```text
5 MB
```

Multer configuration:

```javascript
limits: {
    fileSize: 5 * 1024 * 1024
}
```

Files larger than 5 MB are rejected.

---

# ❌ Invalid File Handling

Unsupported examples:

```text
.zip
.exe
.mp4
.docx
```

Expected response:

```json
{
    "message": "Only JPG, JPEG, PNG, WEBP, GIF and PDF files are allowed."
}
```

---

# 🌊 Streams

Streams process data progressively in chunks instead of loading the entire file into memory.

```text
Large File
    |
    +--> Chunk 1 --> Process
    |
    +--> Chunk 2 --> Process
    |
    +--> Chunk 3 --> Process
    |
    +--> Chunk 4 --> Process
    |
    +--> ...
```

This is useful when working with large files.

---

# 🧠 Buffer vs Streams

## Buffer

A Buffer loads the complete data into memory.

```javascript
const fs = require("fs");

const data = fs.readFileSync("example.pdf");

console.log(data);
```

Architecture:

```text
File
 |
 v
Entire File
 |
 v
Memory
```

For large files, this can consume significant RAM.

## Stream

A stream reads data progressively.

```javascript
const fs = require("fs");

const stream =
    fs.createReadStream("example.pdf");

stream.on("data", (chunk) => {

    console.log(
        "Received:",
        chunk.length,
        "bytes"
    );

});

stream.on("end", () => {

    console.log("Finished");

});
```

Architecture:

```text
File
 |
 +--> Chunk
 |
 +--> Chunk
 |
 +--> Chunk
 |
 +--> Chunk
 |
 v
Application
```

---

# 📥 File Stream / View API

Endpoint:

```http
GET /api/files/:id/stream
```

Example:

```text
http://localhost:5000/api/files/FILE_ID/stream
```

The endpoint:

1. Validates the MongoDB ObjectId.
2. Finds the file metadata.
3. Checks the stored file information.
4. Creates a stream where applicable.
5. Sends the file to the client.

---

# 📥 Download API

Endpoint:

```http
GET /api/files/:id/download
```

Example:

```text
http://localhost:5000/api/files/FILE_ID/download
```

Flow:

```text
Client
  |
  v
GET /api/files/:id/download
  |
  v
Validate ID
  |
  v
MongoDB
  |
  v
Find File Metadata
  |
  v
Cloudinary File
  |
  v
Client Download
```

---

# 🗑️ Delete API

Endpoint:

```http
DELETE /api/files/:id
```

Flow:

```text
Client
  |
  v
DELETE /api/files/:id
  |
  v
Validate ID
  |
  v
MongoDB
  |
  v
Find Metadata
  |
  v
Cloudinary
  |
  v
Delete Actual File
  |
  v
MongoDB
  |
  v
Delete Metadata
  |
  v
Success Response
```

---

# 🧹 Temporary File Cleanup

The intended flow is:

```text
Upload
  |
  v
Multer
  |
  v
uploads/
  |
  v
Cloudinary
  |
  v
MongoDB
  |
  v
Delete Temporary File
```

This prevents the server's local disk from filling up with permanent uploads.

---

# 🔐 Environment Variables

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Never commit `.env` to GitHub.

---

# 📝 .env.example

The repository should contain:

```text
.env.example
```

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# ⚠️ Secret Management

Never print:

```javascript
console.log(process.env.CLOUDINARY_API_SECRET);
```

A safe configuration check is:

```javascript
console.log(
    "Cloudinary:",
    process.env.CLOUDINARY_CLOUD_NAME
        ? "Configured"
        : "Not configured"
);
```

Never expose secrets in:

- Source code
- GitHub
- README
- Screenshots
- API responses
- Frontend code
- Public logs

---

# 🛡️ .gitignore

Important entries:

```text
node_modules/
.env
.env.*
!.env.example

logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

coverage/
.nyc_output/

dist/
build/

.cache/
.npm/
.eslintcache

.DS_Store
Thumbs.db

.vscode/
.idea/

*.tmp
*.temp

.docker/

redis-data/
dump.rdb

uploads/
```

---

# ⚙️ Installation

## 1. Clone

```bash
git clone <your-github-repository-url>
```

## 2. Enter Project

```bash
cd Day-05-File-Upload-Storage-Service
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Configure `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 5. Start

```bash
npm start
```

Expected:

```text
MongoDB Connected: ...
Cloudinary: Configured
Server running on port 5000
```

---

# 🧪 Complete API Testing

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API status |
| POST | `/api/files/upload` | Upload file |
| GET | `/api/files/:id/stream` | View/stream file |
| GET | `/api/files/:id/download` | Download file |
| DELETE | `/api/files/:id` | Delete file |

---

# 🏠 Home API

```http
GET /
```

Expected:

```json
{
    "message": "Day 5 File Upload & Storage Service API"
}
```

---

# 🖼️ Image Upload Test

```http
POST /api/files/upload
```

Use:

```text
Body → form-data
Key → file
Type → File
```

Select:

```text
JPG / PNG / WEBP / GIF
```

Expected:

```text
201 Created
```

---

# 📄 PDF Upload Test

```http
POST /api/files/upload
```

Select a PDF.

Expected:

```text
201 Created
```

---

# 🚫 Invalid File Test

Try:

```text
ZIP
EXE
MP4
DOCX
```

Expected:

```text
400 Bad Request
```

---

# 📦 Large File Test

Upload a file larger than:

```text
5 MB
```

Expected:

```text
400 Bad Request
```

---

# 📥 Stream Test

```http
GET /api/files/:id/stream
```

---

# 📥 Download Test

```http
GET /api/files/:id/download
```

---

# 🗑️ Delete Test

```http
DELETE /api/files/:id
```

Expected:

```json
{
    "message": "File deleted successfully"
}
```

Verify:

```text
Cloudinary → file removed
MongoDB → metadata removed
```

---

# 🔄 Complete File Lifecycle

```text
                 FILE LIFECYCLE
                       |
                       v
                  User Upload
                       |
                       v
                 Multipart Data
                       |
                       v
                     Multer
                       |
                       v
                  Validation
                       |
                       v
              Temporary Storage
                       |
                       v
                  Cloudinary
                       |
                       v
                Cloudinary URL
                       |
                       v
                   MongoDB
                       |
                       v
                  File Access
                 /                           /                            v               v
           Streaming        Download
                \             /
                 \           /
                  v         v
                    Delete
                       |
              +--------+--------+
              |                 |
              v                 v
         Cloudinary         MongoDB
         Delete File        Delete Record
```

---

# 🧱 Layered Architecture

```text
                 HTTP Request
                       |
                       v
                 +-----------+
                 |   Routes  |
                 +-----+-----+
                       |
                       v
                +--------------+
                |  Middleware  |
                |    Multer    |
                +------+-------+
                       |
                       v
                +--------------+
                | Controllers  |
                +------+-------+
                       |
              +--------+--------+
              |                 |
              v                 v
         +---------+       +-----------+
         | Model   |       | Cloudinary|
         | MongoDB |       | Storage   |
         +---------+       +-----------+
```

---

# 🧩 MVC-Style Structure

```text
Routes
  |
  v
Controllers
  |
  +----> Models
  |
  +----> Cloudinary
  |
  +----> Utilities
```

- Routes define endpoints.
- Controllers contain application logic.
- Models define MongoDB data.
- Middleware handles uploads and validation.
- Utilities contain reusable functions.
- Config contains external-service configuration.

---

# 🌐 API Architecture

```text
                     REST API
                        |
       +----------------+----------------+
       |                |                |
       v                v                v
    Upload           Stream          Download
       |                |                |
       +----------------+----------------+
                        |
                        v
                      Delete
```

---

# 🏪 Storage Strategy

## Local Storage

```text
Application Server
       |
       v
   Local Disk
       |
       v
   Uploaded Files
```

Advantages:

- Simple
- Easy for development
- No external storage service required

Disadvantages:

- Limited disk space
- Difficult to scale
- Files can be lost when servers are replaced
- Not ideal for distributed applications

## Cloud Storage

```text
Application Server
       |
       v
   Cloudinary
       |
       v
 Actual File
```

Advantages:

- Scalable
- External storage
- CDN-backed delivery
- Reduced application-server disk usage
- Better suited for production

---

# 🏭 Production Architecture

```text
                         Internet
                            |
                            v
                    +---------------+
                    | Load Balancer |
                    +-------+-------+
                            |
             +--------------+--------------+
             |                             |
             v                             v
       +------------+                +------------+
       | Node API   |                | Node API   |
       | Server 1   |                | Server 2   |
       +------+-----+                +------+-----+
              |                             |
              +--------------+--------------+
                             |
                +------------+------------+
                |                         |
                v                         v
          +-----------+             +-----------+
          | MongoDB   |             | Cloudinary|
          | Metadata  |             | Files     |
          +-----------+             +-----------+
```

This architecture keeps actual file storage separate from application servers.

---

# 🔒 Security Best Practices

- Never expose `CLOUDINARY_API_SECRET`.
- Never commit `.env`.
- Validate MIME type.
- Validate extension.
- Limit file size.
- Validate MongoDB ObjectIds.
- Clean temporary files.
- Use authentication for private files in production.
- Use signed URLs where appropriate.
- Avoid exposing internal stack traces in production.
- Add rate limiting for public upload endpoints.
- Consider malware/virus scanning for production uploads.

---

# 📈 Scalability

The current architecture can be extended with:

- Authentication
- Authorization
- User-specific file ownership
- Multiple file uploads
- Pagination
- Search
- Folder management
- File preview
- Signed URLs
- AWS S3
- Presigned URLs
- Virus scanning
- Rate limiting
- Background processing
- Queue systems
- CDN optimization

---

# 🚀 Future Improvements

## Authentication

```text
User
 |
 +--> File 1
 +--> File 2
 +--> File 3
```

## Multiple File Upload

Support:

```text
files[]
```

## File Search

Search using:

```text
originalName
mimeType
createdAt
user
```

## Pagination

```text
Page 1
Page 2
Page 3
...
```

## AWS S3

Alternative architecture:

```text
Node.js
   |
   v
AWS S3
   |
   v
File
```

## Signed URLs

```text
Client
  |
  v
Backend
  |
  v
Signed URL
  |
  v
Cloud Storage
```

---

# 📊 Day 5 Concept Map

```text
                         DAY 5
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
       Multer          Validation        Streams
          |                |                |
          v                v                v
     Multipart         MIME Type        Chunk Data
     Form Data         Extension
                        Size
          |                |
          +--------+-------+
                   |
                   v
             File Upload
                   |
          +--------+--------+
          |                 |
          v                 v
      Cloudinary         MongoDB
      Actual File        Metadata
          |                 |
          +--------+--------+
                   |
                   v
              File Access
             /     |                  /      |                  v       v        v
       Stream   Download   Delete
```

---

# 🧠 Key Backend Concepts Learned

### Multipart Form Data

Used for sending files through HTTP requests.

### Middleware

Multer runs before the controller.

```text
Request
   |
   v
Multer
   |
   v
Controller
   |
   v
Response
```

### File Validation

Checks:

```text
MIME
Extension
Size
```

### Streams

Process file data progressively.

### Cloud Storage

Cloudinary stores actual files.

### Database Metadata

MongoDB stores file information and cloud references.

### Error Handling

Handles:

```text
Missing File
Invalid File Type
Large File
Invalid ObjectId
Missing Database Record
Cloudinary Error
Database Error
Stream Error
```

---

# 🧪 Testing Checklist

```text
[ ] Server starts successfully
[ ] MongoDB connects
[ ] Cloudinary configuration works
[ ] Home API works
[ ] JPG upload works
[ ] PNG upload works
[ ] WEBP upload works
[ ] GIF upload works
[ ] PDF upload works
[ ] Invalid extension is rejected
[ ] Invalid MIME type is rejected
[ ] Files above 5 MB are rejected
[ ] Stream/View endpoint works
[ ] Download endpoint works
[ ] Delete endpoint works
[ ] Cloudinary file is deleted
[ ] MongoDB metadata is deleted
[ ] Temporary files are cleaned
[ ] .env is ignored
[ ] uploads/ is ignored
[ ] README is updated
```

---

# 🛑 Stopping the Server

Stop Node.js:

```text
Ctrl + C
```

Day 5 itself does not require Redis or Docker. If Docker is only running a Redis container from the previous Day 3 project, it can be stopped separately when you are finished using it.

---

# 🔄 Restarting the Project

```bash
cd Day-05-File-Upload-Storage-Service
npm start
```

Then test:

```text
http://localhost:5000
```

---

# 📚 Final Learning Summary

The complete Day 5 workflow is:

```text
                 CLIENT
                    |
                    v
          multipart/form-data
                    |
                    v
                EXPRESS
                    |
                    v
                 MULTER
                    |
                    v
              VALIDATION
                    |
                    v
          TEMPORARY STORAGE
                    |
                    v
              CLOUDINARY
                    |
          +---------+---------+
          |                   |
          v                   v
      ACTUAL FILE        FILE URL / ID
                              |
                              v
                           MONGODB
                              |
                              v
                         FILE METADATA
                              |
                +-------------+-------------+
                |             |             |
                v             v             v
             STREAM        DOWNLOAD       DELETE
                                              |
                                   +----------+----------+
                                   |                     |
                                   v                     v
                              CLOUDINARY              MONGODB
                              DELETE FILE           DELETE RECORD
```

---

# 🎓 Key Takeaway

The most important architectural principle from Day 5 is:

> **Store the actual file in dedicated cloud storage and store only file metadata/reference information in MongoDB.**

This separates responsibilities:

```text
Cloudinary
    |
    +--> Actual File

MongoDB
    |
    +--> File Metadata

Node.js
    |
    +--> Business Logic
```

This makes the application easier to maintain and provides a stronger foundation for scaling.

---

# ✅ Day 5 Completion Status

```text
========================================
       DAY 5 — COMPLETED
========================================

[x] Multer
[x] Multipart Form Data
[x] Image Upload
[x] PDF Upload
[x] File Validation
[x] MIME Validation
[x] Extension Validation
[x] File Size Limit
[x] Streams
[x] Buffer vs Streams
[x] File Download API
[x] File Stream/View API
[x] File Delete API
[x] Cloudinary Integration
[x] Cloudinary Metadata
[x] MongoDB Metadata
[x] Temporary File Handling
[x] Error Handling
[x] Environment Variables
[x] .gitignore
[x] Postman Testing
[x] Storage Architecture
[x] Storage Best Practices

========================================
             DAY 5 DONE
========================================
```

---

# 👨‍💻 7-Day Backend Challenge

```text
Day 5
File Upload & Storage Service

Technology Stack:

Node.js
Express.js
MongoDB
Mongoose
Multer
Cloudinary
Postman
```

---

# 📌 Next Step

After the final Git cleanup and commit:

```text
Day 5
   |
   v
Git Commit
   |
   v
GitHub Push
   |
   v
Day 6
```

The next challenge can then be started.

---

# ⭐ Project Summary

This project demonstrates a backend file-management service using:

```text
REST APIs
+
Multipart File Upload
+
Multer
+
Validation
+
Streams
+
Cloud Storage
+
MongoDB Metadata
+
Download
+
Delete
+
Error Handling
+
Security
```

The result is a practical foundation for production-style file handling systems.
