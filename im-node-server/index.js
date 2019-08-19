/************************************************
 * Intensity Midstream  REST API Server
 * Author: Jeff J. Bowie, Advantec Solutions Inc.
************************************************/

var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var sql = require("mssql");

// database Config
var config = {
	user: 'sa',
	password: 'aberdeentest',
	server: 'SVR\\XMSQL',
	database: 'LandRecordsData'
};
//for Plain, raw queries.
var executeQuery = function (query) {
	new sql.ConnectionPool(config)
		.connect()
		.then(
			pool => {
				pool
					.request()
					.query(query)

			})
		.catch(err => {
			console.log(err);
			res.status(500).send({ message: "${err}" })
			sql.close();
		});
}

var processSurfaceSiteSizes = (surface_site_sizes, last_id) => {
	// using last ID to add surface site sizes.
	surface_site_sizes.map(
		(value) => {
			query = `INSERT INTO [LandRecordsData].[dbo].[SurfaceSites] (LandRecordID, SurfaceSiteSize, IsSubmitOnly) 
			VALUES ('${last_id}', '${value}', 1)`;
			executeQuery(query);
		}

	);
}

var processPayments = (payments, last_id) => {
	var payforms = JSON.parse(payments);
	payforms.map((val, i) => {
		// using last ID to add payment info.
		query = `INSERT INTO [LandRecordsData].[dbo].[Payments] (LandRecordID, PmtDate, Payee, TransNum, PmtAmt, Memo, IsSubmitOnly) 
			VALUES ('${last_id}', '${val.checkdate}', '${val.payee}', '${val.checknumber}', '${val.pmtamt}', '${val.memo}',  1)`;
		executeQuery(query);
	});

	// using last ID to add payment info.
	/*query = `INSERT INTO [dbo].[Payments] (LandRecordID, PmtDate, TransNum, IsSubmitOnly) 
			VALUES ('${last_id}', '${check_date}', '${check_number}',  1)`;
	executeQuery(query);*/
}

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
	//Enabling CORS 
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.get("/api/projectnames", function (req, res) {
	query = `select projectname from dbo.tblProjectNames`;

	//console.log(query);
	new sql.ConnectionPool(config)
		.connect()
		.then(
			pool => {
				pool
					.request()
					.query(query)
					.then(
						(result) => {
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify(result.recordset));
						})
			})
		.catch(err => {
			console.log(err);
			res.status(500).send({ message: "${err}" })
			sql.close();
		});


});

app.post("/api/land", function (req, res) {

	// Initialize arrays for counties & doctypes.
	var counties = [];
	var doctypes = [];
	var surface_site_sizes = [];

	// assign surface site size to object if single. Otherwise, 
	if (req.body.surfacesite === 'Single') {
		surface_site_sizes.push(req.body.surfacesitesize);
	}

	// Loop over JSON entroes & assign appropriate values to array.
	for (const [key, value] of Object.entries(req.body)) {
		if (key.startsWith('counties')) counties.push(value);
		if (key.startsWith('doctypes')) doctypes.push(value);
		if (key.startsWith('surfacesitesizes')) surface_site_sizes.push(value);

	}

	// For debug, show request body in server console.
	//console.log(req.body);

	// Parsing counties & flipping bit;
	var gradyBit = 0; var garvinBit = 0; var carterBit = 0;
	var mcclainBit = 0; var stephensBit = 0;

	counties.map((value) => {

		if (value.startsWith('Grady')) gradyBit = 1;
		if (value.startsWith('Garvin')) garvinBit = 1;
		if (value.startsWith('Carter')) carterBit = 1;
		if (value.startsWith('McClain')) mcclainBit = 1;
		if (value.startsWith('Stephens')) stephensBit = 1;

	});

	// Parsing DocTypes & flipping Bit;
	var accessrdagmtBit = 0;
	var affidavitBit = 0;
	var assignmentBit = 0;
	var billofsaleBit = 0;
	var deedBit = 0;
	var deedrestrictionBit = 0;
	var memorandumBit = 0;
	var mortgageBit = 0;
	var permitBit = 0;
	var releaseBit = 0;
	var roweasementBit = 0;
	var surfacesiteBit = 0;
	var utilityagmtBit = 0;

	doctypes.map((value) => {

		if (value.startsWith('Access')) accessrdagmtBit = 1;
		if (value.startsWith('Affidavit')) affidavitBit = 1;
		if (value.startsWith('Assignment')) assignmentBit = 1;
		if (value.startsWith('Bill')) billofsaleBit = 1;
		if (value.startsWith('Deed')) deedBit = 1;
		if (value.startsWith('Deed Restriction')) deedrestrictionBit = 1;
		if (value.startsWith('Memorandum')) memorandumBit = 1;
		if (value.startsWith('Mortgage')) mortgageBit = 1;
		if (value.startsWith('Permit')) permitBit = 1;
		if (value.startsWith('Release')) releaseBit = 1;
		if (value.startsWith('ROW')) roweasementBit = 1;
		if (value.startsWith('Surface')) surfacesiteBit = 1;
		if (value.startsWith('Utility')) utilityagmtBit = 1;

	});


	query = `INSERT INTO [dbo].[tblLandRecords] (ProjectName, AgreementNum,LOPermitEntity,ParcelID, 
		LegalDescription,PipelineRights,SurfaceSite,SurfaceSiteSize,RoadGrant,DocExecDate,RecordedDate,
		LandAgent, Book, Page, Grantee, OwnerCheckNumber, OwnerCheckDate, PermitID, GradyCountyBit, GarvinCountyBit, 
		McClainCountyBit, StephensCountyBit, CarterCountyBit, AccessRdAgmt, Assignment,BillOfSale,DeedRestriction,Deed,Memo,Mortgage,
		Permit,Release,ROW_Easement, SurfaceSiteAssign, Affidavit, UtilityAgmt, IsSubmitOnly) VALUES (
		'${req.body.project}', '${req.body.agreement}', '${req.body.landowner}', '${req.body.parcel}',
		'${req.body.legaldescription}', '${req.body.pipelinerights}', '${req.body.surfacesite}',
		'${req.body.surfacesitesize}', '${req.body.roadgrant}', '${req.body.execdate}', 
		'${req.body.recordeddate}', '${req.body.company}', '${req.body.book}', '${req.body.page}',
		'${req.body.grantee}', NULL, NULL, '${req.body.permit}',
		${gradyBit}, ${garvinBit}, ${mcclainBit}, ${stephensBit}, ${carterBit}, ${accessrdagmtBit},
		${assignmentBit}, ${billofsaleBit}, ${deedrestrictionBit}, ${deedBit},
		${memorandumBit}, ${mortgageBit}, ${permitBit}, ${releaseBit}, ${roweasementBit},
		${surfacesiteBit},${affidavitBit},${utilityagmtBit}, 1) SELECT SCOPE_IDENTITY() as 'id'`;

	//console.log(query);
	new sql.ConnectionPool(config)
		.connect()
		.then(
			pool => {
				pool
					.request()
					.query(query)
					.then(
						(result) => {

							// Take resultant ID , and use to assign surface site sizes.
							processSurfaceSiteSizes(
								surface_site_sizes,
								result.recordset[0].id
							)
							processPayments(
								req.body.payments,
								result.recordset[0].id
							)
						})
			})
		.catch(err => {
			console.log(err);
			res.status(500).send({ message: "${err}" })
			sql.close();
		});

	res.sendStatus(200);

});

/* This is SUPER important! This is the route that the client will be passing the entered credentials for verification to. If the credentials match, then the server sends back a json response with a valid json web token for the client to use for identification. */
app.post('/api/login', (req, res) => {
	console.log(req.body);
	let username = req.body.username;
	let password = req.body.password;
	const user = {
		username: username,
		password: password
	}

	if (!username || !password) {
		username = username.toLowerCase();
		res.json({ status: false, message: 'Request parameters are not valid.' })
	} else {
		query = "select * from [dbo].[tblUsers] where Email=" + username;
		new sql.ConnectionPool(config)
			.connect()
			.then(
				pool => {
					pool
						.request()
						.query(query)
						.then(
							(result) => {
								if (result.recordset.length > 0) {
									if (password !== result.recordset['Password']) {
										res.json({ status: false, message: 'Wrong Password.' });
									} else {
										console.log("Valid!");
										let token = jwt.sign({ user: user }, 'secretkey');
										res.json({ status: true, token: token, username: username })
									}
								} else {
									res.json({ status: false, message: 'User Email does not exist.' });
								}
							})
				})
			.catch(err => {
				console.log(err);
				res.status(500).send({ message: err })
				sql.close();
			});
	}

});


var server = app.listen(5000, function () {
	console.log('Server is running..');
});