<div align="center">
<img src="public/images/logo_black.png" alt="carGo" title="carGo logo" />

[![NodeJS Version](https://img.shields.io/badge/node-%3E%3Dv12.16.3-blue)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/version-0.1.0-green)](https://gitlab.com/tadejlahovnik/carGo)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

**_Cargo transportation ordering service_**
</div>

## Installation
Clone the repository and install dependencies:
```
$ git clone https://gitlab.com/tadejlahovnik/carGo.git
$ cd carGo
$ npm install --production
```
## Usage
Database back-end and http port can be changed from default values (database: `MySQL`, http port: `3000`) with environment variables `DATABASE` and `PORT`.

For database back-end you can choose between `MySQL` and `SQLite` (Needs node package `sqlite3` and development dependencies).

#### Windows (PowerShell)
```
> $env:DATABASE="SQLite"; $env:PORT=8080
> node cargo.js
```
#### Linux/Unix/MacOS
```
$ DATABASE=SQLite PORT=8080 node cargo.js
```
or
```
$ export DATABASE=SQLite PORT=8080
$ node cargo.js
```
## Development
Install development dependencies:
```
$ npm install
```
Start `cargo.js` with [Nodemon](https://nodemon.io/):
```
$ npm install -g nodemon
$ nodemon --watch routes --watch views --watch config --ext js,html cargo.js
```
## License
> You can check out the full license [here](LICENSE)

This project is licensed under the terms of the **MIT** license.
