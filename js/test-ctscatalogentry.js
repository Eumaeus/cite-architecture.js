
/* =====================================================
   Lightweight browser-based tests for 
   CtsCatalogEntry
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


function entryReport(testEntry) {
	passedCount++;
	targetElement.innerHTML += `
		<div style="background-color: #ddd;">
		<p>${testCount}. Test passage constructed."</strong></p>
		<ul style="background-color: #eee;">
		<li>urn: ${testEntry.urn}</li>
		<li>textgroup: ${testEntry.textgroup}</li>
		<li>work: ${testEntry.work}<li>
		<li>version: ${testEntry.version}</li>
		<li>exemplar: ${testEntry.exemplar}</li>
		<li>online: ${testEntry.online}</li>
		<li>true: ${testEntry.true}</li>
		</ul>
		</div>`;
	testCount++;
}

function testMethod(testnum, corpus, message, testPassed, shouldFail = false) {
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
        <strong>${testCount}. ${message}</strong>: ${corpus.summary}
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
  targetElement.innerHTML += `<div><p style="color: red;">${testCount}.<strong>Try/Catch Test:</strong> <span style="color: red;">${message}</span></p></div>`;
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
    <p style="color: navy"><strong>Errored correctly:</strong> ${errorCount}</p>
    ${failedTestReport}
  `;
  reportElementTop.innerHTML = report;
  reportElementBottom.innerHTML = report;

}

// ====================
// TEST DATA
// ====================


var u1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");

// ==================== TESTS ====================


// --- Confirm Reporting
targetElement.innerHTML += `<div><p  class="test-h2">Confirm Reporting <br/>(These don't count in the summary report.)</p></div>`

testMethod(testCount, u1, message = `Passed. Should have passed.`, testPassed = true, shouldFail = false );
testMethod(testCount, u1, message = `Failed. Should have failed.`, testPassed = false, shouldFail = true );
testMethod(testCount, u1, message = `Passed. Should have failed.`, testPassed = true, shouldFail = true );
testMethod(testCount, u1, message = `Failed. Should have passed.`, testPassed = false, shouldFail = false );

passedCount--; passedCount--;
failedCount --; failedCount --;
// ----End Confirm Reporting

// --- New Tests ---
targetElement.innerHTML += `<div><p  class="test-h2">New Tests</p></div>`

targetElement.innerHTML += "<p>Newly added tests here, for convenience.</p>"

// --- Basic Construction ---
targetElement.innerHTML += `<div><p  class="test-h2">Basic Construction</p></div>`

// Passage report
//		validEntry = new CtsCatalogEntry(u1, s1);
//		entryReport(validPassage);

// Good entry
targetElement.innerHTML += `<h3>Good Entry</h3>`;

try {
	goodEntry = new CtsCatalogEntry();
	message = `Created CtsPassage: "${goodEntry}"`;
	tryToPass(message);

} catch(error){
	message = `Failed to create CtsCatalogEntry: ${error.message}`;
	catchToFail(message);
}


// --- Properties ---
targetElement.innerHTML += `<div><p  class="test-h2">Properties</p></div>`


// ==================== FINAL SUMMARY ====================
showSummary();