import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
//import { Router, Route, Switch, Redirect } from "react-router-dom";
import "./auth.js"
import './index.css';
import Login from './login.js';


class Header extends React.Component {
	logout = function () {
		alert('logout');
		localStorage.clear();
		document.location.reload();
	}

	render() {
		return (
			<div>
				<div className="row mt-4  text-center">
					<div className="col-md-8">
						<img className="img img-responsive" src="logo.png" alt="Intensity Midstream Logo" />
					</div>

					<div className="col-md-4 text-center">
						<button className="btn btn-default" onClick={this.logout}>Log Out</button>
					</div>
				</div>
				<div className="row">
					<div className="col-md-8 text-center">
						<h2>Land Records</h2>
					</div>
				</div>
			</div>
		)
	}
}

class SurfaceSite extends React.Component {

	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {

		var sizes_options = document.querySelector("#surface-site-sizes")
		var sizes_multi = document.querySelector("#surface-site-sizes-multi")

		if (event.target.value === "Multiple") {

			sizes_options.style.display = 'none';
			sizes_multi.style.display = 'block';
		}
		else {

			sizes_options.style.display = 'block';
			sizes_multi.style.display = 'none';
		}

	}

	render() {
		return (
			<div className="col-md-4">
				<div className="form-group">
					<label className="col-md-12 control-label" htmlFor="surfacesite">Surface Site</label>
					<div className="col-md-12">
						<select id="surface-site" name="surfacesite" className="form-control" onChange={this.handleChange}>
							<option value="">--</option>
							<option value="Single">Single</option>
							<option value="Multiple">Multiple</option>
						</select>
					</div>
				</div>
			</div>
		);
	}
}

class SurfaceSiteSize extends React.Component {

	render() {
		return (
			<div id="surface-site-sizes" className="col-md-4 form-group" >
				<label className="col-md-12 control-label" htmlFor="surfacesitesize">Surface Site Size</label>
				<div className="col-md-12">
					<select name="surfacesitesize" className="form-control">
						<option value="">--</option>
						<option value="200x300">200x300</option>
						<option value="50x60">50x60</option>
						<option value="75x75">75x75</option>
						<option value="Unknown">Unknown</option>
					</select>
				</div>
			</div>

		)
	}
}

class SurfaceSiteSizes extends React.Component {

	render() {
		return (

			<div id="surface-site-sizes-multi" className="col-md-4 form-group" style={{ display: 'none' }}>
				<label className="col-md-4 control-label" htmlFor="surfacesitesizes">Surface Site Sizes</label>
				<div className="col-md-4">
					<div className="form-check">
						<input className="form-check-input" type="checkbox" value="200x300" name="surfacesitesizes" />
						<label className="form-check-label" >200x300</label>
					</div>

					<div className="form-check">
						<input className="form-check-input" type="checkbox" value="50x60" name="surfacesitesizes" />
						<label className="form-check-label">50x60</label>
					</div>

					<div className="form-check">
						<input className="form-check-input" type="checkbox" value="75x75" name="surfacesitesizes" />
						<label className="form-check-label">75x75</label>
					</div>

					<div className="form-check">
						<input className="form-check-input" type="checkbox" value="Unknown" name="surfacesitesizes" />
						<label className="form-check-label">Unknown</label>
					</div>
				</div>
			</div>

		)
	}
}

class ProjectNames extends React.Component {

	constructor(props) {
		super(props);
		this.state = { projects: [] }
	}

	componentDidMount() {

		let projectnames = [];
		fetch('//' + window.location.hostname + ':5000/api/projectnames', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		})
			.then(response => response.json())
			.then(json => {
				projectnames = json.map((project) => {
					return project
				});


				this.setState({
					projects: projectnames,
				})

			});

	}
	render() {

		let optionItems = this.state.projects.map((project) =>
			<option key={project.projectname} value={project.projectname}>{project.projectname}</option>
		)
		return (

			<div className="col-md-4 form-group">
				<label className="col-md-12 control-label" htmlFor="project">Project</label>
				<div className="col-md-12">
					<select id="project" name="project" className="form-control">
						<option value="">--</option>
						{optionItems}
					</select>
				</div>
			</div>

		)
	}


}

class Form extends React.Component {

	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);

	}

	handleSubmit(event) {

		// prevent Native form handling
		event.preventDefault();
		// disable button
		document.getElementById("submit").disabled = true;


		// Grab form data
		const data = new FormData(event.target);

		// Initialize our main object.
		var object = {};

		// Initialize objects for holding multiple values.
		var doc_types = [];
		var counties = [];
		var surface_site_sizes = [];

		// Iterate array and assign values to appropriate objects.
		data.forEach(
			(value, key) => {
				if (key === 'documenttypes') {
					doc_types.push(value);
				}
				else if (key === 'counties') {
					counties.push(value);
				}
				else if (key === 'surfacesitesizes') {
					surface_site_sizes.push(value);
				}
				else {
					object[key] = value;
				}
			}
		);

		// Processing of multiples. Adds integer to key names.
		// Doctypes
		for (let i = 0; i < doc_types.length; i++) {
			object['doctypes' + i] = doc_types[i];
		}

		// Counties
		for (let i = 0; i < counties.length; i++) {
			object['counties' + i] = counties[i];
		}

		// Surface Site Sizes
		for (let i = 0; i < surface_site_sizes.length; i++) {
			object['surfacesitesizes' + i] = surface_site_sizes[i];
		}

		// Send JSON'ified Object to server.
		fetch('//' + window.location.hostname + ':5000/api/land', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(object)
		})
			.then((response) => {

				// Server sent back 200 OK.
				if (response.ok) {

					// Re-enable button after 3 seconds.
					setTimeout(function () {
						document.getElementById("submit").disabled = false
						document.querySelector('form').reset()
					}, 3000);

				}

			});
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit} className="form-horizontal">
				<fieldset>
					<div className="row mt-2">
						{/*Surface Site Sizes, Multi*/}
						<ProjectNames state={this.state} />

						{/* Agreement */}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="agreement">Agreement</label>
							<div className="col-md-12">
								<input id="agreement" name="agreement" type="text" placeholder="GXX-ST-001" className="form-control input-md" />
							</div>
						</div>
					</div>
					<div className="row mt-2">
						{/* Doc Types */}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="documenttypes">Doc Types</label>
							<div className="col-md-12">
								<select id="documenttypes" name="documenttypes" className="form-control" multiple="multiple">
									<option value="Access Road Agmt">Access Road Agmt</option>
									<option value="Affidavit">Affidavit</option>
									<option value="Assignment">Assignment</option>
									<option value="Bill of Sale">Bill of Sale</option>
									<option value="Deed">Deed</option>
									<option value="Deed Restriction">Deed Restriction</option>
									<option value="Memorandum">Memorandum</option>
									<option value="Mortgage">Mortgage</option>
									<option value="Permit">Permit</option>
									<option value="Release">Release</option>
									<option value="ROW / Easement">ROW / Easement</option>
									<option value="Surface Site">Surface Site</option>
									<option value="Utility Agmt">Utility Agmt</option>
								</select>
							</div>
							<small className="col-md-10 offset-md-1 form-text text-muted">* Hold CTRL to select multiple items.</small>
						</div>

						{/* LO/Permit/Entity */}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="land-owner">LO/Permit/Entity</label>
							<div className="col-md-12">
								<textarea className="form-control" id="land-owner" name="landowner"></textarea>
							</div>
						</div>
					</div>
					<div className="row mt-2">
						{/*Parcel*/}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="parcel">Parcel</label>
							<div className="col-md-12">
								<input id="parcel" name="parcel" type="text" placeholder="00-00N-00W-0-001" className="form-control input-md" />
							</div>
						</div>


						{/* Legal Description*/}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="legal-description">Legal Description</label>
							<div className="col-md-12">
								<textarea className="form-control" id="legal-description" name="legaldescription" />
							</div>
						</div>


					</div>
					<div className="row mt-2">
						{/*Counties*/}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="counties">Counties</label>
							<div className="col-md-12">
								<select id="counties" name="counties" className="form-control" multiple="multiple">
									<option value="Carter">Carter</option>
									<option value="Garvin">Garvin</option>
									<option value="Grady">Grady</option>
									<option value="McClain">McClain</option>
									<option value="Cleveland">Cleveland</option>
									<option value="Stephens">Stephens</option>
								</select>
							</div>
							<small className="form-text text-muted">* Hold CTRL to select multiple items.</small>
						</div>


						{/*Pipeline Rights*/}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="pipeline-rights">Pipeline Rights</label>
							<div className="col-md-12">
								<select id="pipeline-rights" name="pipelinerights" className="form-control">
									<option value="">--</option>
									<option value="multiline">Multi-Line</option>
									<option value="single">Single</option>
								</select>
							</div>
						</div>

					</div>
					<div className="row mt-2">
						{/*Surface Site*/}
						<SurfaceSite />

						{/*Surface Site Sizes*/}
						<SurfaceSiteSize />
					</div>


					{/*Surface Site Sizes, Multi*/}
					<SurfaceSiteSizes />
					<div className="row mt-2">
						{/*Road Grant*/}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="road-grant">Road Grant</label>
							<div className="col-md-12">
								<select id="road-grant" name="roadgrant" className="form-control">
									<option value="">--</option>
									<option value="1">Yes</option>
									<option value="0">No</option>
								</select>
							</div>
						</div>
						{/*Doc Exec Date*/}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="exec-date">Doc Exec Date</label>
							<div className="col-md-12">
								<input id="exec-date" name="execdate" type="date" placeholder="" className="form-control input-md" />
							</div>
						</div>

					</div>

					<div className="row mt-2">
						{/*Recorded Date*/}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="recorded-date">Recorded Date</label>
							<div className="col-md-12">
								<input id="recorded-date" name="recordeddate" type="date" placeholder="" className="form-control input-md" />
							</div>
						</div>

						{/*Land Company*/}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="company">Land Company</label>
							<div className="col-md-12">
								<select id="company" name="company" className="form-control">
									<option value="">--</option>
									<option value="3">Aberdeen Land Services</option>
									<option value="4">CM Land Solutions</option>
									<option value="5">Turner Oil &amp; Gas</option>
								</select>
							</div>
						</div>
					</div>

					<div className="row mt-2">

						{/*Book*/}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="book">Book </label>
							<div className="col-md-12">
								<input id="book" name="book" type="text" placeholder="" className="form-control input-md" />
							</div>
						</div>

						{/*Page*/}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="page">Page</label>
							<div className="col-md-12">
								<input id="page" name="page" type="text" placeholder="" className="form-control input-md" />
							</div>
						</div>
					</div>

					<div className="row mt-2">
						{/*Grantee*/}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="grantee">Grantee</label>
							<div className="col-md-12">
								<select id="grantee" name="grantee" className="form-control">
									<option value="">--</option>
									<option value="Legion">Legion</option>
									<option value="SXP">SXP</option>
									<option value="WEX">WEX</option>
								</select>
							</div>
						</div>

						{/*Owner Check #*/}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="check-number">Owner Check #</label>
							<div className="col-md-12">
								<input id="check-number" name="checknumber" type="text" placeholder="1000" className="form-control input-md" />
							</div>
						</div>
					</div>
					<div className="row mt-2">
						{/*Owner Check Date*/}

						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="check-date">Owner Check Date</label>
							<div className="col-md-12">
								<input id="check-date" name="checkdate" type="date" placeholder="12/31/1999" className="form-control input-md" />
							</div>
						</div>

						{/*Permit ID*/}
						<div className="col-md-4 form-group">
							<label className="col-md-12 control-label" htmlFor="permit">Permit ID</label>
							<div className="col-md-12">
								<input id="permit" name="permit" type="text" placeholder="" className="form-control input-md" />
							</div>
						</div>

					</div>


					<div className="row mt-2">
						<div className="col-md-4 text-center">
							<button id="submit" className="btn btn-primary">Submit</button>
						</div>
					</div>


				</fieldset>
			</form>
		)
	}
}

class App extends React.Component {
	render() {
		return (
			<div className="container">
				<Header />
				<Form />
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<App />,
	document.getElementById('root')
);


// const hist = createBrowserHistory();
// ReactDOM.render((
// 	<Router history={hist}>
// 		<Switch>
// 			{localStorage.token ?
// 				<Route path="/index" component={App} /> :
// 				<Route path="/" component={Login} />
// 			}
// 		</Switch>
// 	</Router>
// ), document.getElementById('root'))
