import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, InputGroup, InputGroupAddon, Input, FormGroup, Label, FormFeedback } from 'reactstrap';
import { loadComponent } from 'lib/Injector';
import fetch from 'isomorphic-fetch';
import Config from 'lib/Config';

/**
 * Provides a HOC wrapper that will enforce "sudo mode".
 *
 * This checks that the user has verified that they are them via password
 * entry within a certain period of time since they originally logged in.
 * If this state is not active then they will be presented with a notice,
 * then a verification form, then the passed through component will be
 * rendered as normal.
 *
 * Note that any backend controllers that accept XHR requests from wrapped
 * components should enforce backend sudo mode checks, while they can
 * assume that sudo mode would be active before requests are actually made
 * to them via legitimate use paths.
 */
const withSudoMode = (WrappedComponent) => {
  class ComponentWithSudoMode extends Component {
    constructor(props) {
      super(props);

      this.state = {
        active: props.sudoModeActive || false,
        showVerification: false,
        loading: false,
        errorMessage: null,
      };

      this.handleConfirmNotice = this.handleConfirmNotice.bind(this);
      this.handleVerify = this.handleVerify.bind(this);
      this.handleVerifyInputKeyPress = this.handleVerifyInputKeyPress.bind(this);

      // React 15 compatible ref callback
      this.passwordInput = null;
      this.setPasswordInput = element => {
        this.passwordInput = element;
      };
    }

    /**
     * Action called when clicking the button to confirm the sudo mode notice
     * and trigger the verification form to be rendered.
     */
    handleConfirmNotice() {
      this.setState({
        showVerification: true,
      });
    }

    /**
     * Action called when the user has entered their password and requested
     * verification of sudo mode state.
     */
    handleVerify() {
      this.setState({
        loading: true,
      });

      const payload = new FormData();
      payload.append('SecurityID', Config.get('SecurityID'));
      payload.append('Password', this.passwordInput.value);

      // Validate the request
      fetch('/admin/sudomode/activate', {
        method: 'POST',
        body: payload,
      }).then(response => response.json().then(result => {
        // Happy path, send the user to the wrapped component
        if (result.result) {
          return this.setState({
            loading: false,
            active: true,
          });
        }

        // Validation error, show them the message
        return this.setState({
          loading: false,
          errorMessage: result.message,
        });
      }));
    }

    /**
     * Treat pressing enter on the password field the same as clicking the
     * verify button.
     *
     * @param {object} event
     */
    handleVerifyInputKeyPress(event) {
      if (event.charCode === 13) {
        event.stopPropagation();
        event.preventDefault();
        this.handleVerify();
      }
    }


    /**
     * Returns whether "sudo mode" is active for the current user.
     *
     * @returns {boolean}
     */
    isSudoModeActive() {
      return this.state.active === true;
    }

    /**
     * Renders a notice to the user that they will need to verify themself
     * to enter sudo mode and continue to use this functionality.
     *
     * @returns {HTMLElement}
     */
    renderSudoModeNotice() {
      const { i18n } = window;
      const { showVerification } = this.state;

      return (
        <p className="sudo-mode__notice sudo-mode__notice--required">
          <span className="sudo-mode__notice-icon font-icon-lock" aria-hidden />
          <span className="sudo-mode__notice-message">
            {
              i18n._t(
                'SudoMode.REQUIRED_NOTICE',
                'This action requires "sudo mode". Please verify yourself to continue.'
              )
            }
            { /* todo add a help link for this */ }
            <a href="#" className="sudo-mode__notice-help">
              { i18n._t('SudoMode.HELP_TEXT', 'What is this?') }
            </a>
          </span>
          { !showVerification && (
            <Button
              className="sudo-mode__notice-button"
              outline
              onClick={this.handleConfirmNotice}
            >
              { i18n._t('SudoMode.VERIFY', 'Verify') }
            </Button>
          ) }
        </p>
      );
    }

    /**
     * Renders the password verification form to enter sudo mode
     *
     * @returns {HTMLElement}
     */
    renderSudoModeVerification() {
      const { i18n } = window;
      const { errorMessage } = this.state;

      const inputProps = {
        type: 'password',
        name: 'sudoModePassword',
        id: 'sudoModePassword',
        onKeyPress: this.handleVerifyInputKeyPress,
        innerRef: (node) => this.setPasswordInput(node),
      };
      const validationProps = errorMessage ? { valid: false } : {};

      return (
        <div className="sudo-mode__verify">
          <FormGroup className="sudo-mode__verify-form-group">
            <Label for="sudoModePassword">
              { i18n._t('SudoMode.ENTER_PASSWORD', 'Enter your password') }
            </Label>

            <InputGroup>
              <Input {...inputProps} {...validationProps} />
              <InputGroupAddon addonType="append">
                <Button
                  className="sudo-mode__verify-button"
                  outline
                  onClick={this.handleVerify}
                >
                  { i18n._t('SudoMode.VERIFY', 'Verify') }
                </Button>
              </InputGroupAddon>
              <FormFeedback>{ errorMessage }</FormFeedback>
            </InputGroup>
          </FormGroup>
        </div>
      );
    }

    /**
     * Renders the "sudo mode" notice or verification screen
     *
     * @returns {HTMLElement}
     */
    renderSudoMode() {
      const { showVerification, loading } = this.state;

      const LoadingComponent = this.props.LoadingComponent || loadComponent(
        'LoadingIndicator',
        'SudoMode'
      );

      if (loading) {
        return (
          <div className="sudo-mode">
            <LoadingComponent block />
          </div>
        );
      }

      return (
        <div className="sudo-mode">
          { this.renderSudoModeNotice() }
          { showVerification && this.renderSudoModeVerification() }
        </div>
      );
    }

    render() {
      const passProps = {
        ...this.props,
      };

      if (this.isSudoModeActive()) {
        return <WrappedComponent {...passProps} />;
      }

      return this.renderSudoMode();
    }
  }

  ComponentWithSudoMode.propTypes = {
    sudoModeActive: PropTypes.bool,
  };

  ComponentWithSudoMode.defaultProps = {
    sudoModeActive: false,
  };

  return ComponentWithSudoMode;
};

export default withSudoMode;
