
/* =====================================================
   Lightweight browser-based tests for CtsPassage
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


function passageReport(testPassage) {
	passedCount++;
	targetElement.innerHTML += `
		<div style="background-color: #ddd;">
		<p>${testCount}. Test passage constructed: <strong>"${testPassage}"</strong></p>
		<ul style="background-color: #eee;">
		<li>urn: ${testPassage.urn}</li>
		<li>text: ${testPassage.text}</li>
		</ul>
		</div>`;
	testCount++;
}

function testMethod(testnum, psg, message, testPassed, shouldFail = false) {
  if (!testPassed && shouldFail) { 
  	passedCount++;
  }
  if (testPassed && !shouldFail) {
  	passedCount++;
  }
  if (testPassed && shouldFail){ 
  	failedTests.push(testnum);
  	failedCount++;
  }
  if (!testPassed && !shouldFail) {
  	failedTests.push(testnum);
  	failedCount++;
  }

  const color = ((testPassed && !shouldFail) || (!testPassed && shouldFail) ) ? "green" : "red";
  targetElement.innerHTML += `
    <div id="test_${testnum}">
      <p style="color: ${color}">
        <strong>${testCount}. ${message}</strong>: ${psg}
      </p>
    </div>
  `;
  testCount++;
}

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


var u1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
var s1 = "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος";
var u2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var s2 = "οὐλομένην, ἣ μυρί' Ἀχαιοῖς ἄλγε' ἔθηκε,";
var u3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.3");
var s3 = "πολλὰς δ' ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν";

var ps1 = "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος";
var ps2 = "urn:cts:greekLit:tlg0012.tlg001.allen:1.2#οὐλομένην, ἣ μυρί' Ἀχαιοῖς ἄλγε' ἔθηκε,";
var ps3 = "urn:cts:greekLit:tlg0012.tlg001.allen:1.3#πολλὰς δ' ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν";

var pipePs = "urn:cts:greekLit:tlg0012.tlg001.allen:1.1|μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος";
var badPs = "urn:ctsgreekLit:tlg0012.tlg001.allen:1.1|μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος";

var rangeUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.2");
var workUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1");
var badUrnStr = "urn:cts:greekLit:tlg0012.tlg001.allen:1.1:";


testPsg1 = new CtsPassage(u1, s1);
testPsg1b = new CtsPassage(u1, s1);
testPsg2 = new CtsPassage(u2, s2);

// ==================== TESTS ====================


// --- Confirm Reporting
targetElement.innerHTML += `<div><p  class="test-h2">Confirm Reporting <br/>(These don't count in the summary report.)</p></div>`

testMethod(testCount, testPsg1, message = `Passed. Should have passed.`, testPassed = true, shouldFail = false );
testMethod(testCount, testPsg1, message = `Failed. Should have failed.`, testPassed = false, shouldFail = true );
testMethod(testCount, testPsg1, message = `Passed. Should have failed.`, testPassed = true, shouldFail = true );
testMethod(testCount, testPsg1, message = `Failed. Should have passed.`, testPassed = false, shouldFail = false );

passedCount--; passedCount--;
failedCount --; failedCount --;
// ----End Confirm Reporting

// --- New Tests ---
targetElement.innerHTML += `<div><p  class="test-h2">New Tests</p></div>`

targetElement.innerHTML += "<p>Newly added tests here, for convenience.</p>"

// --- Basic Construction ---
targetElement.innerHTML += `<div><p  class="test-h2">Basic Construction</p></div>`

// Passage report
validPassage = new CtsPassage(u1, s1);
passageReport(validPassage);

// Good passage 
targetElement.innerHTML += `<h3>Good urn </h3>`;

try {
	goodPassage = new CtsPassage(u1, s1);
	targetElement.innerHTML += `<div><p  style="color: green;">${testCount}. Passage constructed: <strong>"${goodPassage}"</strong></p></div>`;
	passedCount++;
	testCount++;
} catch(error){
	failedCount++;
	errorCount = errorCount + 1;
	testCount++;
  targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Good Passage not constructed! ${error.message}</p></div>`; }

// Range urn
targetElement.innerHTML += `<h3>Range urn should error</h3>`;

try {
	badPassage = new CtsPassage(rangeUrn, s1);
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></p></div>`;
	failedCount++;
	testCount++;
} catch(error){
	passedCount++;
	testCount++;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. Bad passage failed: ${error.message}</p></div>`; }

// Work-level urn
targetElement.innerHTML += `<h3>Work-level urn should error</h3>`;

try {
	badPassage = new CtsPassage(workUrn, s1);
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></p></div>`;
	failedCount++;
	testCount++;
} catch(error){
	testCount++;
	passedCount++;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. Bad passage failed: ${error.message}</p></div>`; }

// Invalid urn
targetElement.innerHTML += `<h3>Invalid urn should error</h3>`;

try {
	badPassage = new CtsPassage(badUrnStr, s1);
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></p></div>`;
	failedCount++;
	testCount++;
} catch(error){
	testCount++;
	passedCount++;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. Bad passage failed: ${error.message}</p></div>`; }

// Empty text
targetElement.innerHTML += `<h3>Empty text should error</h3>`;

try {
	badPassage = new CtsPassage(u1, "");
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></p></div>`;
	failedCount++;
	testCount++;
  console.log(badUrn);
} catch(error){
	testCount++;
	passedCount++;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. Bad passage failed: ${error.message}</p></div>`; }

// Whitespace text
targetElement.innerHTML += `<h3>Whitespace-only text should error</h3>`;

try {
	badPassage = new CtsPassage(u1, "    ");
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></p></div>`;
  console.log(badUrn);
  failedCount++;
	testCount++;
} catch(error){
	testCount++;
	passedCount++;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. Bad passage failed: ${error.message}</p></div>`; }

try {
	badPassage = new CtsPassage(u1, "\t\t\t");
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></p></div>`;
  console.log(badUrn);
  failedCount++;
	testCount++;
} catch(error){
	testCount++;
	passedCount++;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. Bad passage failed: ${error.message}</p></div>`; }

// --- Properties ---
targetElement.innerHTML += `<div><p  class="test-h2">Properties</p></div>`

// CtsPassage.urn
targetElement.innerHTML += `<h3>CtsPassage.urn</h3>`;

testMethod(testCount, testPsg1, `psg.urn == ${u1}`, testPsg1.urn.equals(u1) );

// CtsPassage.text
targetElement.innerHTML += `<h3>CtsPassage.text</h3>`;

testMethod(testCount, testPsg1, `psg.text == ${s1}`, testPsg1.text == s1 );

// --- Basic Methods ---
targetElement.innerHTML += `<div><p  class="test-h2">Basic Methods</p></div>`

// toString() 
targetElement.innerHTML += `<h3>toString()</h3>`;

testMethod(testCount, testPsg1, `psg.toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"`, testPsg1.toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος" );

testMethod(testCount, testPsg1, `psg.toString('#') == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"`, testPsg1.toString('#') == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος" );

testMethod(testCount, testPsg1, `psg.toString('|') == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1|μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"`, testPsg1.toString('|') == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1|μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος" );


// getUrn() 
targetElement.innerHTML += `<h3>getUrn()</h3>`;

testMethod(testCount, testPsg1, `psg.getUrn() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1"`, testPsg1.getUrn() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1" );

// getText() 
targetElement.innerHTML += `<h3>getText()</h3>`;

testMethod(testCount, testPsg1, `psg.getText() == "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"`, testPsg1.getText() == "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος" );

// equals()
targetElement.innerHTML += `<h3>equals()</h3>`;

testMethod(testCount, testPsg1, `psg.equals()`, testPsg1.equals(testPsg1b) );

testMethod(testCount, testPsg1, `SHOULD FAIL: psg.equals()`, testPsg1.equals(testPsg2), true );

// == "string"
targetElement.innerHTML += `<h3>== "string"</h3>`;

testMethod(testCount, testPsg1, `testPsg == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"`, testPsg1 == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος" );

testMethod(testCount, testPsg1, `SHOULD FAIL: testPsg == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"`, testPsg1 == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#οὐλομένην, ἣ μυρί' Ἀχαιοῖς ἄλγε' ἔθηκε,", true );

// == CtsPassage
targetElement.innerHTML += `<h3>== "string"</h3>`;

testMethod(testCount, testPsg1, `testPsg1 == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"`, testPsg1 == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", false  );

testMethod(testCount, testPsg1, `SHOULD FAIL: testPsg1 == testPsg1b (This can never work in Javascript.)`, testPsg1 ==testPsg1b, true );

// --- Helper Functions ---
targetElement.innerHTML += `<div><p  class="test-h2">Helper Functions</p></div>`

// CtsPassage.fromString()
targetElement.innerHTML += `<h3>CtsPassage.fromString()</h3>`;
testMethod(testCount, testPsg1, `CtsPassage.fromString()`, CtsPassage.fromString(ps1) );
testMethod(testCount, testPsg1, `CtsPassage.fromString()`, CtsPassage.fromString(pipePs, '|') );

try {
	badPassage = CtsPassage.fromString(pipePs);
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></p></div>`;
	failedCount++;
	testCount++;
} catch(error){
	testCount++;
	passedCount++;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. Bad passage failed: ${error.message}</p></div>`; }

try {
	badPassage = CtsPassage.fromString(badPs, '|');
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></p></div>`;
	failedCount++;
	testCount++;
} catch(error){
	testCount++;
	passedCount++;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. Bad passage failed: ${error.message}</p></div>`; }
// ==================== FINAL SUMMARY ====================
showSummary();