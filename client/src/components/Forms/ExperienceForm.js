import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addExperience } from "./../../actions/profile";

const ExperienceForm = ({
  profile: { loggedProfile },

  addExperience,
  history,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    to: "",
    from: "",
    description: "",
    location: "",
  });
  const [current, currenthandler] = useState(false);
  const { title, company, to, from, location, description } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    addExperience(formData, loggedProfile._id, history);
  };
  return (
    <div className="container">
      <div className="my ">
        <span className="teal pencil fw-500 ">
          <i className="fas fa-cogs mx"></i>Add Experience
        </span>
        <br />
        <span className="mx">* = required Field.</span>
      </div>
      <form onSubmit={(e) => onSubmit(e)} className="education-form ">
        <div className="input-field">
          <input
            onChange={(e) => onChange(e)}
            value={title}
            type="text"
            name="title"
            placeholder="* Job title."
          />
          <span className="x-small ">
            Job title like manager,quality analysts etc.
          </span>
        </div>
        <div className="input-field">
          <input
            type="text"
            onChange={(e) => onChange(e)}
            value={company}
            name="company"
            placeholder="* Name of Company"
          />
          <span className="x-small ">Company you were working for.</span>
        </div>
        <div className="input-field">
          <input
            type="text"
            onChange={(e) => onChange(e)}
            value={location || ""}
            name="location"
            placeholder="Location"
          />
          <span className="x-small ">Location of Company.</span>
        </div>
        <div className="input-field">
          <input
            onChange={(e) => onChange(e)}
            value={from}
            type="date"
            name="from"
            placeholder="* From"
          />
          <span className="x-small ">Date of joining company.</span>
        </div>

        <div className="input-field check">
          <input onChange={() => currenthandler(!current)} type="checkbox" />
          <p className="mx">
            <span style={{ color: "initial" }}>
              I am currently working here.
            </span>
          </p>
        </div>
        <div className="input-field">
          <input
            disabled={current ? true : false}
            onChange={(e) => onChange(e)}
            value={to || ""}
            type="date"
            name="to"
            placeholder="* To"
          />
          <span className="x-small ">Date of resign.</span>
        </div>
        <div className="input-field">
          <textarea
            onChange={(e) => onChange(e)}
            value={description}
            type="text"
            name="description"
            placeholder="Description"
          />
          <span className="x-small ">Tell us about your job</span>
        </div>
        <div className="links">
          <p>
            <input
              style={{ color: "white" }}
              type="submit"
              value="Submit"
              className="btn "
            />
          </p>
          <p>
            <Link
              to="/create/uploadimage"
              style={{ backgroundColor: "grey" }}
              className="btn mx-2">
              Skip
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
const mapStatetoprops = (state) => ({
  profile: state.profile,
});
export default connect(mapStatetoprops, { addExperience })(
  withRouter(ExperienceForm)
);
