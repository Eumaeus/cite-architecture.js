
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
	console.log(`work= '${testEntry.work}'`);
	passedCount++;
	targetElement.innerHTML += `
		<div style="background-color: #ddd;">
		<p>${testCount}. Test passage constructed.</p>
		<ul style="background-color: #eee;">
		<li>urn: ${testEntry.ctsUrn}</li>
		<li>citationScheme: ${testEntry.citationScheme}</li>
		<li>textGroup: ${testEntry.textGroup}</li>
		<li>work: ${testEntry.work}</li>
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


// ==================== TEST DATA ====================

const entryStr1 = "urn:cts:latinLit:phi0448.phi001.dosreis:#book/chapter#Caesar#De Bello Gallico#Francisco Sotero dos Reis, 1783##true#por";
const entryStr2 = "urn:cts:latinLit:phi0448.phi001.holmes_lat:#book/chapter/section#Caesar#De Bello Gallico#T. Rice Holmes, 1914##true#lat";
const entryStr3 = "urn:cts:greekLit:tlg0031.tlg004.kjv_fu:#chapter/verse#New Testament#John#English: KJV##true#eng";
const entryStr4 = "urn:cts:greekLit:tlg0031.tlg004.kjv_fu.tok:#chapter/verse/token#New Testament#John#English: KJV#tokenized for syntax#true#eng";

// Passage URNs derived from the first and fourth entries
const passageUrn1 = new CtsUrn("urn:cts:latinLit:phi0448.phi001.dosreis:1.1");
const passageUrn4 = new CtsUrn("urn:cts:greekLit:tlg0031.tlg004.kjv_fu.tok:3.16.1");
const unrelatedUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1");

const goodEntry = CtsCatalogEntry.fromString(entryStr4);


// ==================== TESTS ====================


// --- Confirm Reporting
targetElement.innerHTML += `<div><p  class="test-h2">Confirm Reporting <br/>(These don't count in the summary report.)</p></div>`

testMethod(testCount, entryStr1, message = `Passed. Should have passed.`, testPassed = true, shouldFail = false );
testMethod(testCount, entryStr1, message = `Failed. Should have failed.`, testPassed = false, shouldFail = true );
testMethod(testCount, entryStr1, message = `Passed. Should have failed.`, testPassed = true, shouldFail = true );
testMethod(testCount, entryStr1, message = `Failed. Should have passed.`, testPassed = false, shouldFail = false );

passedCount--; passedCount--;
failedCount --; failedCount --;
// ----End Confirm Reporting

// --- New Tests ---
targetElement.innerHTML += `<div><p  class="test-h2">New Tests</p></div>`

targetElement.innerHTML += "<p>Newly added tests here, for convenience.</p>"

// Passage report
	entryReport(goodEntry);

// Good entry
targetElement.innerHTML += `<div><p class="test-h2">GoodEntry</p></div>`;

try {
  const goodEntry = CtsCatalogEntry.fromString(entryStr1);
  tryToPass(`fromString succeeded for dosreis entry → ${goodEntry.ctsUrn}`);
} catch (error) {
  catchToFail(`fromString failed for dosreis: ${error.message}`);
}

// --- Basic Construction ---
targetElement.innerHTML += `<div><p class="test-h2">Basic Construction (fromString)</p></div>`;

try {
  const e1 = CtsCatalogEntry.fromString(entryStr1);
  tryToPass(`fromString succeeded for dosreis entry → ${e1.ctsUrn}`);
} catch (error) {
  catchToFail(`fromString failed for dosreis: ${error.message}`);
}

try {
  const e4 = CtsCatalogEntry.fromString(entryStr4);
  tryToPass(`fromString succeeded for tokenized KJV → ${e4.ctsUrn}`);
} catch (error) {
  catchToFail(`fromString failed for tokenized KJV: ${error.message}`);
}





// --- Properties ---
targetElement.innerHTML += `<div><p  class="test-h2">Properties</p></div>`


// ==================== FINAL SUMMARY ====================
showSummary();