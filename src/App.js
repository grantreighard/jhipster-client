import React from 'react';
import './App.css';
import { Route, Link } from 'react-router-dom';
import axios from 'axios';
import HelloPerson from './components/HelloPerson';
import ListAll from './components/ListAll';
import IndividualGreeting from './components/IndividualGreeting';
import AddNew from './components/AddNew';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      people: [],
      idToken: 0
    }
  }
  componentDidMount = () => {
    axios
        .post('http://localhost:8080/api/authenticate', {
            'password': 'admin',
            'username': 'admin'
        })
        .then(response => {
            this.setState({ idToken: response.data.id_token });
            const headers = {
                headers: {
                    'Authorization': `Bearer ${this.state.idToken}`
                }
            };
            axios
                .get('http://localhost:8080/services/microservice/api/say-hello-worlds', headers)
                .then(res => {
                    this.setState({ people: res.data });
                });
            });
}
  
  render () {
    console.log(this.state.people);
    return (
      <div className="App">
        <Route exact path="/" render={() => <HelloPerson people={this.state.people} token={this.state.idToken}/>} />
        <Route exact path="/" render={() => <Link to="/listAll">Show all greetings</Link>}/>
        <Route exact path="/listAll" render={() => <Link to="/">Home</Link>}/>
        <Route exact path="/listAll" render={() => <Link to="/addNew">Add new</Link>}/>
        <Route path="/listAll" render={() => <ListAll people={this.state.people} cdm={this.componentDidMount}/>} />
        <Route path="/addNew" render={() => <AddNew />} />
        <Route path="/greeting/:id" render={(props) => <IndividualGreeting {...props} people={this.state.people}/>}/>
        
      </div>
    );
  }
}
