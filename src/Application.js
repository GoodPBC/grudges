import React, { Component } from "react";
import NewGrudge from "./NewGrudge";
import Grudges from "./Grudges";
import "./Application.css";

import { API } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";

class Application extends Component {
  state = {
    grudges: []
  };
  // as soon as Application mounts this method gets called on the component
  componentDidMount() {
    // console.log("I am the Application Component");

    // Get request to our API to retrieve ALL grudges
    API.get("GrudgesCRUD", "/Grudges").then(grudges => {
      console.log("GET ALL grudges from API", {
        grudges
      });
    });
  }

  addGrudge = grudge => {
    API.post("GrudgesCRUD", "/Grudges", { body: grudge }).then(() => {
      this.setState({
        grudges: [grudge, ...this.state.grudges]
      });
    });
  };

  removeGrudge = grudge => {
    this.setState({
      grudges: this.state.grudges.filter(other => other.id !== grudge.id)
    });
  };

  toggle = grudge => {
    const othergrudges = this.state.grudges.filter(
      other => other.id !== grudge.id
    );
    const updatedGrudge = {
      ...grudge,
      avenged: !grudge.avenged
    };
    this.setState({
      grudges: [updatedGrudge, ...othergrudges]
    });
  };

  render() {
    const { grudges } = this.state;
    const unavengedgrudges = grudges.filter(grudge => !grudge.avenged);
    const avengedgrudges = grudges.filter(grudge => grudge.avenged);

    return (
      <div className="Application">
        <NewGrudge onSubmit={this.addGrudge} />{" "}
        <Grudges
          title="Unavenged Grudges"
          grudges={unavengedgrudges}
          onCheckOff={this.toggle}
          onRemove={this.removeGrudge}
        />{" "}
        <Grudges
          title="Avenged Grudges"
          grudges={avengedgrudges}
          onCheckOff={this.toggle}
          onRemove={this.removeGrudge}
        />{" "}
      </div>
    );
  }
}

export default withAuthenticator(Application);
