import React from 'react';
require('dotenv').config();

const API_HOST = process.env.REACT_APP_API_HOST;
console.log(`Target api: ${API_HOST}`);

class JoinRegistry extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            registryCount: 0
        }
    }

    componentDidMount() {
        fetch(`${API_HOST}metrics/`)
            .then(res => res.json()).then(res => { this.setState({ registryCount: res.registryCount }) })
    }

    handleSubmit(event) {
        event.preventDefault();
        const formElem = document.querySelector('form');
        const formData = new FormData(formElem);

        var form = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("emailAddress")
        }
        console.log(JSON.stringify(form));
        var options = {
            method: "POST",
            // mode: "cors",
            body: JSON.stringify(form),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }
        fetch(`${API_HOST}registry/`, options).then(
            (res) => {
                console.log(res.json());
                var current_state = this.state;
                current_state.registryCount = this.state.registryCount + 1;
                this.setState(current_state);
            }
        ).catch(() => { console.log("Error") })

    }

    render() {
        return (
            <div className="container registry-form-container" >
                <div className="col-12">
                    <div className="row">
                        <div className="col-6">
                            <h1 className="display-5">:join-registry</h1>
                        </div>
                        <div className="col-6">
                            <div className="d-flex flex-column-reverse">
                                <div className="p-2"></div>
                                <div className="p-2"><div className="float-end"><span className="badge rounded-pill text-bg-primary">{this.state.registryCount}</span> classmates registered</div></div>
                                <div className="p-2"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={this.handleSubmit} className="row g-3">
                    <div className="input-group mb-3">
                        <input name="firstName" type="text" className="form-control" placeholder="First Name" />
                    </div>
                    <div className="input-group mb-3">
                        <input name="lastName" type="text" className="form-control" placeholder="Last (Maiden) Name" />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">@</span>
                        <input name="emailAddress" type="text" className="form-control" placeholder="Email Adress" />
                    </div>
                    <button className="btn btn-primary" type="submit">Submit</button>
                </form >
            </ div >
        );
    };
}

export default JoinRegistry