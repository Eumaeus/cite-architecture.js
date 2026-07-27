
/* =====================================================
   Lightweight browser-based tests for Cite2Urn
   No external dependencies
   ===================================================== */


const targetElement = document.getElementById("test-output");
const reportElementTop = document.getElementById("test-report-top");
const reportElementBottom = document.getElementById("test-report-bottom");

let testCount = 0;
let errorCount = 0
let passedCount = 0;
let failedCount = 0;
let failedTests = [];

function urnReport(testUrn) {
	//console.log(`Trying urnReport with ${testUrn}`);
	passedCount++;
	targetElement.innerHTML += `
		<div id="test_${testCount}" style="background-color: #ddd;">
		<p>${testCount}. Test URN constructed: <strong>${testUrn.toString()}</strong></p>
		<ul style="background-color: #eee;">
		<li>collectionId: ${testUrn.collectionId}</li>
		<li>versionId: ${testUrn.versionId}</li>
		<li>propertyId: ${testUrn.propertyId}</li>
		<li> — </li>
		<li>selector: ${testUrn.selector}</li>
		<li>subRef: ${testUrn.subRef}</li>
		<li> — </li>
		<li>isRange: ${testUrn.isRange}</li>
		</ul>
		</div>`;
	testCount++;
}

function testMethod(testnum, urn, message, testPassed, shouldFail = false) {
	var didItPass = false;
  if (!testPassed && shouldFail) { 
  	didItPass = true;
  	passedCount++;
  }
  if (testPassed && !shouldFail) {
  	didItPass = true;
  	passedCount++;
  }
  if (testPassed && shouldFail){ 
  	didItPass = false;
  	failedTests.push(testnum);
		failedCount++;
  }
  if (!testPassed && !shouldFail) {
  	didItPass = false;
  	failedTests.push(testnum);
		failedCount++;
  }
  const color = ( didItPass ) ? "green" : "red";
  targetElement.innerHTML += `
    <div id="test_${testnum}">
      <p style="color: ${color}">
        <strong>${testCount}. ${message}</strong>: ${urn}
      </p>
    </div>
  `;
  testCount++;
}

// -------------------------------------
// Functions for reporting Try/Catch tests
function tryToPass(message) {
	targetElement.innerHTML += `<div><p style="color: green;">${testCount}.<strong>Try/Catch Test:</strong> <span style="color: navy;">${message}</span></p></div>`;
	passedCount++;
	testCount++;
}

function tryToFail(message) {
	targetElement.innerHTML += `<div><p style="color: red;">${testCount}.<strong>Try/Catch Test:</strong> <span style="color: red;">${message}</span></p></div>`;
	failedTests.push(testCount);
	failedCount++;
	testCount++;
}

function catchToPass(message) {
  targetElement.innerHTML += `<div><p style="color: green;">${testCount}. <strong>Try/Catch Test:</strong> <span style="color: navy;">${message}</span></p></div>`;
	passedCount++;
	errorCount = errorCount + 1;
	testCount++;
}

function catchToFail(message) {
  targetElement.innerHTML += `<div><p style="color: navy;">${testCount}.<strong>Try/Catch Test:</strong> <span style="color: navy;">${message}</span></p></div>`;
	failedCount++;
	failedTests.push(testCount);
	errorCount = errorCount + 1;
	testCount++;
}
// -------------------------------------

function showSummary() {

	// To avoid linking to the demo questions:
	failedTests.shift();
	failedTests.shift();

	let failedTestReport = "";
	if (failedTests.length == 0) {
		failedTestReport = `<div style="color: green;"><p>No failed tests to report.</p></div>`;
	} else {
		ftArrayStr = failedTests.map( ft => `<li><a href="#test_${ft}">Test ${ft}</li>`);
		failedTestReport = `<div style="color: black;"><h2>Links to failed tests:</p><ul>${ftArrayStr.join("\n")}</ul></div>.`;
	}
	
  report = `
    <hr>
  	 <div style="background-color: #ccdeff; border: 1px solid navy; padding: 25px;">
    <h3>Summary</h3>
    <p><strong>Total tests:</strong> ${testCount - 4}</p>
    <p style="color: green"><strong>Passed:</strong> ${passedCount}</p>
    <p style="color: red"><strong>Failed:</strong> ${failedCount}</p>
    <p style="color: navy"><strong>Errored well:</strong> ${errorCount}</p>
    ${failedTestReport}
  `;
  reportElementTop.innerHTML = report;
  reportElementBottom.innerHTML = report;

}

// ====================
// TEST DATA
// ====================

// Undefined-URN
undefinedUrn = undefined;

// ==================== TESTS ====================

// --- Confirm Reporting
targetElement.innerHTML += `<div><p  class="test-h2">Confirm Reporting <br/>(These don't count in the summary report.)</p></div>`

testMethod(testCount, "demo", message = `Passed. Should have passed.`, testPassed = true, shouldFail = false );
testMethod(testCount, "demo", message = `Failed. Should have failed.`, testPassed = false, shouldFail = true );
testMethod(testCount, "demo", message = `Passed. Should have failed.`, testPassed = true, shouldFail = true );
testMethod(testCount, "demo", message = `Failed. Should have passed.`, testPassed = false, shouldFail = false );
passedCount--; passedCount--; failedCount--; failedCount--;
// --- End Confirm Reporting

// =================================================
// --- New Tests ---
// =================================================
targetElement.innerHTML += `<div><p  class="test-h2">New Tests</p></div>`

targetElement.innerHTML += "<p>Newly added tests here, for convenience.</p>"

// =================================================
// --- Basic Construction & Properties ---
// =================================================
targetElement.innerHTML += `<div><p  class="test-h2">Basic Construction & Properties</p></div>`



// --- new CiteUrn() ---
targetElement.innerHTML += `<div><p  class="test-h2">new Cite2Urn()</p></div>`

try {
	const simpleUrnStr = "urn:cite2:hmt:msA:12r";
	let newUrn = new Cite2Urn(simpleUrnStr);
	message = `Cite2Urn constructed.`;
	tryToPass(message);
} catch(error){
	message = `Failed to construct Cite2Urn: ${error.message}`;
	catchToFail(message);
}

try {
	const versionedUrnStr = "urn:cite2:hmt:msA.2019:12r";
	let newUrn = new Cite2Urn(versionedUrnStr);
	message = `Cite2Urn constructed.`;
	tryToPass(message);
} catch(error){
	message = `Failed to construct Cite2Urn: ${error.message}`;
	catchToFail(message);
}

try {
	const propertyUrnStr = "urn:cite2:hmt:msA.2019.label:12r";
	let newUrn = new Cite2Urn(propertyUrnStr);
	message = `Cite2Urn constructed.`;
	tryToPass(message);
} catch(error){
	message = `Failed to construct Cite2Urn: ${error.message}`;
	catchToFail(message);
}

try {
	const rangeUrnStr = "urn:cite2:hmt:msA.2019:12r-24v";
	let newUrn = new Cite2Urn(rangeUrnStr);
	message = `Cite2Urn constructed.`;
	tryToPass(message);
} catch(error){
	message = `Failed to construct Cite2Urn: ${error.message}`;
	catchToFail(message);
}

try {
	const subRefUrnStr = "urn:cite2:hmt:msA:12r";
	let newUrn = new Cite2Urn(subRefUrnStr);
	message = `Cite2Urn constructed.`;
	tryToPass(message);
} catch(error){
	message = `Failed to construct Cite2Urn: ${error.message}`;
	catchToFail(message);
}

// --- URN Validity ---
targetElement.innerHTML += `<div><p  class="test-h2">URN Validity</p></div>`

// Good urn 
targetElement.innerHTML += `<h3>Good Cite2Urn</h3>`;

try {
	const simpleUrnStr = "urn:cite2:hmt:msA.v1.prop:12r";
	let newUrn = new Cite2Urn(simpleUrnStr);
	message = `Cite2Urn constructed.`;
	tryToPass(message);
} catch(error){
	message = `Failed to construct Cite2Urn: ${error.message}`;
	catchToFail(message);
}


// Improper front-stuff 1
targetElement.innerHTML += `<h3>Improper front-stuff 1</h3>`;

try {
	const noFinalColon = "urn:cite:hmt:msA.v1";
	let newUrn = new Cite2Urn(noFinalColon);
	message = `Cite2Urn constructed 'cite' instead of 'cite1'.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

// Improper front-stuff 2
targetElement.innerHTML += `<h3>Improper front-stuff 2</h3>`;


try {
	const noFinalColon = "url:cite2:hmt:msA.v1";
	let newUrn = new Cite2Urn(noFinalColon);
	message = `Cite2Urn constructed 'url:' instead of 'urn:'.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

// Improper front-stuff 3
targetElement.innerHTML += `<h3>Improper front-stuff 3</h3>`;


try {
	const noFinalColon = ":cite2:hmt:msA.v1";
	let newUrn = new Cite2Urn(noFinalColon);
	message = `Cite2Urn constructed 'url:' instead of 'urn:'.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

// Improper front-stuff 4
targetElement.innerHTML += `<h3>Improper front-stuff 4</h3>`;


try {
	const noFinalColon = "urn::hmt:msA.v1";
	let newUrn = new Cite2Urn(noFinalColon);
	message = `Cite2Urn constructed with empty 'urn'.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

// No final colon after collection-component
targetElement.innerHTML += `<h3>No final colon</h3>`;

try {
	const noFinalColon = "urn::hmt:msA.v1";
	let newUrn = new Cite2Urn(noFinalColon);
	message = `Cite2Urn constructed with empty 'nss'.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

// Too many parts in collection-component
targetElement.innerHTML += `<h3>Too many parts in collection-component</h3>`;

try {
	const badUrn = "urn:cite2:hmt:msA.v1.prop.v2:";
	let newUrn = new Cite2Urn(badUrn);
	message = `Cite2Urn constructed with no final colon after collection-component.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

// Illegal characters in version-component
targetElement.innerHTML += `<h3>Illegal characters in version-component</h3>`;

try {
	const badUrn = "urn:cite2:hmt:msA.vers@1.prop:";
	let newUrn = new Cite2Urn(badUrn);
	message = `Cite2Urn constructed with illegal characters in the version-component.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

// Too many hyphens in object-component
targetElement.innerHTML += `<h3>Too many hyphens in object-component</h3>`;

try {
	const badUrn = "urn:cite2:hmt:msA.2019:12r-23r-243r";
	let newUrn = new Cite2Urn(badUrn);
	message = `Cite2Urn constructed with too many hyphens in object-component.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

// Trailing hyphens in object-component
targetElement.innerHTML += `<h3>Trailing hyphens in object-component</h3>`;

try {
	const badUrn = "urn:cite2:hmt:msA.2019:12r-";
	let newUrn = new Cite2Urn(badUrn);
	message = `Cite2Urn constructed with trailing hyphens in object-component.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

// Leading hyphens in object-component
targetElement.innerHTML += `<h3>Leading hyphens in object-component</h3>`;

try {
	const badUrn = "urn:cite2:hmt:msA.2019:-12r";
	let newUrn = new Cite2Urn(badUrn);
	message = `Cite2Urn constructed with leading hyphens in object-component.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

// Sub-reference in range-urn
targetElement.innerHTML += `<h3>Sub-reference in range-urn</h3>`;

try {
	const badUrn = "urn:cite2:hmt:msAimg.2019:12r_uv@0.5, 0.34, 0.6, 0.1-12v";
	let newUrn = new Cite2Urn(badUrn);
	message = `Range Cite2Urn constructed with a sub-reference.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

try {
	const badUrn = "urn:cite2:hmt:msAimg.2019:11v-12r_uv@0.5, 0.34, 0.6, 0.1";
	let newUrn = new Cite2Urn(badUrn);
	message = `Range Cite2Urn constructed with a sub-reference.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

// Bad characters in selector
targetElement.innerHTML += `<h3>Bad characters in selector</h3>`;

try {
	const badUrn = "urn:cite2:hmt:msAimg.2019:12r_uv,12v_uv";
	let newUrn = new Cite2Urn(badUrn);
	message = `Range Cite2Urn constructed with a illegal characters in selector.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

try {
	const badUrn = "urn:cite2:hmt:msAimg.2019:12.r";
	let newUrn = new Cite2Urn(badUrn);
	message = `Range Cite2Urn constructed with a illegal characters in selector.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

// Sub-reference on propert URN
targetElement.innerHTML += `<h3>Sub-reference on propert URN</h3>`;

try {
	const badUrn = "urn:cite2:hmt:msAimg.2019.label:12r_uv@0.5, 0.34, 0.6, 0.1";
	let newUrn = new Cite2Urn(badUrn);
	message = `Property-level Cite2Urn constructed a sub-reference.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn: ${error.message}`;
	catchToPass(message);
}

// =================================================
// --- Assessing Properties ---
// =================================================

var testUrn = new Cite2Urn("urn:cite2:hmt:msAimg.2019:12r_uv@0.5, 0.34, 0.6, 0.1");

testMethod(testCount, testUrn, "toString()", testUrn.toString() == "urn:cite2:hmt:msAimg.2019:12r_uv@0.5, 0.34, 0.6, 0.1");

testMethod(testCount, testUrn, "hasVersionId()", testUrn.hasVersionId());

var testUrn = new Cite2Urn("urn:cite2:hmt:msAimg:12r_uv");

testMethod(testCount, testUrn, "hasVersionId()", !testUrn.hasVersionId());

var testUrn = new Cite2Urn("urn:cite2:hmt:msAimg.2019.label:12r_uv");

testMethod(testCount, testUrn, "hasPropertyId()", testUrn.hasPropertyId());

var testUrn = new Cite2Urn("urn:cite2:hmt:msAimg.2019:12r_uv");

testMethod(testCount, testUrn, "hasPropertyId()", !testUrn.hasPropertyId());

testMethod(testCount, testUrn, "hasSelector()", testUrn.hasSelector());

var testUrn = new Cite2Urn("urn:cite2:hmt:msAimg.2019:");

testMethod(testCount, testUrn, "hasSelector()", !testUrn.hasSelector());

testMethod(testCount, testUrn, "hasSubRef()", !testUrn.hasSubRef());

var testUrn = new Cite2Urn("urn:cite2:hmt:msAimg.2019:12r_uv@0.5, 0.34, 0.6, 0.1");

testMethod(testCount, testUrn, "hasSubRef()", testUrn.hasSubRef());

testMethod(testCount, testUrn, "isRange())", !testUrn.isRange());

var testUrn = new Cite2Urn("urn:cite2:hmt:msA.2019:12r-13v");

testMethod(testCount, testUrn, "isRange()", testUrn.isRange());


// =================================================
// --- Comparison ---
// =================================================




// =================================================
// --- URN Reports ---
// =================================================
targetElement.innerHTML += `<h2>URN Reports</h2>`;


try {
	const urn = "urn:cite2:hmt:msA:12r";
	urnReport(new Cite2Urn(urn));
	message = "Generated URN Report.";
	tryToPass(message);
} catch(error) {
	message = `Errored generating URN-Report: ${error}.`
}

try {
	const urn = "urn:cite2:hmt:msA.2019:12r";
	urnReport(new Cite2Urn(urn));
	message = "Generated URN Report.";
	tryToPass(message);
} catch(error) {
	message = `Errored generating URN-Report: ${error}.`
}

try {
	const urn = "urn:cite2:hmt:msA.2019.label:12r";
	urnReport(new Cite2Urn(urn));
	message = "Generated URN Report.";
	tryToPass(message);
} catch(error) {
	message = `Errored generating URN-Report: ${error}.`
}

try {
	const urn = "urn:cite2:hmt:msA.2019:12r-24v";
	urnReport(new Cite2Urn(urn));
	message = "Generated URN Report.";
	tryToPass(message);
} catch(error) {
	message = `Errored generating URN-Report: ${error}.`
}

try {
	const urn = "urn:cite2:hmt:msAimg.2019:12r_uv@0.5, 0.34, 0.6, 0.1";
	urnReport(new Cite2Urn(urn));
	message = "Generated URN Report.";
	tryToPass(message);
} catch(error) {
	message = `Errored generating URN-Report: ${error}.`
}

// ==================== FINAL SUMMARY ====================
showSummary();