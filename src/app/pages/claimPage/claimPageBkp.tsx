import clsx from "clsx";
import { useState } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from "../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";

  const ClaimPage: React.FC = () => {
  const [tab, setTab] = useState("Sidebar");
  const [config, setConfig] = useState<ILayout>(getLayoutFromLocalStorage());
  const [configLoading, setConfigLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);

  const updateConfig = () => {
    setConfigLoading(true);
    try {
      LayoutSetup.setConfig(config);
      window.location.reload();
    } catch (error) {
      setConfig(getLayoutFromLocalStorage());
      setConfigLoading(false);
    }
  };

  const reset = () => {
    setResetLoading(true);
    setTimeout(() => {
      setConfig(getLayoutFromLocalStorage());
      setResetLoading(false);
    }, 1000);
  };

  return (
    <>
      <script src="../claimPage/claimPageJS.js"></script>
      <div className="card mb-10">
        <div className="card-body">
          <div className="tab-content pt-3">
            <div className="ms-8 card mb-10">
              <form className="form" id="kt_form">
                <div className="form-group">
                  <div
                    className="alert alert-light-primary d-none mb-15"
                    role="alert"
                    id="kt_form_msg"
                  >
                    <div className="alert-icon">
                      <i className="la la-warning"></i>
                    </div>
                    <div className="alert-text font-weight-bold">
                      Oh snap! Change a few things up and try submitting again.
                    </div>
                    <div className="alert-close">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        aria-label="Close"
                      >
                        <span>
                          <i className="ki ki-close "></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-form-label col-lg-3 col-sm-12 text-right">
                    Bootstrap Date Time Picker *
                  </label>
                  <div className="col-lg-4 col-md-9 col-sm-12">
                    <div className="input-group date">
                      <input
                        type="text"
                        className="form-control"
                        name="datetime"
                        placeholder="Select date & time"
                        id="kt_datetimepicker"
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="la la-calendar-check-o glyphicon-th"></i>
                        </span>
                      </div>
                    </div>
                    <span className="form-text text-muted">
                      Select a date time
                    </span>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-form-label col-lg-3 col-sm-12 text-right">
                    Bootstrap Time Picker *
                  </label>
                  <div className="col-lg-4 col-md-9 col-sm-12">
                    <div className="input-group date">
                      <input
                        className="form-control"
                        id="kt_timepicker"
                        placeholder="Select time"
                        name="time"
                        type="text"
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="la la-clock-o"></i>
                        </span>
                      </div>
                    </div>
                    <span className="form-text text-muted">Select time</span>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-form-label col-lg-3 col-sm-12 text-right">
                    Bootstrap Date Range Picker *
                  </label>
                  <div className="col-lg-4 col-md-9 col-sm-12">
                    <div className="input-group" id="kt_daterangepicker">
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        name="daterangepicker"
                        placeholder="Select date range"
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="la la-calendar-check-o"></i>
                        </span>
                      </div>
                    </div>
                    <span className="form-text text-muted">
                      Select a date range
                    </span>
                  </div>
                </div>

                <div className="separator separator-dashed my-10"></div>

                <div className="form-group row">
                  <label className="col-form-label col-lg-3 col-sm-12 text-right">
                    Bootstrap Switch *
                  </label>
                  <div className="col-lg-4 col-md-9 col-sm-12">
                    <input
                      data-switch="true"
                      type="checkbox"
                      name="switch"
                      id="test"
                      data-on-color="success"
                    />
                    <span className="form-text text-muted"></span>
                  </div>
                </div>

                <div className="separator separator-dashed my-10"></div>

                <div className="form-group row">
                  <label className="col-form-label col-lg-3 col-sm-12 text-right">
                    Bootstrap Select *
                  </label>
                  <div className="col-lg-4 col-md-9 col-sm-12">
                    <select
                      className="form-control"
                      id="kt_bootstrap_select"
                      multiple
                      name="select"
                    >
                      <optgroup label="Picnic" data-max-options="2">
                        <option>Mustard</option>
                        <option>Ketchup</option>
                        <option>Relish</option>
                      </optgroup>
                      <optgroup label="Camping" data-max-options="2">
                        <option>Tent</option>
                        <option>Flashlight</option>
                        <option>Toilet Paper</option>
                      </optgroup>
                    </select>
                    <span className="form-text text-muted">
                      Select at least 2 and maximum 4 options
                    </span>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-form-label col-lg-3 col-sm-12 text-right">
                    Select2 *
                  </label>
                  <div className="col-lg-4 col-md-9 col-sm-12">
                    <select
                      className="form-control select2"
                      id="kt_select2"
                      name="select2"
                    >
                      <option label="Label"></option>
                      <optgroup label="Alaskan/Hawaiian Time Zone">
                        <option value="AK">Alaska</option>
                        <option value="HI">Hawaii</option>
                      </optgroup>
                      <optgroup label="Pacific Time Zone">
                        <option value="CA">California</option>
                        <option value="NV">Nevada</option>
                        <option value="OR">Oregon</option>
                        <option value="WA">Washington</option>
                      </optgroup>
                      <optgroup label="Mountain Time Zone">
                        <option value="AZ">Arizona</option>
                        <option value="CO">Colorado</option>
                        <option value="ID">Idaho</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NM">New Mexico</option>
                        <option value="ND">North Dakota</option>
                        <option value="UT">Utah</option>
                        <option value="WY">Wyoming</option>
                      </optgroup>
                      <optgroup label="Central Time Zone">
                        <option value="AL">Alabama</option>
                        <option value="AR">Arkansas</option>
                        <option value="IL">Illinois</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="OK">Oklahoma</option>
                        <option value="SD">South Dakota</option>
                        <option value="TX">Texas</option>
                        <option value="TN">Tennessee</option>
                        <option value="WI">Wisconsin</option>
                      </optgroup>
                      <optgroup label="Eastern Time Zone">
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="IN">Indiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="OH">Ohio</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WV">West Virginia</option>
                      </optgroup>
                    </select>
                    <span className="form-text text-muted">
                      Select an option
                    </span>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-form-label col-lg-3 col-sm-12 text-right">
                    Typeahead *
                  </label>
                  <div className="col-lg-4 col-md-9 col-sm-12">
                    <div className="typeahead">
                      <input
                        className="form-control"
                        id="kt_typeahead"
                        type="text"
                        name="typeahead"
                        placeholder="States of USA"
                      />
                    </div>
                    <span className="form-text text-muted">
                      Please select a state
                    </span>
                  </div>
                </div>

                <div className="separator separator-dashed my-10"></div>

                <div className="form-group row">
                  <label className="col-form-label col-lg-3 col-sm-12 text-right">
                    Markdown *
                  </label>
                  <div className="col-lg-7 col-md-9 col-sm-12">
                    <textarea
                      name="markdown"
                      className="form-control"
                      data-provide="markdown"
                      rows={10}
                    ></textarea>
                    <span className="form-text text-muted">
                      Enter some markdown content
                    </span>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-9 ml-lg-auto">
                    <button type="submit" className="btn btn-primary mr-2">
                      Validate
                    </button>
                    <button type="reset" className="btn btn-light-primary">
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
              <form className="form">
                <div className="card-body">
                  <div className="form-group row">
                    <div className="col-lg-6">
                      <label>Full Name:</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter full name"
                      />
                      <span className="form-text text-muted">
                        Please enter your full name
                      </span>
                    </div>
                    <div className="col-lg-6">
                      <label>Contact Number:</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter contact number"
                      />
                      <span className="form-text text-muted">
                        Please enter your contact number
                      </span>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-lg-6">
                      <label>Address:</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your address"
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <i className="la la-map-marker"></i>
                          </span>
                        </div>
                      </div>
                      <span className="form-text text-muted">
                        Please enter your address
                      </span>
                    </div>
                    <div className="col-lg-6">
                      <label>Postcode:</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your postcode"
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <i className="la la-bookmark-o"></i>
                          </span>
                        </div>
                      </div>
                      <span className="form-text text-muted">
                        Please enter your postcode
                      </span>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-lg-6">Bootstrap Date Picker *</label>
                    <div className="col-lg-4 col-md-9 col-sm-12">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          name="date"
                          placeholder="Select date"
                          id="kt_datepicker"
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <i className="la la-calendar-check-o"></i>
                          </span>
                        </div>
                      </div>
                      <span className="form-text text-muted">
                        Select a date
                      </span>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-lg-6">
                      <label>User Group:</label>
                      <div className="radio-inline">
                        <label className="radio radio-solid">
                          <input type="radio" name="example_2" value="2" />
                          <span></span>
                          Sales Person
                        </label>
                        <label className="radio radio-solid">
                          <input type="radio" name="example_2" value="2" />
                          <span></span>
                          Customer
                        </label>
                      </div>
                      <span className="form-text text-muted">
                        Please select user group
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="row">
                    <div className="col-lg-6">
                      <button type="reset" className="btn btn-primary mr-2">
                        Save
                      </button>
                      <button type="reset" className="btn btn-secondary">
                        Cancel
                      </button>
                    </div>
                    <div className="col-lg-6 text-lg-right">
                      <button type="reset" className="btn btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <form className="form">
                <div className="card-body">
                  <h4 className="fw-bold text-gray-900">Submit a Claim</h4>
                  <div className="fs-7 fw-semibold text-muted">
                    All the fields are mandatory
                  </div>
                  <div className="separator separator-dashed my-6"></div>
                  <div className="form-group">
                    <label
                      className="form-check-label text-gray-700 fw-bold"
                      htmlFor="kt_builder_sidebar_minimize_desktop_enabled"
                      data-bs-toggle="tooltip"
                      data-kt-initialized="1"
                    >
                      First Name:
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      placeholder="Enter full name"
                    />
                    <span className="form-text text-muted">
                      Please enter your full name
                    </span>
                  </div>
                  <div className="form-group">
                    <label>Email address:</label>
                    <input
                      type="email"
                      className="form-control form-control-solid"
                      placeholder="Enter email"
                    />
                    <span className="form-text text-muted">
                      We'll never share your email with anyone else
                    </span>
                  </div>
                  <div className="form-group">
                    <label>Subscription</label>
                    <div className="input-group input-group-lg">
                      <div className="input-group-prepend">
                        <span className="input-group-text">SAR</span>
                      </div>
                      <input
                        type="text"
                        className="form-control form-control-solid"
                        placeholder="99.9"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Communication:</label>
                    <div className="checkbox-list">
                      <label className="checkbox">
                        <input type="checkbox" />
                        <span></span>
                        Email
                      </label>
                      <label className="checkbox">
                        <input type="checkbox" />
                        <span></span>
                        SMS
                      </label>
                      <label className="checkbox">
                        <input type="checkbox" />
                        <span></span>
                        Phone
                      </label>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button type="reset" className="btn btn-primary mr-2">
                    Submit
                  </button>
                  <button type="reset" className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToolbarWrapper />
      <Content>
        <div className="card mb-10">
          <div className="card-body d-flex align-items-center py-8">
            <div className="d-flex h-80px w-80px flex-shrink-0 flex-center position-relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="text-primary h-75px w-75px h-lg-100px w-lg-100px position-absolute opacity-5"
              >
                <path
                  fill="currentColor"
                  d="M10.2,21.23,4.91,18.17a3.58,3.58,0,0,1-1.8-3.11V8.94a3.58,3.58,0,0,1,1.8-3.11L10.2,2.77a3.62,3.62,0,0,1,3.6,0l5.29,3.06a3.58,3.58,0,0,1,1.8,3.11v6.12a3.58,3.58,0,0,1-1.8,3.11L13.8,21.23A3.62,3.62,0,0,1,10.2,21.23Z"
                ></path>
              </svg>
              <KTIcon
                iconName="wrench"
                className="fs-2x fs-lg-3x text-primary position-absolute"
              />
            </div>

            <div className="ms-6">
              <p className="list-unstyled text-gray-600 fw-bold fs-6 p-0 m-0">
                The layout builder is to assist your set and configure your
                preferred project layout specifications and preview it in
                real-time.
              </p>
              <p className="list-unstyled text-gray-600 fw-bold fs-6 p-0 m-0">
                Also, you can configurate the Layout in the code (
                <code>src/_metronic/layout/core/_LayoutConfig.ts</code> file).
                Don't forget clear your local storage when you are changing
                _LayoutConfig.
              </p>
            </div>
          </div>
        </div>

        <div className="card card-custom">
          <div className="card-header card-header-stretch overflow-auto">
            <ul
              className="nav nav-stretch nav-line-tabs
                fw-bold
                border-transparent
                flex-nowrap
              "
              role="tablist"
            >
              <li className="nav-item">
                <a
                  className={clsx(`nav-link cursor-pointer`, {
                    active: tab === "Sidebar",
                  })}
                  onClick={() => setTab("Sidebar")}
                  role="tab"
                >
                  Sidebar
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={clsx(`nav-link cursor-pointer`, {
                    active: tab === "Header",
                  })}
                  onClick={() => setTab("Header")}
                  role="tab"
                >
                  Header
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={clsx(`nav-link cursor-pointer`, {
                    active: tab === "Toolbar",
                  })}
                  onClick={() => setTab("Toolbar")}
                  role="tab"
                >
                  Toolbar
                </a>
              </li>
            </ul>
          </div>

          <form className="form">
            <div className="card-body">
              <div className="tab-content pt-3">
                <div
                  className={clsx("tab-pane", { active: tab === "Sidebar" })}
                >
                  <div className="form-group d-flex flex-stack">
                    <div className="d-flex flex-column">
                      <h4 className="fw-bold text-gray-900">Fixed</h4>
                      <div className="fs-7 fw-semibold text-muted">
                        Fixed sidebar mode
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <div className="form-check form-check-custom form-check-solid form-check-success form-switch">
                        <div
                          className="form-check form-check-custom form-check-solid form-switch
                        mb-2"
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="model.app.sidebar.default.fixed.desktop"
                            checked={
                              config.app?.sidebar?.default?.fixed?.desktop
                            }
                            onChange={() => {
                              const con = { ...config };
                              if (
                                con.app &&
                                con.app.sidebar &&
                                con.app.sidebar.default &&
                                con.app.sidebar.default.fixed
                              ) {
                                con.app.sidebar.default.fixed.desktop =
                                  !con.app.sidebar.default.fixed.desktop;
                                setConfig({ ...con });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="separator separator-dashed my-6"></div>
                  <div className="form-group d-flex flex-stack">
                    <div className="d-flex flex-column">
                      <h4 className="fw-bold text-gray-900">Minimize</h4>
                      <div className="fs-7 fw-semibold text-muted">
                        Sidebar minimize mode
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <div className="form-check form-check-custom form-check-solid form-check-success form-switch">
                        <div
                          className="
                    form-check form-check-custom form-check-solid form-check-success form-switch
                      "
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="model.app.sidebar.default.minimize.desktop.enabled"
                            id="kt_builder_sidebar_minimize_desktop_enabled"
                            checked={
                              config.app?.sidebar?.default?.minimize?.desktop
                                ?.enabled
                            }
                            onChange={() => {
                              const con = { ...config };
                              if (
                                con.app &&
                                con.app.sidebar &&
                                con.app.sidebar.default &&
                                con.app.sidebar.default.minimize &&
                                con.app.sidebar.default.minimize.desktop
                              ) {
                                con.app.sidebar.default.minimize.desktop.enabled =
                                  !con.app.sidebar.default.minimize.desktop
                                    .enabled;
                                setConfig({ ...con });
                              }
                            }}
                          />
                          <label
                            className="form-check-label text-gray-700 fw-bold"
                            htmlFor="kt_builder_sidebar_minimize_desktop_enabled"
                            data-bs-toggle="tooltip"
                            data-kt-initialized="1"
                          >
                            Minimize Toggle
                          </label>
                        </div>
                        <div
                          className="
                    form-check form-check-custom form-check-solid form-check-success form-switch ms-10
                      "
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="kt_builder_sidebar_minimize_desktop_hoverable"
                            name="model.app.sidebar.default.minimize.desktop.hoverable"
                            checked={
                              config.app?.sidebar?.default?.minimize?.desktop
                                ?.hoverable
                            }
                            onChange={() => {
                              const con = { ...config };
                              if (
                                con.app &&
                                con.app.sidebar &&
                                con.app.sidebar.default &&
                                con.app.sidebar.default.minimize &&
                                con.app.sidebar.default.minimize.desktop
                              ) {
                                con.app.sidebar.default.minimize.desktop.hoverable =
                                  !con.app.sidebar.default.minimize.desktop
                                    .hoverable;
                                setConfig({ ...con });
                              }
                            }}
                          />
                          <label
                            className="form-check-label text-gray-700 fw-bold"
                            htmlFor="kt_builder_sidebar_minimize_desktop_hoverable"
                            data-bs-toggle="tooltip"
                            data-kt-initialized="1"
                          >
                            Hoverable
                          </label>
                        </div>
                        <div
                          className="
                    form-check form-check-custom form-check-solid form-check-success form-switch ms-10
                      "
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="kt_builder_sidebar_minimize_desktop_default"
                            name="model.app.sidebar.default.minimize.desktop.default"
                            checked={
                              config.app?.sidebar?.default?.minimize?.desktop
                                ?.default
                            }
                            onChange={() => {
                              const con = { ...config };
                              if (
                                con.app &&
                                con.app.sidebar &&
                                con.app.sidebar.default &&
                                con.app.sidebar.default.minimize &&
                                con.app.sidebar.default.minimize.desktop
                              ) {
                                con.app.sidebar.default.minimize.desktop.default =
                                  !con.app.sidebar.default.minimize.desktop
                                    .default;
                                setConfig({ ...con });
                              }
                            }}
                          />
                          <label
                            className="form-check-label text-gray-700 fw-bold"
                            htmlFor="kt_builder_sidebar_minimize_desktop_default"
                            data-bs-toggle="tooltip"
                            data-kt-initialized="1"
                          >
                            Default Minimized
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={clsx("tab-pane", { active: tab === "Header" })}>
                  <div className="form-group d-flex flex-stack">
                    <div className="d-flex flex-column">
                      <h4 className="fw-bold text-gray-900">Fixed</h4>
                      <div className="fs-7 fw-semibold text-muted">
                        Fixed header mode
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <div className="form-check form-check-custom form-check-solid form-check-success form-switch">
                        <div
                          className="
                        form-check form-check-custom form-check-solid form-switch
                        mb-2
                      "
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="model.app.header.default.fixed.desktop"
                            checked={
                              config.app?.header?.default?.fixed?.desktop
                            }
                            onChange={() => {
                              const con = { ...config };
                              if (
                                con.app &&
                                con.app.header &&
                                con.app.header.default &&
                                con.app.header.default.fixed
                              ) {
                                con.app.header.default.fixed.desktop =
                                  !con.app.header.default.fixed.desktop;
                                setConfig({ ...con });
                              }
                            }}
                            // [(ngModel)]="model.app.header.default.fixed.desktop"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="separator separator-dashed my-6"></div>
                  <div className="form-group d-flex flex-stack">
                    <div className="d-flex flex-column">
                      <h4 className="fw-bold text-gray-900">Content</h4>
                      <div className="fs-7 fw-semibold text-muted">
                        Header content type
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <div className="form-check form-check-custom form-check-success form-check-solid form-check-sm ms-10">
                        <input
                          className="form-check-input"
                          type="radio"
                          checked={
                            config.app?.header?.default?.content === "menu"
                          }
                          onChange={() => {
                            const con = { ...config };
                            if (
                              con.app &&
                              con.app.header &&
                              con.app.header.default
                            ) {
                              con.app.header.default.content = "menu";
                              setConfig({ ...con });
                            }
                          }}
                          // [(ngModel)]="model.app.header.default.content}
                          value="menu"
                          id="kt_builder_header_content_menu"
                          name="model.app.header.default.content"
                        />
                        <label
                          className="form-check-label text-gray-700 fw-bold text-nowrap"
                          htmlFor="kt_builder_header_content_menu"
                        >
                          Menu
                        </label>
                      </div>
                      <div className="form-check form-check-custom form-check-success form-check-solid form-check-sm ms-10">
                        <input
                          className="form-check-input"
                          type="radio"
                          value="page-title"
                          id="kt_builder_header_content_page-title"
                          checked={
                            config.app?.header?.default?.content ===
                            "page-title"
                          }
                          onChange={() => {
                            const con = { ...config };
                            if (
                              con.app &&
                              con.app.header &&
                              con.app.header.default
                            ) {
                              con.app.header.default.content = "page-title";
                              setConfig({ ...con });
                            }
                          }}
                        />
                        <label
                          className="form-check-label text-gray-700 fw-bold text-nowrap"
                          htmlFor="kt_builder_header_content_page-title"
                        >
                          Page Title
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={clsx("tab-pane", { active: tab === "Toolbar" })}
                >
                  <div className="form-group d-flex flex-stack">
                    <div className="d-flex flex-column">
                      <h4 className="fw-bold text-gray-900">Fixed</h4>
                      <div className="fs-7 fw-semibold text-muted">
                        Fixed toolbar mode
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <div className="d-flex justify-content-end">
                        <div className="form-check form-check-custom form-check-solid form-check-success form-switch me-10">
                          <input
                            className="form-check-input w-45px h-30px"
                            type="checkbox"
                            id="kt_builder_toolbar_fixed_desktop"
                            name="model.app.toolbar.fixed.desktop"
                            checked={config.app?.toolbar?.fixed?.desktop}
                            onChange={() => {
                              const con = { ...config };
                              if (
                                con.app &&
                                con.app.toolbar &&
                                con.app.toolbar.fixed
                              ) {
                                con.app.toolbar.fixed.desktop =
                                  !con.app.toolbar.fixed.desktop;
                                setConfig({ ...con });
                              }
                            }}
                          />
                          <label
                            className="form-check-label text-gray-700 fw-bold"
                            htmlFor="kt_builder_toolbar_fixed_desktop"
                          >
                            Desktop Mode
                          </label>
                        </div>
                        <div className="form-check form-check-custom form-check-solid form-check-success form-switch">
                          <input
                            className="form-check-input w-45px h-30px"
                            type="checkbox"
                            name="model.app.toolbar.fixed.mobile"
                            checked={config.app?.toolbar?.fixed?.mobile}
                            onChange={() => {
                              const con = { ...config };
                              if (
                                con.app &&
                                con.app.toolbar &&
                                con.app.toolbar.fixed
                              ) {
                                con.app.toolbar.fixed.mobile =
                                  !con.app.toolbar.fixed.mobile;
                                setConfig({ ...con });
                              }
                            }}
                            id="kt_builder_toolbar_fixed_mobile"
                          />
                          <label
                            className="form-check-label text-gray-700 fw-bold"
                            htmlFor="kt_builder_toolbar_fixed_mobile"
                          >
                            Mobile Mode
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="separator separator-dashed my-6"></div>
                  <div className="mb-6">
                    <h4 className="fw-bold text-gray-900">Layout</h4>
                    <div className="fw-semibold text-muted fs-7 d-block lh-1">
                      Select a toolbar layout
                    </div>
                  </div>

                  <div
                    data-kt-buttons="true"
                    data-kt-buttons-target=".form-check-image:not(.disabled),.form-check-input:not([disabled])"
                    data-kt-initialized="1"
                  >
                    <label
                      className={clsx(
                        "form-check-image form-check-success mb-10",
                        {
                          active: config.app?.toolbar?.layout === "classic",
                        }
                      )}
                    >
                      <div className="form-check-wrapper">
                        <img
                          src={toAbsoluteUrl(
                            "/media/misc/layout/toolbar-classic.png"
                          )}
                          className="mw-100"
                          alt=""
                        />
                      </div>
                      <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                        <input
                          className="form-check-input"
                          type="radio"
                          // checked="checked"
                          value="classic"
                          name="model.app.toolbar.layout"
                          checked={config.app?.toolbar?.layout === "classic"}
                          onChange={() => {
                            const con = { ...config };
                            if (con.app && con.app.toolbar) {
                              con.app.toolbar.layout = "classic";
                              setConfig({ ...con });
                            }
                          }}
                          // [(ngModel)]="model.app.toolbar.layout"
                        />
                        <div className="form-check-label text-gray-800">
                          Classic
                        </div>
                      </div>
                    </label>

                    <label
                      className={clsx(
                        "form-check-image form-check-success mb-10",
                        {
                          active: config.app?.toolbar?.layout === "saas",
                        }
                      )}
                    >
                      <div className="form-check-wrapper">
                        <img
                          src={toAbsoluteUrl(
                            "/media/misc/layout/toolbar-saas.png"
                          )}
                          className="mw-100"
                          alt=""
                        />
                      </div>
                      <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                        <input
                          className="form-check-input"
                          type="radio"
                          value="saas"
                          name="model.app.toolbar.layout"
                          checked={config.app?.toolbar?.layout === "saas"}
                          onChange={() => {
                            const con = { ...config };
                            if (con.app && con.app.toolbar) {
                              con.app.toolbar.layout = "saas";
                              setConfig({ ...con });
                            }
                          }}
                          // [(ngModel)]="model.app.toolbar.layout"
                        />
                        <div className="form-check-label text-gray-800">
                          SaaS
                        </div>
                      </div>
                    </label>

                    <label
                      className={clsx(
                        "form-check-image form-check-success mb-10",
                        {
                          active: config.app?.toolbar?.layout === "accounting",
                        }
                      )}
                    >
                      <div className="form-check-wrapper">
                        <img
                          src={toAbsoluteUrl(
                            "/media/misc/layout/toolbar-accounting.png"
                          )}
                          className="mw-100"
                          alt=""
                        />
                      </div>
                      <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                        <input
                          className="form-check-input"
                          type="radio"
                          value="accounting"
                          name="model.app.toolbar.layout"
                          checked={config.app?.toolbar?.layout === "accounting"}
                          onChange={() => {
                            const con = { ...config };
                            if (con.app && con.app.toolbar) {
                              con.app.toolbar.layout = "accounting";
                              setConfig({ ...con });
                            }
                          }}
                          // [(ngModel)]="model.app.toolbar.layout"
                        />
                        <div className="form-check-label text-gray-800">
                          Accounting
                        </div>
                      </div>
                    </label>

                    <label
                      className={clsx(
                        "form-check-image form-check-success mb-10",
                        {
                          active: config.app?.toolbar?.layout === "extended",
                        }
                      )} // [ngClass]="{'active': model.app.toolbar.layout === 'extended'}"
                    >
                      <div className="form-check-wrapper">
                        <img
                          src={toAbsoluteUrl(
                            "/media/misc/layout/toolbar-extended.png"
                          )}
                          className="mw-100"
                          alt=""
                        />
                      </div>
                      <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                        <input
                          className="form-check-input"
                          type="radio"
                          value="extended"
                          name="model.app.toolbar.layout"
                          checked={config.app?.toolbar?.layout === "extended"}
                          onChange={() => {
                            const con = { ...config };
                            if (con.app && con.app.toolbar) {
                              con.app.toolbar.layout = "extended";
                              setConfig({ ...con });
                            }
                          }}
                          // [(ngModel)]="model.app.toolbar.layout"
                        />
                        <div className="form-check-label text-gray-800">
                          Extended
                        </div>
                      </div>
                    </label>

                    <label
                      className={clsx(
                        "form-check-image form-check-success mb-10",
                        {
                          active: config.app?.toolbar?.layout === "reports",
                        }
                      )}
                    >
                      {/* begin::Image */}
                      <div className="form-check-wrapper">
                        <img
                          src={toAbsoluteUrl(
                            "/media/misc/layout/toolbar-reports.png"
                          )}
                          className="mw-100"
                          alt=""
                        />
                      </div>
                      {/* end::Image */}
                      {/* begin::Check */}
                      <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                        <input
                          className="form-check-input"
                          type="radio"
                          value="reports"
                          name="model.app.toolbar.layout"
                          checked={config.app?.toolbar?.layout === "reports"}
                          onChange={() => {
                            const con = { ...config };
                            if (con.app && con.app.toolbar) {
                              con.app.toolbar.layout = "reports";
                              setConfig({ ...con });
                            }
                          }}
                          // [(ngModel)]="model.app.toolbar.layout"
                        />
                        {/* begin::Label */}
                        <div className="form-check-label text-gray-800">
                          Reports
                        </div>
                        {/* end::Label */}
                      </div>
                      {/* end::Check */}
                    </label>
                    {/* end::Option */}
                  </div>
                </div>
              </div>

              <div className="card-footer py-6">
                <div className="row">
                  <div className="col-lg-3"></div>
                  <div className="col-lg-9">
                    <button
                      type="button"
                      onClick={updateConfig}
                      className="btn btn-primary me-2"
                    >
                      {!configLoading && (
                        <span className="indicator-label">Preview</span>
                      )}
                      {configLoading && (
                        <span
                          className="indicator-progress"
                          style={{ display: "block" }}
                        >
                          Please wait...{" "}
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      id="kt_layout_builder_reset"
                      className="btn btn-active-light btn-color-muted"
                      onClick={reset}
                    >
                      {!resetLoading && (
                        <span className="indicator-label">Reset</span>
                      )}
                      {resetLoading && (
                        <span
                          className="indicator-progress"
                          style={{ display: "block" }}
                        >
                          Please wait...{" "}
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Content>
    </>
  );
};

export { ClaimPage };
