import React from "react";
import request from "superagent";

import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";

interface SuperAdminLoginProps {
  onLoginComplete(): void;
}

interface SuperAdminLoginState {
  superAdminToken: string;
  superAdminOrgId: string;
  isOpen: boolean;
  isWorking: boolean;
  error?: string;
}

class SuperAdminLogin extends React.Component<
  SuperAdminLoginProps,
  SuperAdminLoginState
> {
  state: SuperAdminLoginState = {
    superAdminToken: "",
    superAdminOrgId: "1",
    isOpen: false,
    isWorking: false,
    error: undefined
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyEvent);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyEvent);
  }

  handleKeyEvent = (e: KeyboardEvent) => {
    // Listen for alt-l keyboard combo
    if (e.keyCode === 76 && e.altKey) {
      this.setState({ isOpen: !this.state.isOpen });
    }
  };

  handleRequestClose = () => this.setState({ isOpen: false });

  handleOnChangeSecret = (
    _event: React.FormEvent<{}>,
    superAdminToken: string
  ) => this.setState({ superAdminToken });

  handleOnChangeOrgId = (
    _event: React.FormEvent<{}>,
    superAdminOrgId: string
  ) => this.setState({ superAdminOrgId });

  handleSubmit = async () => {
    const { superAdminToken, superAdminOrgId } = this.state;

    this.setState({ isWorking: true, error: undefined });
    try {
      await request
        .post("/superadmin-login")
        .set("X-Spoke-Superadmin-Token", superAdminToken)
        .send({ organizationId: superAdminOrgId });
      this.setState({ isOpen: false });
      this.props.onLoginComplete();
    } catch (err) {
      if (err.response.status === 403) {
        this.setState({ error: "unauthorized" });
      } else if (err.response.status === 400) {
        this.setState({ error: err.response.body.message });
      } else {
        this.setState({ error: err.message });
      }
    } finally {
      this.setState({ isWorking: false });
    }
  };

  render() {
    const {
      superAdminToken,
      superAdminOrgId,
      isOpen,
      isWorking,
      error
    } = this.state;

    const hasText = superAdminToken.length > 0;

    const actions = [
      <FlatButton
        label="Go"
        primary={true}
        disabled={isWorking || !hasText}
        onClick={this.handleSubmit}
      />
    ];

    return (
      <Dialog
        title="Superadmin Login"
        open={isOpen}
        actions={actions}
        onRequestClose={this.handleRequestClose}
      >
        <TextField
          floatingLabelText="Superadmin secret"
          errorText={error}
          type="password"
          value={superAdminToken}
          fullWidth={true}
          onChange={this.handleOnChangeSecret}
        />
        <TextField
          floatingLabelText="Organization ID"
          value={superAdminOrgId}
          onChange={this.handleOnChangeOrgId}
        />
      </Dialog>
    );
  }
}

export default SuperAdminLogin;
