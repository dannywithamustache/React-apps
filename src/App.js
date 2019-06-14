import React from "react";
import "./index.css";

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionTime: 1500,
      breakTime: 300
    };
    this.breakTime = 300;
    this.sessionTime = 1500;
    this.paused = false;
    this.sessionStarted = false;
    this.breakStarted = false;
    this.roundStarted = false;
    this.round = 1;
    this.audio = new Audio(
      "https://jpk-image-hosting.s3.amazonaws.com/pomodoro-app/audio/start.mp3"
    );
  }

  //convert milliseconds to 00:00 format
  calculateTime = time => {
    return `${
      time / 60 > 9 ? Math.floor(time / 60) : "0" + Math.floor(time / 60)
    }:${time % 60 > 9 ? "" + (time % 60) : "0" + (time % 60)}`;
  };
  //not a button function, stop when timer is done.
  stopTimer = timer => {
    clearInterval(timer);
    timer = null;
  };
  //start session timer
  handleStart = () => {
    this.sessionStarted = true;
    if (!this.roundStarted) {
      //trying to make rounds change and session timer true for duration of all rounds
      this.roundStarted = true;
      this.timer = setInterval(() => {
        this.setState({ sessionTime: (this.state.sessionTime -= 1) });
      }, 1000);
    }
  };
  handleBreak = length => {
    this.breakStarted = true;
    this.breakTimer = setInterval(() => {
      this.setState({ breakTime: (length -= 1) });
    }, 1000);
  };
  //play sound and change timer when session/break is complete
  componentDidUpdate = () => {
    if (this.state.sessionTime < 0) {
      this.audio.play();
      this.stopTimer(this.timer);
      this.roundStarted = true;
      if (!this.breakStarted) {
        this.breakStarted = true;
        this.setState({ sessionTime: this.sessionTime });
        this.handleBreak(this.state.breakTime);
      }
    } else if (this.state.sessionTime < 0 && this.round === 4) {
      this.audio.play();
      this.round = 1;
      this.stopTimer(this.timer);
      if (!this.breakStarted) {
        this.breakStarted = true;
        this.setState({ sessionTime: this.sessionTime });
        this.handleBreak(this.state.breakTime * 3);
      }
    }
    if (this.state.breakTime < 0 && this.round < 4) {
      this.audio.play();
      this.stopTimer(this.breakTimer);
      this.breakStarted = false;
      this.roundStarted = false;
      this.handleStart();
      this.setState({ breakTime: this.breakTime });
      this.round += 1;
    } else if (this.state.breakTime < 0 && this.round === 4) {
      this.audio.play();
      this.stopTimer(this.breakTimer);
      this.handleReset();
      this.handleStart();
    }
  };
  handlePause = () => {
    if (!this.paused) {
      if (this.sessionStarted) {
        this.paused = true;
        clearInterval(this.timer);
        this.setState(this.state);
      }
      if (this.breakStarted) {
        this.paused = true;
        clearInterval(this.breakTimer);
        this.setState(this.state);
      }
    }
  };
  handleResume = () => {
    if (this.paused) {
      if (!this.breakStarted) {
        this.paused = false;
        this.timer = setInterval(() => {
          this.setState({ sessionTime: (this.state.sessionTime -= 1) });
        }, 1000);
        this.setState(this.state);
      }
      if (this.breakStarted) {
        this.paused = false;
        this.break = setInterval(() => {
          this.setState({ breakTime: (this.state.breakTime -= 1) });
        }, 1000);
        this.setState(this.state);
      }
    }
  };
  handleReset = () => {
    clearInterval(this.timer);
    clearInterval(this.breakTimer);
    this.breakTimer = null;
    this.timer = null;
    this.setState({
      sessionTime: 1500,
      breakTime: 300
    });
    this.breakTime = 300;
    this.sessionTime = 1500;
    this.paused = false;
    this.sessionStarted = false;
    this.breakStarted = false;
    this.roundStarted = false;
    this.round = 1;
    this.audio.pause();
    this.audio.currentTime = 0;
  };
  increaseSession = () => {
    if (!this.sessionStarted) {
      if (this.state.sessionTime < 3600) {
        this.setState({ sessionTime: (this.state.sessionTime += 60) });
        this.sessionTime = this.state.sessionTime;
      }
    }
  };
  //after component update added clicking dec after value= 1 obj error thrown
  decreaseSession = () => {
    if (!this.sessionStarted) {
      if (this.state.sessionTime > 100) {
        this.setState({ sessionTime: (this.state.sessionTime -= 60) });
        this.sessionTime = this.state.sessionTime;
      }
    }
  };
  increaseBreak = () => {
    if (!this.sessionStarted) {
      if (this.state.breakTime < 3600) {
        this.setState({
          breakTime: (this.state.breakTime += 60)
        });
        this.breakTime = this.state.breakTime;
      }
    }
  };
  decreaseBreak = () => {
    if (!this.sessionStarted) {
      if (this.state.breakTime > 100) {
        this.setState({
          breakTime: (this.state.breakTime -= 60)
        });
        this.breakTime = this.state.breakTime;
      }
    }
  };

  render() {
    return (
      <div id="clock" className="container-fluid">
        <div id="timer-label">
          {this.roundStarted && !this.breakStarted
            ? "Session Started"
            : this.breakStarted
            ? "Break Time"
            : "Pomodoro"}
          <div id="time-left">
            {this.breakStarted
              ? this.calculateTime(this.state.breakTime)
              : this.calculateTime(this.state.sessionTime)}
          </div>
        </div>
        <div id="incButtons">
          <div>
            <div id="session-label">Session length</div>
            <div
              id="session-increment"
              className="inc btn fas fa-sort-up"
              onClick={this.increaseSession}
            />
            <div id="session-length">{this.sessionTime / 60}</div>
            <div
              id="session-decrement"
              className="inc btn fas fa-sort-down"
              onClick={this.decreaseSession}
            />
          </div>
          <div>
            <div id="break-label">Break length</div>
            <div
              id="break-increment"
              className="inc btn fas fa-sort-up"
              onClick={this.increaseBreak}
            />
            <div id="break-length">{this.breakTime / 60}</div>
            <div
              id="break-decrement"
              className="inc btn fas fa-sort-down"
              onClick={this.decreaseBreak}
            />
          </div>
        </div>
        <div id="buttons">
          <button
            id="start_stop"
            className="btn"
            onClick={
              !this.sessionStarted
                ? this.handleStart
                : !this.paused
                ? this.handlePause
                : this.handleResume
            }
          >
            {this.paused ? "Resume" : this.sessionStarted ? "Pause" : "Start"}
          </button>
          <button
            id="reset"
            className="btn btn-warning"
            onClick={this.handleReset}
          >
            Reset
          </button>
        </div>
        <audio
          id="beep"
          preload="auto"
          src="https://jpk-image-hosting.s3.amazonaws.com/pomodoro-app/audio/start.mp3"
          ref={audio => {
            this.audio = audio;
          }}
        />
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div id="container">
        <Timer />
      </div>
    );
  }
}

export default App;
