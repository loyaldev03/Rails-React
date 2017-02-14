var UserForm = React.createClass({
    getInitialState() {
        return {
            user: {},

            can_submit: false,
            key: (this.state && this.state.key) ? this.state.key : 1,
            was_submitted: false,
            forceScroll: false,
            errors: {},
        }
    },
    stateToObject() {
        return this.state;
    },
    componentDidUpdate() {
        if (this.state.forceScroll) {
            Scroller.scrollTo(ERRORS_NAME, SCROLL_OPTIONS);
            this.setState({forceScroll: false});
        }
    },
    enableButton() {
        this.setState({
            can_submit: true
        });
    },
    disableButton() {
        if (!this.state.was_submitted) {
            this.setState({
                can_submit: false
            });
        }
    },
    handleChange(name, value) {
        var state = this.state;
        this.state[name] = value;
        this.setState(state);
    },
    handleCRUD(url, onSuccessCallback) {
        var obj = this.stateToObject();
        $.ajax({
            url: url,
            dataType: 'json',
            contentType: 'application/json',
            type: ACTION_UPDATE,
            data: JSON.stringify(obj),
            beforeSend: function (xhr, settings) {
                this.disableButton();
                this.setState({was_submitted: true, errors: {}});
            }.bind(this),
            success: function (data) {
                if (onSuccessCallback) {
                    onSuccessCallback(data);
                }
            }.bind(this),
            error: function (xhr, status, err) {
                var state = onAjaxError(xhr);
                if (state != null) {
                    this.setState(state);
                }
            }.bind(this),
            complete: function (xhr, status) {
                this.enableButton();
            }.bind(this)
        });
    },
    handleUpdate() {
        // TODO: handlers
        var url = Routes.user_registration_path();
        this.handleCRUD(url, this.onSuccess);
    },
    onSuccess() {
        // this.resetState();
    },
    render() {
        const errors = renderErrors(this.state);
        return (
            <Formsy.Form onSubmit={this.handleUpdate} key={this.state.key} onValid={this.enableButton} onInvalid={this.disableButton}
                         validationErrors={this.state.errors}>
                {errors}
                <UserFields handleChange={this.handleChange} instance={this.props.instance}/>
                <button type="submit" onClick={this.handleUpdate}>Update</button>
            </Formsy.Form>
        );
    }
});