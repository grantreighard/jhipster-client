import React from 'react';
import { Link } from 'react-router-dom';

export default class ListAll extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        this.props.cdm();
        return (
            
            <div>
                
                {this.props.people.length ? 
                this.props.people.map((person) => {
                    return <Link to={`/greeting/${person.id}`}><h1>{person.salutation}, {person.firstName} {person.lastName}</h1></Link>
                })
                : <p>loading...</p>
                }
            </div>
            
        )
    }
}