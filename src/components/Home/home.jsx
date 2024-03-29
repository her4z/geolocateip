import React, { Component } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import "./home.css";
const fetch = require("node-fetch");

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ipText: "",
      resultText: "",
      waiting: false,
      waitingAverage: false,
      waitingFarest: false,
      waitingNearest: false,
      showError: false,
      averageResponse: "",
      nearestResponse: "",
      farestResponse: "",
    };
  }

  componentDidMount() {
    this.getNearestCall();
    this.getFarestCall();
    this.getAverageCall();
  }

  getNearestCall() {
    this.setState({ waitingNearest: true });

    fetch("/api/nearestAPICall").then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          this.setState({
            nearestResponse: JSON.stringify(data),
            waitingNearest: false,
          });
        });
      } else {
        this.setState({ waitingNearest: false });
      }
    });
  }

  getFarestCall() {
    this.setState({ waitingFarest: true });

    fetch("/api/farestAPICall").then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          this.setState({
            farestResponse: JSON.stringify(data),
            waitingFarest: false,
          });
        });
      } else {
        this.setState({ waitingFarest: false });
      }
    });
  }

  getAverageCall() {
    this.setState({ waitingAverage: true });

    fetch("/api/averageAPICall").then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          this.setState({
            averageResponse: `${JSON.stringify(data)} KMs`,
            waitingAverage: false,
          });
        });
      } else {
        this.setState({ waitingAverage: false });
      }
    });
  }

  geolocateIP() {
    this.setState({ waiting: true });

    fetch(`/api/geolocateIP/${this.state.ipText}`).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          this.setState({ resultText: JSON.stringify(data) });
        });
      } else {
        this.setState({ showError: true });
        setTimeout(() => {
          this.setState({ showError: false });
        }, 5000);
      }
      this.setState({ waiting: false });
    });
  }

  render() {
    return (
      <div className="home">
        <Typography variant="h1" className="lbl-title">
          Geolocate IP
        </Typography>
        <Typography variant="h2" className="lbl-title">
          API
        </Typography>
        <Paper elevation={3} className="container-searchbar">
          <Grid container className="grid-searchbar">
            <Grid item xs={1} sm={0} />
            <Grid item xs={7} sm={8}>
              <TextField
                label="IP"
                className="txt-search"
                onChange={(e) => this.setState({ ipText: e.target?.value })}
              ></TextField>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={2} sm={1}>
              <LoadingButton
                variant="contained"
                className="btn-search"
                onClick={() => this.geolocateIP()}
                loading={this.state.waiting}
              >
                Search
              </LoadingButton>
            </Grid>
            <Grid item xs={1} />
          </Grid>
          <Collapse in={this.state.showError}>
            <Alert severity="error" className="error-alert">
              Something went wrong, please check your input and try again.
            </Alert>
          </Collapse>
          <TextField
            className="txt-result"
            disabled
            multiline
            style={{
              paddingLeft: "8.5%",
              paddingRight: "10%",
              width: "80%",
              marginTop: "2%",
            }}
            value={this.state.resultText}
          ></TextField>
          <Typography
            variant="h3"
            className="lbl-stats"
            style={{ marginTop: "-15%" }}
          >
            Stats
          </Typography>
          <div>
            <Typography variant="h6" className="lbl-stats-subtitle">
              Average KMs per API Call
            </Typography>
            <TextField
              value={this.state.averageResponse}
              className="txt-stats"
              disabled
              style={{ width: "80%", paddingRight: "5%", paddingLeft: "5%" }}
            ></TextField>
            <LoadingButton
              variant="outlined"
              onClick={() => this.getAverageCall()}
              loading={this.state.waitingAverage}
            >
              Refresh
            </LoadingButton>
          </div>
          <div>
            <Typography variant="h6" className="lbl-stats-subtitle">
              Farest API Call
            </Typography>
            <TextField
              value={this.state.farestResponse}
              className="txt-stats"
              disabled
              style={{ width: "80%", paddingRight: "5%", paddingLeft: "5%" }}
            ></TextField>
            <LoadingButton
              variant="outlined"
              onClick={() => this.getFarestCall()}
              loading={this.state.waitingFarest}
            >
              Refresh
            </LoadingButton>
          </div>
          <div>
            <Typography variant="h6" className="lbl-stats-subtitle">
              Nearest API Call
            </Typography>
            <TextField
              value={this.state.nearestResponse}
              className="txt-stats"
              disabled
              style={{ width: "80%", paddingRight: "5%", paddingLeft: "5%" }}
            ></TextField>
            <LoadingButton
              variant="outlined"
              onClick={() => this.getNearestCall()}
              loading={this.state.waitingNearest}
            >
              Refresh
            </LoadingButton>
          </div>
        </Paper>
      </div>
    );
  }
}
