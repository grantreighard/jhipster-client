import React from 'react';
import axios from 'axios';
import world from '../img/world.gif';

export default class HelloPerson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            people: [],
            idToken: 0,
            search: '',
            firstName: '',
            lastName: '',
            salutation: ''
        }

        this.randomIndex = Math.floor(Math.random()*10);
    }

    handleInputChange = (e) => {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value})
    }

    searchDB = (e) => {
        e.preventDefault();
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
            .get(`http://localhost:8080/services/microservice/api/_search/say-hello-worlds?query=${this.state.search}`, headers)
            .then(res => {
                console.log(res.data);
                if (res.data.length) {
                    this.setState({salutation: res.data[0].salutation, firstName: res.data[0].firstName, lastName: res.data[0].lastName});
                } else {
                    this.randomIndex = Math.floor(Math.random()*this.props.people.length);
                    this.setState({salutation: '', firstName: '', lastName: ''});
                }
            })
        });

}

    render() {
        console.log(this.randomIndex);
        return (
            this.props.people.length ?
            <div>
                {this.state.salutation.length ?
                <h1>
                    {this.state.salutation}, {this.state.firstName} {this.state.lastName}!
                </h1> :
                <h1>
                    {this.props.people[this.randomIndex].salutation}, {this.props.people[this.randomIndex].firstName} {this.props.people[this.randomIndex].lastName}!
                </h1>}
                <img src={world}/>

                <form onSubmit={this.searchDB}>
                    <input name="search" value={this.state.search} placeholder="first or last name" onChange={this.handleInputChange}/>
                    <button type="submit">Submit</button>
                </form>
            </div>
            :
            <div>loading...</div>
        )
    }
}