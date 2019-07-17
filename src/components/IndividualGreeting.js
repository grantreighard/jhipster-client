import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class IndividualGreeting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            salutation: '',
            id: 1
        }
    }

    componentDidMount = () => {
        const {id} = this.props.match.params;

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
                .get(`http://localhost:8080/services/microservice/api/say-hello-worlds/${id}`, headers)
                .then(res => {
                    this.setState({ salutation: res.data.salutation, firstName: res.data.firstName, lastName: res.data.lastName, id: id });
                });
            });
    }

    handleInputChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    updateGreeting = (e) => {
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
                    .put(`http://localhost:8080/services/microservice/api/say-hello-worlds/`, this.state, headers)
                    .then(res => {
                        this.setState({ salutation: res.data.salutation, firstName: res.data.firstName, lastName: res.data.lastName });
                    });
                });
    }

    delete = (e) => {
        e.preventDefault();
        const {id} = this.props.match.params;
        
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
                    .delete(`http://localhost:8080/services/microservice/api/say-hello-worlds/${id}`, headers)
                    .then(res => {
                        this.props.history.push("/listAll")
                    });
                });
    }
    
    render() {
        return(
            <div>
                {
                    this.props.people.length ?
                <div>
                <h1>{this.state.salutation}, {this.state.firstName} {this.state.lastName}</h1>
                <form onSubmit={this.updateGreeting}>
                    <input type="text" name="salutation" value={this.state.salutation} onChange={this.handleInputChange} placeholder="salutation"/>
                    <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleInputChange} placeholder="first name"/>
                    <input type="text" name="lastName" value={this.state.lastName} onChange={this.handleInputChange} placeholder="last name"/>
                    <button type="submit">Update</button>
                </form>
                <p onClick={this.delete}>delete entry</p>
                <Link to="/listAll">Back to list</Link>
                </div>
                :
                <div><p>loading...</p></div>
                }
            </div>
        )
    }
}