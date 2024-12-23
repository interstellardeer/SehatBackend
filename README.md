# Sehat Backend

Sehat is the backend service for our school project aimed at providing healthcare solutions. This README provides instructions for setting up and running the project locally.

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your system.
- [XAMPP](https://www.apachefriends.org/) or any similar MySQL server.

## Installation

1. Clone the repository:

```bash
    git clone <repository-url>
```

2. Navigate to the project directory:

```bash
    cd sehat
```

3. Install the required dependencies:

```bash
    npm install
```

4. Ensure MySQL is running using XAMPP or any MySQL server.

### Configure the Database Connection

Update the `server.js` file to match your MySQL configuration:

```javascript
const db = mysql.createConnection({
    host: 'localhost', // Your MySQL host
    user: 'root',      // Your MySQL username
    password: '',      // Your MySQL password
    database: 'sehat', // Replace with your database name
    port: 3306         // Specify the port explicitly (optional, default is 3306)
});
```

## Usage

1. Start the server:

```bash
    node server.js
```

2. Access the backend API documentation at:

```
http://localhost:5000/docs/
```

## Customization

If you need to use a different port for MySQL or the backend server:

- Adjust the `port` in the database connection configuration in `server.js`.
- Modify the backend server's listening port in `server.js` as needed.

## Notes

- Make sure the database `sehat` is set up and populated with the necessary tables and data before starting the server.
- If the default ports are already in use, update the configuration accordingly.

## License

This project is for educational purposes only.
