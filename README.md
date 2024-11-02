
```markdown
# 🗂️ File Management System (FMS)

A secure and efficient file management system that allows users to upload, encrypt, decrypt, and manage their files with passcode-based authentication. This application ensures that sensitive files are protected through encryption, providing a layer of security for users' data.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Features

- **File Upload**: Users can easily upload files of various formats.
- **Encryption & Decryption**: Files can be encrypted with a user-defined passcode, ensuring confidentiality.
- **Passcode Authentication**: Access to encrypted files requires the correct passcode, protecting sensitive information.
- **File Management**: Users can view, share, and manage their uploaded files efficiently.
- **Error Handling**: Comprehensive error handling ensures smooth operation and user feedback.

## ⚙️ Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Encryption**: AES-256-CBC
- **File System**: Local file storage
- **Dependencies**: 
  - mongoose
  - crypto
  - multer (for file uploads)

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/fms.git
   cd fms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the necessary configurations, including your MongoDB URI.

4. **Run the application**:
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`.

## 📖 Usage

### API Endpoints

| Method | Endpoint                          | Description                             |
|--------|-----------------------------------|-----------------------------------------|
| POST   | `/upload`                         | Uploads a file                          |
| POST   | `/encrypt/:id`                   | Encrypts the specified file             |
| POST   | `/decrypt/:id`                   | Decrypts the specified file             |
| GET    | `/files/:id`                     | Retrieves the specified file            |
| GET    | `/files/shared`                  | Retrieves shared files                  |
| GET    | `/files/encrypted`               | Retrieves encrypted files                |

### 💡 Example Request

To encrypt a file, send a POST request to `/encrypt/:id` with the following JSON body:

```json
{
  "passcode": "your_secure_passcode"
}
```

To decrypt a file, send a POST request to `/decrypt/:id` with the same structure.

## 🔍 How It Works

1. **File Upload**: Users upload files which are stored on the server.
2. **Encryption**: Upon encryption request, the system generates a random IV and uses the provided passcode to encrypt the file. The encrypted file is stored alongside its IV.
3. **Decryption**: To access an encrypted file, users must provide the correct passcode. The system uses the stored IV and passcode to decrypt the file, allowing secure access to its contents.

## 🤝 Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

For any questions or issues, feel free to open an issue or reach out! 😊
```
