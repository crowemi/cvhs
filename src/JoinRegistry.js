import React from 'react';
import { Modal } from 'bootstrap';
import { log_level, clientLog } from './logging';
import { API_URI } from '.';

class JoinRegistry extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            hasRegistryCount: false,
            registryCount: 0,
            showForm: true,
            isSubmit: false,
            showModal: false,
            modalMessage: null,
            modalHeading: null,
            modal: null,
            registry: {
                firstName: null,
                email: null
            },
            clientIp: null
        }
    }

    async getIp() {
        await fetch(`https://api.ipify.org/?format=json`)
            .then(res => res.json())
            .then(res => {
                var st = this.state;
                st.clientIp = res.ip;
                this.setState(st);
            }).catch((error) => {
                clientLog(error, log_level.ERROR)
            });
    }

    async componentDidMount() {
        clientLog("Enter componentDidMount.", log_level.DEBUG)
        await this.getIp();
        // config modal
        var modal = new Modal('#modal', { backdrop: true })
        var st = this.state;
        st.modal = modal;
        this.setState(st);

        fetch(`${API_URI}metrics/`)
            .then(res => res.json())
            .then(res => {
                if (res.code === 200) {
                    clientLog("metrics/ successful.", log_level.INFO, this.state.clientIp)
                    var st = this.state;
                    st.hasRegistryCount = true;
                    st.registryCount = res.metrics.registryCount;
                    this.setState(st);
                } else {
                    this.clientError();
                    clientLog("metrics/ endpoint returned error code.", log_level.WARNING, this.state.clientIp)
                }
            }).catch((error) => {
                this.clientError();
                clientLog(error, log_level.ERROR, this.state.clientIp)
            })
        // get previous registration
        var id = localStorage.getItem("id");
        if (id) {
            clientLog(`${id} found in local storage.`, log_level.INFO, this.state.clientIp)
            this.getRegistry(id);
        }

        console.debug("Exit componentDidMount.")
    }

    getRegistry(id) {
        var options = {
            method: "GET",
            // mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }
        var st = this.state

        fetch(`${API_URI}registry/${id}`, options)
            .then(res => res.json())
            .then(res => {
                clientLog(`${id} successfully returned registry.`, log_level.INFO, this.state.clientIp)
                st.showForm = false;
                st.registry = res.payload.registry;
                this.setState(st);
            })
            .catch((error) => {
                st.isSubmit = false;
                this.setState(st);
                this.clientError();
                clientLog(error, log_level.ERROR, this.state.clientIp)
            })
    }

    handleSubmit(event) {
        event.preventDefault();
        clientLog(`JoinRegistry form submit initiated.`, log_level.INFO, this.state.clientIp)
        const formElem = document.querySelector('form');
        const formData = new FormData(formElem);

        var form = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("emailAddress"),
            ip: this.state.clientIp
        }

        clientLog(`Form values: ${JSON.stringify(form)}`, log_level.INFO, this.state.clientIp)
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

        fetch(`${API_URI}registry/`, options)
            .then(res => res.json())
            .then(res => {
                var st = this.state;
                if ([200, 202].includes(res.code)) {
                    clientLog(`Successfully submitted registry.`, log_level.INFO, this.state.clientIp);
                    clientLog(`${res.payload.message}`, log_level.INFO, this.state.clientIp);
                    st.isSubmit = false;
                    if ([200].includes(res.code)) {
                        st.showForm = false;
                        st.registryCount = this.state.registryCount + 1;
                        st.registry.firstName = form.firstName;
                        st.registry.email = form.email;
                        localStorage.setItem("id", res.payload.id);
                        clientLog(`ID: ${res.payload.id} stored in local cache.`, log_level.INFO, this.state.clientIp)
                    }
                    if ([202].includes(res.code)) {
                        st.modalMessage = res.payload.message;
                        st.showModal = true;
                        this.showModal();
                    }
                    this.setState(st);
                } else {
                    clientLog(`${res.payload.message}`, log_level.WARNING, this.state.clientIp);
                    st.isSubmit = false;
                    this.setState(st);
                    this.clientError();
                }
            })
            .catch((error) => {
                clientLog(error, log_level.ERROR, this.state.clientIp);
                var st = this.state
                st.isSubmit = false;
                this.setState(st);
                this.clientError();
            })

    }
    clientError() {
        var st = this.state;
        st.showModal = true;
        st.modalHeading = "Unexpected Error";
        st.modalMessage = "Uh oh! Something isn't right. Please try again later.";
        this.setState(st);
        this.showModal();
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

    showModal() {
        if (this.state.showModal === true) {
            this.state.modal.toggle();
        }
    }

    internalModal() {
        return (
            <div id="modal" className="modal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.state.modalHeading}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>{this.state.modalMessage}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    form() {
        if (this.state.showForm === true) {
            return (
                <form onSubmit={this.handleSubmit} className="row g-3">
                    <div className="input-group mb-3">
                        <input name="firstName" type="text" className="form-control" placeholder="First Name" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="col-12">
                            <input name="lastName" type="text" className="form-control" placeholder="Last (Maiden) Name" />
                        </div>
                        <small><i className="fa-solid fa-circle-info"></i> register using your maiden name, as its listed in the yearbook.</small>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">@</span>
                        <input name="emailAddress" type="text" className="form-control" placeholder="Email Adress" />
                    </div>
                    {this.submitButton()}
                </form >
            )
        } else {
            return (
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading"><i className="fa-solid fa-circle-check"></i> Thank you for registering, <b>{this.state.registry.firstName}</b>!</h4>
                    <p>Be watching your email for future correspondence about upcoming events and next steps.</p>
                </div>
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
                {this.form()}
                {this.internalModal()}
            </ div >
        );
    };
}


export default JoinRegistry