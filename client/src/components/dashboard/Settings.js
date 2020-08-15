import React, { Fragment, useEffect } from "react";
import Modal from "./../Modal";
import { connect } from "react-redux";
import { showBackDrop } from "./../../actions/utils";
import { showModal } from "./../../actions/utils";
import { setBackdropType } from "./../../actions/utils";
import { setCurrentProfile } from "./../../actions/profile";
import { deleteAccount } from "./../../actions/auth";
import { unsetFetch } from "./../../actions/auth";
import { Link } from "react-router-dom";

const Settings = ({
  utils,
  profile: { loggedProfile },
  auth: { fetch },
  showBackDrop,
  showModal,
  setCurrentProfile,
  setBackdropType,
  deleteAccount,
  unsetFetch,
}) => {
  useEffect(() => {
    return () => {
      unsetFetch();
    };
    //eslint-disable-next-line
  }, []);
  return (
    <Fragment>
      <div className="mid-container padding-top">
        <div className="my teal ">
          <span className="pencil fw-500 ">
            <i className="fas fa-cogs mx"></i>Settings
          </span>
        </div>
        <ul className="settings ">
          <li>
            <Link
              className="btn block "
              to={{
                pathname: "/create/uploadimage",
                state: {
                  from: "root",
                },
              }}>
              Change/Delete/Upload Profile Image
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setCurrentProfile(loggedProfile)}
              className="btn block "
              to="/create/profileform">
              Edit Profile
            </Link>
          </li>
          <li>
            <Link className="btn block " to="/create/changepassword">
              Change Password
            </Link>
          </li>
          <li>
            <a
              onClick={() => {
                setBackdropType("deleteAccount");
                showBackDrop();
                showModal();
              }}
              style={fetch === true ? { background: "red" } : {}}
              className="btn  block "
              href="#!">
              {fetch === true ? "Deleting your Account..." : "Deleting Account"}
            </a>
          </li>
        </ul>
      </div>
      {utils.backdrop && utils.modal && utils.backdropType === "deleteAccount" && (
        <Modal index={90} action="delete your account ,this can't be undone !!">
          <a
            onClick={() => deleteAccount()}
            style={{ color: "white" }}
            href="#!"
            className="btn orange">
            Confirm
          </a>
        </Modal>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  utils: state.utils,
  profile: state.profile,
  auth: state.auth,
});
export default connect(mapStateToProps, {
  showBackDrop,
  showModal,
  setBackdropType,
  setCurrentProfile,
  deleteAccount,
  unsetFetch,
})(Settings);
