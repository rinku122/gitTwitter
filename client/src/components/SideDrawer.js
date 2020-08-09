import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import { showSideDrawer } from "./../actions/utils";

import user from "./../images/1.jpg";
import { hideSideDrawer } from "./../actions/utils";
import { hideBackDrop } from "./../actions/utils";
import Backdrop from "./Backdrop";
const SideDrawer = ({
  utils,
  showSideDrawer,
  hideBackDrop,
  hideSideDrawer,
}) => {
  useEffect(() => {
    if (window.innerWidth > 768) {
      showSideDrawer();
    } else {
      hideSideDrawer();
    }
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        showSideDrawer();
        hideBackDrop();
      } else {
        hideSideDrawer();
        hideBackDrop();
      }
    });

    //eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <div
        style={utils.sideDrawer ? { width: "250px" } : { width: "0px" }}
        className="side-drawer">
        <ul>
          <li className="background-img padding-top">
            <img className="user-img" src={user} alt="" />
            <p className="my">rajesh</p>
            <p>rajesh@gmail.com</p>
          </li>
          <li>
            <a href="#!">Followers</a>
          </li>
          <li>
            <a href="#!">Followings</a>
          </li>
          <li>
            <a href="#!">Posts</a>
          </li>
          <li>
            <a href="#!">Education</a>
          </li>
          <li>
            <a href="#!">Experience</a>
          </li>
          <li>
            <a href="#!">Github</a>
          </li>
          <li>
            <a href="#!">Settings</a>
          </li>
          <li>
            <a href="#!">Logout</a>
          </li>
        </ul>
      </div>
      {utils.backdrop && <Backdrop />}
    </Fragment>
  );
};
const mapStatetoProps = (state) => ({
  utils: state.utils,
});
export default connect(mapStatetoProps, {
  showSideDrawer,
  hideSideDrawer,
  hideBackDrop,
})(SideDrawer);
