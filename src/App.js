import React from "react";
import {Text, View, SafeAreaView} from "react-native";

import Button from "./components/Button";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: undefined,

      score: 0,
      stage: 0,
      game: false,
      // timer
      startTime: undefined,
      endTime: undefined
    };
  }

  getQuestions() {
    fetch("https://opentdb.com/api.php?amount=10")
      .then(res => res.json())
      .then(data => this.setState({questions: data.results}))
      .catch(error => console.log(error));
  }

  createAnswers(incorrect_answers, correct_answer) {
    let answers = [];
    if (incorrect_answers.length > 1) {
      incorrect_answers.map((el, i) => answers.push(<Button key={i} left title={el} action={() => this.actionIncorrectAnswer()} />));
    } else {
      answers.push(<Button key={0} left title={incorrect_answers[0]} action={() => this.actionIncorrectAnswer()} />);
    }
    answers.push(<Button key={3} left title={correct_answer} action={() => this.actionCorrectAnswer()} />)

    // make them random in the array
    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
    return shuffle(answers);
  }

  actionCorrectAnswer() {
    this.setState({score: this.state.score + 1, stage: this.state.stage + 1});
    this.endTimer();
  }

  actionIncorrectAnswer() {
    this.setState({stage: this.state.stage + 1});
    this.endTimer();
  }

  startGame() {
    // get the questions and start the game
    this.getQuestions();
    this.setState({game: true});

    this.startTimer();
  }

  playAgain() {
    // get the questions and reset the stats
    this.setState({stage: 0, score: 0, questions: undefined});
    this.getQuestions();

    this.startTimer();
  }

  startTimer() {
    this.setState({startTime: new Date()});
  }

  endTimer() {
    this.setState({endTime: new Date()});
  }

  getTimeElapsed() {
    let timeDiff = (this.state.endTime - this.state.startTime) / 1000;
    return Math.round(timeDiff);
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
        <View style={{flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
          {/* If the game is on or display starting screen */}
          {!this.state.game ?
          <View>
            <Text style={{fontSize: 24, marginBottom: 32}}>Welcome to Quiz App!</Text>

            <Button title="Start Quiz" action={() => this.startGame()} />
          </View> :

          // If the questions are loaded you can play
          // As long as the there are question left go through them
          this.state.questions ? this.state.questions.length !== this.state.stage ? (<View style={{width: "90%"}}>
            <Text style={{fontSize: 24, marginBottom: 4}}>Score: {this.state.score}</Text>
            <Text style={{fontSize: 24, marginBottom: 16}}>Question: {this.state.stage + 1}/{this.state.questions.length}</Text>
            <Text style={{textAlign: "center", marginBottom: 8}}>{this.state.questions[this.state.stage].question}</Text>

            {this.createAnswers(this.state.questions[this.state.stage].incorrect_answers, this.state.questions[this.state.stage].correct_answer)}
          </View>) :
          // The player answered all questions
          (<View>
            <Text style={{fontSize: 24, marginBottom: 4}}>Your score was {this.state.score}</Text>
            <Text style={{fontSize: 24, marginBottom: 32}}>You finshed in {this.getTimeElapsed()}s</Text>
            <Button title="Play again" action={() => this.playAgain()} />
          </View>) :
          // A loading screen while the fetch request is made
          (<View>
            <Text style={{fontSize: 24}}>Loading...</Text>
          </View>)}
        </View>
      </SafeAreaView>
    );
  }
}

export default App;
