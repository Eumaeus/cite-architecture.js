
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
	passedCount++;
	targetElement.innerHTML += `
		<div id="test_${testCount}" style="background-color: #ddd;">
		<p>${testCount}. Test URN constructed: <strong>${testUrn}</strong></p>
		<ul style="background-color: #eee;">
		<li>Cite2Urn: ${testUrn.toString()}</li>
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

// 			Good URNs
simpleUrnStr = "urn:cite2:hmt:msA:12r";
versionedUrnStr = "urn:cite2:hmt:msA.2019:12r";
propertyUrnStr = "urn:cite2:hmt:msA.2019.label:12r";
rangeUrnStr = "urn:cite2:hmt:msA.2019:12r-24r";
subRefUrnStr = "urn:cite2:hmt:e3bifolio.v1:E3_109v_110r@0.1124,0.2627,0.1123,0.1253";

//			BadUrns
noFinalColon = "urn:cite2:hmt:msA.201:";

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


try {
	urnReport(workUrn);
	message = "Generated URN Report.";
	tryToPass(messsage);
} catch(error) {
	message = `Errored generating URN-Report: ${error}.`
}

// --- new CiteUrn() ---
targetElement.innerHTML += `<div><p  class="test-h2">new Cite2Urn()</p></div>`

try {
	let newUrn = new Cite2Urn(simpleUrnStr);
	message = `Cite2Urn constructed.`;
	tryToPass(message);
} catch(error){
	message = `Failed to construct Cite2Urn from ${simpleUrnStr}: ${error.message}`;
	catchToFail(message);
}


// --- URN Validity ---
targetElement.innerHTML += `<div><p  class="test-h2">URN Validity</p></div>`

// Good urn 
targetElement.innerHTML += `<h3>Good urn </h3>`;

try {
	let newUrn = new Cite2Urn(simpleUrnStr);
	message = `Cite2Urn constructed.`;
	tryToPass(message);
} catch(error){
	message = `Failed to construct Cite2Urn from ${simpleUrnStr}: ${error.message}`;
	catchToFail(message);
}

// No final colon after collection-component
targetElement.innerHTML += `<h3>No final colon</h3>`;

try {
	let newUrn = new Cite2Urn(noFinalColon);
	message = `Cite2Urn constructed with no final colon after collection-component.`;
	tryToFail(message);
} catch(error){
	message = `Correctly failed to construct Cite2Urn from ${noFinalColon}: ${error.message}`;
	catchToPass(message);
}



// ==================== FINAL SUMMARY ====================
showSummary();