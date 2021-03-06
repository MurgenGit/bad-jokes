import React, { Component } from 'react';
import axios from 'axios';
import uuid from 'uuid/v4';

import './JokeList.css';
import Joke from './Joke';

export default class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10
  }
  state = {
    jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]") 
  }
   componentDidMount() {
    if(this.state.jokes.length === 0) this.getJokes()
  }
  async getJokes() {
    let jokes = [];
    while(jokes.length < this.props.numJokesToGet){
      let res = await axios.get("https://icanhazdadjoke.com/", { headers : { Accept: "application/json" }});
      jokes.push({ id: uuid(), text: res.data.joke, votes: 0 })
    }
    this.setState(st => ({
      loading: false,
      jokes: [...this.state.jokes, ...jokes]
    }),
    () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes)))
  }
  handleVote(id, delta) {
    this.setState(st => ({
      jokes: st.jokes.map(j => 
        j.id === id ? { ...j, votes: j.votes + delta } : j 
      )
    }),
    () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }
  handleClick = () => {
    this.setState({loading: true}, this.getJokes)
  }
  render() {
    if(this.state.loading) {
      return (
        <div className="JokeList-spinner">
          <i className="far fa-8x fa-laugh fa-spin" />
          <h2 className="JokeList-title">Loading...</h2>
        </div>
      )
    }
    let jokes = this.state.jokes.sort((a,b) => b.votes - a.votes);
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title"><span>Bad </span>Jokes!</h1>
          <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt="smilte!"/>
          <button 
            className="JokeList-getmore" 
            onClick={this.handleClick}>
              New Jokes
          </button>
        </div>
        <div className="JokeList-jokes">
          {jokes.map(j => (
            <Joke 
              key={j.id} 
              votes={j.votes} 
              text={j.text} 
              upvote={() => this.handleVote(j.id, 1)}
              downvote={() => this.handleVote(j.id, -1)}
            />
          ))}
        </div>        
      </div>
    )
  }
}