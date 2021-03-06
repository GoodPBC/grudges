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
      this.setState({
        grudges
      });
      console.log({
        grudges
      });
    });
  }

  addGrudge = grudge => {
    API.post("GrudgesCRUD", "/Grudges", {
      body: grudge
    }).then(() => {
      this.setState({
        grudges: [grudge, ...this.state.grudges]
      });
    });
  };

  removeGrudge = grudge => {
    API.del("GrudgesCRUD", "/Grudges/object/" + grudge.id).then(() => {
      this.setState({
        grudges: this.state.grudges.filter(other => other.id !== grudge.id)
      });
    });
  };

  toggle = grudge => {
    // create new value for updated grudge
    const updatedGrudge = {
      //take all of the properties of given grudge  & copying them
      ...grudge,
      //We take the avenged property and flip it to the opposite of what it was
      avenged: !grudge.avenged
    };
    // we PUT to the API the...
    API.put("GrudgesCRUD", "/Grudges", {
      //request body of the updatedGrudge
      body: updatedGrudge
      //then
    }).then(() => {
      //we update the application state with updatedGrudges by using filter to replace the old grudge with the new grudge
      const othergrudges = this.state.grudges.filter(
        other => other.id !== grudge.id
      );
      this.setState({
        grudges: [updatedGrudge, ...othergrudges]
      });
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
