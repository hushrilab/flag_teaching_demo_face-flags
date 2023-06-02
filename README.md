# Dr.,r Happy Face & Flag Display

* Author: Cheng Tang <c225tang@uwaterloo.ca>

This is a React App displaying the robot's face and flags interchangeably. 

## Installation

Please make sure to have NodeJS, http server, and rosbridge sever installed.

NodeJS:

Create a new folder to contain your NodeJS installation files:

`mkdir -p ~/webpage_ws/nvm`

Export that path:

`export NVM_DIR="/home/user/webpage_ws/nvm"`

Install nvm:

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash`

Source your terminal:

`source .bashrc`

Install v14:

`nvm install v14`

HTTP server:

`npm install -g http-server`

rosbridge server:

`apt-get install ros-<ROSDISTRO>-rosbridge-server`

## Available Scripts

Get into the app directory by executing in the project root directory:

#### `cd drr_faces_flags`

Install roslib using npm package manager:

#### `npm install roslib`

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

Then, start the rosbridge server by executing: 

#### `roslaunch rosbridge_server rosbridge_websocket.launch`

Publish String "happy" into `/expression` topic will switch the robot to happy face animation:

#### `rostopic pub /expression std_msgs/String "data: 'happy'"`

Publish any String other than "happy" into `/expression` topic will switch the robot to smiley face animation:

#### `rostopic pub /expression std_msgs/String "data: 'smile'"`

Publish any String into `/next_country` topic will switch the screen to the next country from either a face or a flag:

#### `rostopic pub /next_country std_msgs/String "data: ''"`

Publish string "correct" into `/audio` topic will play an audio confirming the correctness of the answer and reiterate the name of the country of the flag shown on the screen:

#### `rostopic pub audio std_msgs/String "data: 'correct'"`

Publish string "incorrect" into `/audio` topic will play an audio stating the incorrectness of the answer and reveal the name of the country of the flag shown on the screen:

#### `rostopic pub audio std_msgs/String "data: 'incorrect'"`

Publish string "intro" into `/audio` topic will play an introduction to the game audio:

#### `rostopic pub audio std_msgs/String "data: 'intro'"`

Publish string "ask" into `/audio` topic will play an audio asking for someone to shout out an answer:

#### `rostopic pub audio std_msgs/String "data: 'ask'"`

Publish string "end" into `/audio` topic will play an audio concluding the game:

#### `rostopic pub audio std_msgs/String "data: 'end'"`
