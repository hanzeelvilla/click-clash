# CLICK CLASH

Click Clash is a two-player competition where participants race to click a button faster than their opponent to reach a target score. This project uses [Johnny-Five](https://johnny-five.io/) to integrate hardware components with software, creating an interactive and fast-paced game.

## Hardware

| **QUANTITY** |   **NAME**   |
|:------------:|:------------:|
|       1      | Arduino Nano |
|       1      |      Led     |
|       1      |  Push Button |

## Prerequisites

- [Node.js (Prefer LTS!)](https://nodejs.org/es)
- [Arduino IDE 2](https://docs.arduino.cc/software/ide-v2/tutorials/getting-started/ide-v2-downloading-and-installing/)

## Setup and Configuration

1. Clone the repository

```bash
git clone https://github.com/hanzeelvilla/click-clash.git
```

2. Upload `StandardFirmata` to your Arduino

- Open the Arduino IDE
- Navigate to `File > Examples > Firmata > StandardFirmata`
- Connect your Arduino Nano and upload the sketch

3. Install the dependecies

```bash
cd click-clash
npm i
```

4. Run the application

```bash
npm run dev
```
