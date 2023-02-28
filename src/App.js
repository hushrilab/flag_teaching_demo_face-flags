import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';
import smile_01 from './smile/smile_01.jpg';
import smile_02 from './smile/smile_02.jpg';
import smile_03 from './smile/smile_03.jpg';
import smile_04 from './smile/smile_04.jpg';
import smile_05 from './smile/smile_05.jpg';
import happy_01 from './happy/happy_01.jpg';
import happy_02 from './happy/happy_02.jpg';
import happy_03 from './happy/happy_03.jpg';
import happy_04 from './happy/happy_04.jpg';
import happy_05 from './happy/happy_05.jpg';
import Argentina from './flags/Argentina.jpg';
import Bolivia from './flags/Bolivia.jpg';
import Brazil from './flags/Brazil.jpg';
import Canada from './flags/Canada.jpg';
import Chile from './flags/Chile.jpg';
import Columbia from './flags/Columbia.jpg';
import Ecador from './flags/Ecador.jpg';
import Germany from './flags/Germany.jpg';
import Guyana from './flags/Guyana.jpg';
import Iran from './flags/Iran.jpg';
import Italy from './flags/Italy.jpg';
import Mexico from './flags/Mexico.jpg';
import Paraguay from './flags/Paraguay.jpg';
import Peru from './flags/Peru.jpg';
import Suriname from './flags/Suriname.jpg';
import Uruguay from './flags/Uruguay.jpg';
import USA from './flags/USA.jpg';
import Venezuela from './flags/Venezuela.jpg';

function ImageSequence() {
  const [faceIndex, setFaceIndex] = useState(0);
  const [flagIndex, setFlagIndex] = useState(0);
  const [isHappy, setIsHappy] = useState(true);
  const [isFace, setIsFace] = useState(true);
  const smile_faces = [smile_01, smile_02, smile_03, smile_04, smile_05];
  const happy_faces = [happy_01, happy_02, happy_03, happy_04, happy_05];
  const flags = [Argentina, Bolivia, Brazil, Canada, Chile,
    Columbia, Ecador, Germany, Guyana, Iran, Italy, Mexico, 
    Paraguay, Peru, Suriname, Uruguay, USA, Venezuela];

  useEffect(() => {
    // Connecting to ROS
    const ros = new ROSLIB.Ros({
      url : 'ws://127.0.0.1:9090'
    });

    ros.on('connection', function() {
      console.log('Connected to websocket server.');
    });

    ros.on('error', function(error) {
      console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function() {
      console.log('Connection to websocket server closed.');
    });

    const expression = new ROSLIB.Topic({
      ros : ros,
      name : '/expression',
      messageType : 'std_msgs/String'
    });

    const next_country = new ROSLIB.Topic({
      ros : ros,
      name : '/next_country',
      messageType : 'std_msgs/String'
    });

    expression.subscribe(function(message) {
      setIsHappy(message.data === 'happy');
      setIsFace(true);
    });

    next_country.subscribe(function(message) {
      setFlagIndex((flagIndex) => (flagIndex + 1));
      setIsFace(false);
    });

    return () => {
      expression.unsubscribe();
      next_country.unsubscribe();
      ros.close();
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const faces = isHappy ? happy_faces : smile_faces;
      setFaceIndex((faceIndex) => (faceIndex + 1) % faces.length);
    }, 300);

    return () => clearInterval(intervalId);
  }, [isHappy, faceIndex, flagIndex, isFace]);

  const faces = isHappy ? happy_faces : smile_faces;

  return <img src={isFace ? faces[faceIndex] : flags[flagIndex]} style={{ width: '100%', height: 'auto' }} />;
}


function App() {
  return (
    <div className="App">
      <ImageSequence />
    </div>
  );
}

export default App;