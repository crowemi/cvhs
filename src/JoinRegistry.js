import React from 'react';


class JoinRegistry extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            hasRegistryCount: false,
            registryCount: 0,
            isSubmit: false
        }
    }

    componentDidMount() {
        console.debug("Enter componentDidMount.")

        fetch("https://cvhs-api.onrender.com/metrics/")
            .then(res => res.json())
            .then(res => {
                console.debug(res);
                this.setState({ hasRegistryCount: true, registryCount: res.metrics.registryCount })
            }).catch((error) => { console.error(error) })
        console.debug("Exit componentDidMount.")
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

        var st = this.state;
        st.isSubmit = true;
        this.setState(st);

        fetch("https://cvhs-api.onrender.com/registry/", options).then(
            res => res.json()).then(res => {
                console.log(res)
                if (res.code === 200) {
                    var current_state = this.state;
                    current_state.registryCount = this.state.registryCount + 1;
                    current_state.isSubmit = false;
                    this.setState(current_state);
                } else {
                    console.log(res.message);
                }
            })
            .catch(() => {
                console.log("Error")
            })

    }
    counter() {
        if (this.state.hasRegistryCount === true) {
            return <span className="badge rounded-pill text-bg-primary">{this.state.registryCount}</span>
        } else {
            return <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
        }
    }

    submitButton() {
        if (this.state.isSubmit === true) {
            return (
                <button className="btn btn-primary" type="submit" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Processing...
                </button>
            )
        } else {
            return (
                <button className="btn btn-primary" type="submit">Submit</button>
            )
        }
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
                                <div className="p-2"><div className="float-end">{this.counter()} classmates registered</div></div>
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
                        <div className="col-12">
                            <input name="lastName" type="text" className="form-control" placeholder="Last (Maiden) Name" />
                        </div>
                        <small><i className="bi-info-circle"></i>register using your maiden name, as its listed in the yearbook.</small>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">@</span>
                        <input name="emailAddress" type="text" className="form-control" placeholder="Email Adress" />
                    </div>
                    {this.submitButton()}
                </form >
            </ div >
        );
    };
}

export default JoinRegistry