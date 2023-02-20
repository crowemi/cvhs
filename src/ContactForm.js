function ContactForm() {

    return (
        <div className="container registry-form-container">
            <h1 class="display-5">:join </h1>
            <form className="row g-3">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="First Name" />
                </div>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Last (Maiden) Name" />
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">@</span>
                    <input type="text" class="form-control" placeholder="Email Adress" />
                </div>
                <button onSubmit={(form) => { console.log(form) }} class="btn btn-primary" type="submit">Submit</button>
            </form >
        </ div >
    );
}

export default ContactForm