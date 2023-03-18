import React from 'react';
import { Modal } from 'bootstrap';

class JoinRegistry extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        // TODO: check cache/cookie for previous submission
        this.state = {
            hasRegistryCount: false,
            registryCount: 0,
            showForm: true,
            isSubmit: false,
            showModal: false,
            modalMessage: null,
            modalHeading: null,
            modal: null
        }
    }

    componentDidMount() {
        console.debug("Enter componentDidMount.")
        // config modal
        var modal = new Modal('#modal', { backdrop: true })
        var st = this.state;
        st.modal = modal;
        this.setState(st);

        fetch("https://cvhs-api.onrender.com/metrics/")
            .then(res => res.json())
            .then(res => {
                if (res.code === 200) {
                    var st = this.state;
                    st.hasRegistryCount = true;
                    st.registryCount = res.metrics.registryCount;
                    this.setState(st);
                } else {
                    this.clientError();
                }
            }).catch((error) => {
                console.error(error);
                this.clientError();
            })
        // get previous registration
        var id = localStorage.getItem("id");
        if (id) {
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

        fetch(`https://cvhs-api.onrender.com/registry/${id}`, options)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                console.log(res.code);
            })
            .catch(() => {
                var st = this.state
                st.isSubmit = false;
                this.setState(st);
                this.clientError();
            })
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

        fetch("https://cvhs-api.onrender.com/registry/", options)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                console.log(res.code);
                var st = this.state;
                if ([200, 202].includes(res.code)) {
                    st.isSubmit = false;
                    if ([200].includes(res.code)) {
                        st.showForm = false;
                        // TODO: log to db: console.log(res.message);
                        st.registryCount = this.state.registryCount + 1;
                        // TODO: store local cache
                        localStorage.setItem("id", res.payload.id);
                        // remove form
                    }
                    if ([202].includes(res.code)) {
                        // TODO: log to db: console.log('202'); console.log(res.payload.message);
                        st.modalMessage = res.payload.message;
                        st.showModal = true;
                        this.showModal();
                    }
                    console.log(st);
                    this.setState(st);
                } else {
                    console.log("error");
                    // TODO: log to db console.log(res.message);
                    st.isSubmit = false;
                    this.setState(st);
                    this.clientError();
                }
            })
            .catch(() => {
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
                        <small><i className="bi-info-circle"></i>register using your maiden name, as its listed in the yearbook.</small>
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
                <h1>thank you for registering.</h1>
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