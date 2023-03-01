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


import CorrectAudio from './flag_audios/0correct_answer.mp3';
import AskAudio from './flag_audios/0do_you_have_answer.mp3';
import IncorrectAudio from './flag_audios/0wrong_answer.mp3';
import IntroAudio from './flag_audios/1Flags_intro.mp3';
import StartAudio from './flag_audios/2start_game.mp3';
import EndAudio from './flag_audios/3end_thank_you.mp3';
import ArgentinaAudio from './flag_audios/argentina.mp3';
import BoliviaAudio from './flag_audios/bolivia.mp3';
import BrazilAudio from './flag_audios/brazil.mp3';
import CanadaAudio from './flag_audios/canada.mp3';
import ChileAudio from './flag_audios/chile.mp3';
import ColumbiaAudio from './flag_audios/columbia.mp3';
import EcadorAudio from './flag_audios/ecuador.mp3';
import GermanyAudio from './flag_audios/germany.mp3';
import GuyanaAudio from './flag_audios/guyana.mp3';
import IranAudio from './flag_audios/iran.mp3';
import ItalyAudio from './flag_audios/italy.mp3';
import MexicoAudio from './flag_audios/mexico.mp3';
import ParaguayAudio from './flag_audios/paraguay.mp3';
import PeruAudio from './flag_audios/peru.mp3';
import SurinameAudio from './flag_audios/suriname.mp3';
import UruguayAudio from './flag_audios/uruguay.mp3';
import USAAudio from './flag_audios/usa.mp3';
import VenezuelaAudio from './flag_audios/venezuela.mp3';

function ImageSequence() {
  const [faceIndex, setFaceIndex] = useState(0);
  const [flagIndex, setFlagIndex] = useState(0);
  const [isHappy, setIsHappy] = useState(true);
  const [isFace, setIsFace] = useState(true);
  const [audioCase, setAudioCase] = useState(-1);
  const smile_faces = [smile_01, smile_02, smile_03, smile_04, smile_05];
  const happy_faces = [happy_01, happy_02, happy_03, happy_04, happy_05];
  const flags = [Argentina, Bolivia, Brazil, Canada, Chile,
    Columbia, Ecador, Germany, Guyana, Iran, Italy, Mexico,
    Paraguay, Peru, Suriname, Uruguay, USA, Venezuela];
  const CountryAudios = [ArgentinaAudio, BoliviaAudio, BrazilAudio,
    CanadaAudio, ChileAudio, ColumbiaAudio, EcadorAudio,
    GermanyAudio, GuyanaAudio, IranAudio, ItalyAudio,
    MexicoAudio, ParaguayAudio, PeruAudio, SurinameAudio,
    UruguayAudio, USAAudio, VenezuelaAudio];

  useEffect(() => {
    // Connecting to ROS
    const ros = new ROSLIB.Ros({
      url: 'ws://127.0.0.1:9090'
    });

    ros.on('connection', function () {
      console.log('Connected to websocket server.');
    });

    ros.on('error', function (error) {
      console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function () {
      console.log('Connection to websocket server closed.');
    });

    const expression = new ROSLIB.Topic({
      ros: ros,
      name: '/expression',
      messageType: 'std_msgs/String'
    });

    const next_country = new ROSLIB.Topic({
      ros: ros,
      name: '/next_country',
      messageType: 'std_msgs/String'
    });

    expression.subscribe(function (message) {
      setIsHappy(message.data === 'happy');
      setIsFace(true);
    });

    const audio_topic = new ROSLIB.Topic({
      ros: ros,
      name: '/audio',
      messageType: 'std_msgs/String'
    });

    next_country.subscribe(function (message) {
      setFlagIndex((flagIndex) => (flagIndex + 1));
      setIsFace(false);
    });

    audio_topic.subscribe(function (message) {
      if (message.data === "correct") {
        setAudioCase(0);
      } else if (message.data === "incorrect") {
        setAudioCase(1);
      } else if (message.data === "intro") {
        setAudioCase(2);
      } else if (message.data === "end") {
        setAudioCase(3);
      } else if (message.data === "ask") {
        setAudioCase(4);
      }
    });

    return () => {
      expression.unsubscribe();
      next_country.unsubscribe();
      audio_topic.unsubscribe();
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

  useEffect(() => {
    const feedbackPlayer = new Audio();
    const countryPlayer = new Audio();
    const introPlayer = new Audio();
    const startPlayer = new Audio();
    const endPlayer = new Audio();
    const askPlayer = new Audio();

    if (audioCase === 0) {
      feedbackPlayer.src = CorrectAudio;
      feedbackPlayer.play();
      feedbackPlayer.onended = function () {
        feedbackPlayer.pause();
      };
      setTimeout(() => {
        countryPlayer.src = CountryAudios[flagIndex];
        countryPlayer.play();
        countryPlayer.onended = function () {
          countryPlayer.pause();
        };
      }, 2500);
      setAudioCase(-1);
    } else if (audioCase === 1) {
      feedbackPlayer.src = IncorrectAudio;
      feedbackPlayer.play();
      feedbackPlayer.onended = function () {
        feedbackPlayer.pause();
      };
      setTimeout(() => {
        countryPlayer.src = CountryAudios[flagIndex];
        countryPlayer.play();
        countryPlayer.onended = function () {
          countryPlayer.pause();
        };
      }, 2500);
      setAudioCase(-1);
    } else if (audioCase === 2) {
      introPlayer.src = IntroAudio;
      introPlayer.play();
      introPlayer.onended = function () {
        introPlayer.pause();
      };
      setTimeout(() => {
        startPlayer.src = StartAudio;
        startPlayer.play();
        startPlayer.onended = function () {
          startPlayer.pause();
        };
      }, 10000);
      setAudioCase(-1);
    } else if (audioCase === 3) {
      endPlayer.src = EndAudio;
      endPlayer.play();
      endPlayer.onended = function () {
        endPlayer.pause();
      };
      setAudioCase(-1);
    } else if (audioCase === 4) {
      askPlayer.src = AskAudio;
      askPlayer.play();
      askPlayer.onended = function () {
        askPlayer.pause();
      };
      setAudioCase(-1);
    }
  }, [audioCase]);

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