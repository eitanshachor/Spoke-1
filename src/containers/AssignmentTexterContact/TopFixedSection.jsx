import React from "react";
import ContactToolbar from "../../components/ContactToolbar";
import NavigateHomeIcon from "material-ui/svg-icons/action/home";
import IconButton from "material-ui/IconButton/IconButton";

const TopFixedSection = props => {
  const { contactSettings, contact, campaign, onExitTexter } = props;

  return (
    <ContactToolbar
      campaign={campaign}
      campaignContact={contact}
      contactSettings={contactSettings}
      rightToolbarIcon={
        <IconButton
          onTouchTap={onExitTexter}
          tooltip="Return Home"
          tooltipPosition="bottom-center"
        >
          <NavigateHomeIcon />
        </IconButton>
      }
    />
  );
};

export default TopFixedSection;
