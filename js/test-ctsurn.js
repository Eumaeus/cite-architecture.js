
/* =====================================================
   Lightweight browser-based tests for CtsUrn
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
		<li>textgroup: ${testUrn.textgroup}</li>
		<li>work: ${testUrn.workid}</li>
		<li>version: ${testUrn.version}</li>
		<li>exemplar: ${testUrn.exemplar}</li>
		<li>passage: ${testUrn.passage}</li>
		</ul>
		</div>`;
	testCount++;
}

function testMethod(testnum, urn, message, testPassed, shouldFail = false) {
  if (!testPassed && shouldFail) passedCount++;
  if (testPassed && !shouldFail) passedCount++;
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
        <strong>${testCount}. ${message}</strong>: ${urn}
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
    <p><strong>Total tests:</strong> ${testCount}</p>
    <p style="color: green"><strong>Passed:</strong> ${passedCount}</p>
    <p style="color: red"><strong>Failed:</strong> ${failedCount - 2}</p>
    <p style="color: navy"><strong>Errored well:</strong> ${errorCount}</p>
    ${failedTestReport}
  `;
  reportElementTop.innerHTML = report;
  reportElementBottom.innerHTML = report;

}

// ====================
// TEST DATA
// ====================

var textGroupUrn = new CtsUrn("urn:cts:greekLit:tlg0012:");
var workUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:");
var versionUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var exemplarUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.token:");

var passageUrn  = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.token:1.1");
var passageUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.token:1.1");

var rangeUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-3.3");

var pdtestUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var pdtestUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var pdtestUrn3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3");

var pdtestRange1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2");
var pdtestRange2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4");
var pdtestRange3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2.3.4");

var workPassage = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:10.12")
var versionPassage = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:24.111")
var exemplarPassage = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tokenized:12.380")
var level1Urn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.ver.tok:1")
var level2Urn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.ver.tok:2.3")
var level3Urn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.ver.tok:4.5")
var level1Range = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.ver.tok:1-2")
var level2Range = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.ver.tok:3.4-4.5")
var level3Range = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.ver.tok:6.7.8-9.10.11")
var identifies1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:24.111")
var identifies2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:24.111")
var identifies3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:24.111")
var identifies3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:24.111.2")
var contains1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:24")
var contains2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:24.1")
var contains3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:24.1.3")
var contains4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:25.1.3")

var urnString = "urn:cts:greekLit:tlg0012.tlg001.allen.tok:25.1.3";

// ==================== TESTS ====================

// --- Confirm Reporting
targetElement.innerHTML += `<div><p  class="test-h2">Confirm Reporting <br/>(These don't count in the summary report.)</p></div>`

testMethod(testCount, textGroupUrn, message = `Passed. Should have passed.`, testPassed = true, shouldFail = false );
testMethod(testCount, textGroupUrn, message = `Failed. Should have failed.`, testPassed = false, shouldFail = true );
testMethod(testCount, textGroupUrn, message = `Passed. Should have failed.`, testPassed = true, shouldFail = true );
testMethod(testCount, textGroupUrn, message = `Failed. Should have passed.`, testPassed = false, shouldFail = false );


// =================================================
// --- New Tests ---
// =================================================
targetElement.innerHTML += `<div><p  class="test-h2">New Tests</p></div>`

targetElement.innerHTML += "<p>Newly added tests here, for convenience.</p>"

// =================================================
// --- Basic Construction & Properties ---
// =================================================
targetElement.innerHTML += `<div><p  class="test-h2">Basic Construction & Properties</p></div>`


 
urnReport(workUrn);
urnReport(versionUrn);
urnReport(exemplarUrn);
urnReport(passageUrn);
urnReport(rangeUrn);
testCount--; // Get back in sync.


// --- CtsUrn.fromString() ---
targetElement.innerHTML += `<div><p  class="test-h2">CtsUrn.fromString()</p></div>`

try {
	testCount++;
	fromStringUrn = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
	targetElement.innerHTML += `<div id="test_${testCount}><p  style="color: green;">${testCount}. Good URN constructed from CtsUrn.fromString(): <strong>${fromStringUrn}</strong></p></div>`;
} catch(error){
	errorCount = errorCount + 1;
	passedCount++;
  targetElement.innerHTML += `<div id="test_${testCount}><p  style="color: red;">${testCount}. Urn not constructed with CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1")! ${error.message}</p></div>`; }


// --- URN Validity ---
targetElement.innerHTML += `<div><p  class="test-h2">URN Validity</p></div>`

// Good urn 
targetElement.innerHTML += `<h3>Good urn </h3>`;
try {
	testCount++;
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
	targetElement.innerHTML += `<div id="test_${testCount}><p  style="color: green;">${testCount}. Good URN passed: <strong>${badUrn}</strong></p></div>`;
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
  targetElement.innerHTML += `<div id="test_${testCount}><p  style="color: red;">${testCount}. SHOULD HAVE FAILED. Good urn rejected! ${error.message}</p></div>`; }

// No final colon
targetElement.innerHTML += `<h3>No final colon</h3>`;
try {
	testCount++;
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001");
	targetElement.innerHTML += `<div id="test_${testCount}><p  style="color: red;">${testCount}. Bad! URN constructed: <strong>${badUrn}</strong></p></div>`;
   console.log(badUrn);
} catch(error){
	errorCount = errorCount + 1;
	passedCount++;
  targetElement.innerHTML += `<div id="test_${testCount}><p  style="color: navy;">${testCount}. Bad urn rejected! ${error.message}</p></div>`; }

// Trailing period 
targetElement.innerHTML += `<h3>Trailing period </h3>`;
try {
	testCount++;
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1.");
	targetElement.innerHTML += `<div id="test_${testCount}><p  style="color: red;">${testCount}. Bad! URN constructed: <strong>${badUrn}</strong></p></div>`;
   console.log(badUrn);
} catch(error){
	errorCount = errorCount + 1;
	passedCount++;
  targetElement.innerHTML += `<div id="test_${testCount}><p  style="color: navy;">${testCount}. Bad urn rejected! ${error.message}</p></div>`; }

// Trailing hyhen
targetElement.innerHTML += `<h3>Trailing hyhen</h3>`;

try {
	testCount++;
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1-");
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: red;">${testCount}. Bad! URN constructed: <strong>${badUrn}</strong></p></div>`;
   console.log(badUrn);
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
  targetElement.innerHTML += `<div id="test_${testCount}><p  style="color: navy;">${testCount}. Bad urn rejected! ${error.message}</p></div>`; }

// Inappropriate final colon
targetElement.innerHTML += `<h3>Inappropriate final colon</h3>`;

try {
	testCount++;
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1:");
	targetElement.innerHTML += `<div id="test_${testCount}"><p  style="color: red;">${testCount}. Bad! URN constructed: <strong>${badUrn}</strong></p></div>`;
   console.log(badUrn);
} catch(error){
	errorCount = errorCount + 1;
	passedCount++;
  targetElement.innerHTML += `<div id="test_${testCount}><p  style="color: navy;">${testCount}. Bad urn rejected! ${error.message}</p></div>`; }

			// Bad Range
targetElement.innerHTML += `<h3>Bad Range</h3>`;
try {
	testCount++;
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1-2.2-3.3");
	targetElement.innerHTML += `<div id="test_${testCount}><p  style="color: red;">${testCount}. Bad! URN constructed: <strong>${badUrn}</strong></p></div>`;
   console.log(badUrn);
} catch(error){
	errorCount = errorCount + 1;
	passedCount++;
  targetElement.innerHTML += `<div id="test_${testCount}><p  style="color: navy;">${testCount}. Bad urn rejected for bad range! ${error.message}</p></div>`; }

// Bad citation
targetElement.innerHTML += `<h3>Bad citation</h3>`;

try {
	testCount++;
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1,3");
	targetElement.innerHTML += `<div id="test_${testCount}><p  style="color: red;">${testCount}. Bad! URN constructed: <strong>${badUrn}</strong></p></div>`;
  console.log(badUrn);
} catch(error){
	errorCount = errorCount + 1;
	passedCount++;
  targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy;">${testCount}. Bad urn rejected! ${error.message}</p></div>`; }

// =================================================
// --- Classification Functions ---
// =================================================
targetElement.innerHTML += `<div><p  class="test-h2">Classification Functions</p></div>`

// hasPassage()
targetElement.innerHTML += `<h3>hasPassage()</h3>`;

testMethod(testCount, passageUrn, "urn.hasPassage()", passageUrn.hasPassage() );
testMethod(testCount, workUrn, "SHOULD FAIL: urn.hasPassage()", workUrn.hasPassage(), true );

// isRange()
targetElement.innerHTML += `<h3>isRange()</h3>`;
testMethod(testCount, rangeUrn, "urn.isRange()", rangeUrn.isRange() );
testMethod(testCount, passageUrn, "SHOULD FAIL: urn.isRange()", passageUrn.isRange(), true );

// isTextGroupUrn()
targetElement.innerHTML += `<h3>isTextGroupUrn()</h3>`;
testMethod(testCount, textGroupUrn, "urn.isTextGroupUrn()", textGroupUrn.isTextGroupUrn() );
testMethod(testCount, versionUrn, "SHOULD FAIL: urn.isTextGroupUrn()", versionUrn.isTextGroupUrn(), true );

// isVersionUrn()
targetElement.innerHTML += `<h3>isVersionUrn()</h3>`;
testMethod(testCount, versionUrn, "urn.isVersionUrn()", versionUrn.isVersionUrn() );
testMethod(testCount, workUrn, "SHOULD FAIL: urn.isVersionUrn()", workUrn.isVersionUrn(), true );

// isExemplarUrn()
targetElement.innerHTML += `<h3>isExemplarUrn()</h3>`;

testMethod(testCount, exemplarUrn, "urn.isExemplarUrn()", exemplarUrn.isExemplarUrn() );
testMethod(testCount, versionUrn, "SHOULD FAIL: urn.isExemplarUrn()", versionUrn.isExemplarUrn(), true );

// passageDepth()
targetElement.innerHTML += `<h3>passageDepth()</h3>`;

testMethod(testCount, pdtestUrn1, `urn.passageDepth() == 1 `, pdtestUrn1.passageDepth() == 1 );

testMethod(testCount, pdtestUrn2, `urn.passageDepth() == 2 `, pdtestUrn2.passageDepth() == 2 );

testMethod(testCount, pdtestUrn3, `urn.passageDepth() == 3 `, pdtestUrn3.passageDepth() == 3 );

try {
	testCount++;
	testMethod(testCount, testRange1, `urn.passageDepth()`, testRange1.passageDepth() == 1 );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.passageDepth()</code> errored correctly testCount = testCount + 1; trying to deal with a range URN: <strong><code>${error}</code></strong></p></div>`;
}

// rangeDepth()
targetElement.innerHTML += `<h3>rangeDepth()</h3>`;

testMethod(testCount, pdtestRange1, `urn.rangeDepth() == [1,1] `, (pdtestRange1.rangeDepth()[0] == 1 && pdtestRange1.rangeDepth()[1] == 1) );

testMethod(testCount, pdtestRange2, `urn.rangeDepth() == [2,2] `, (pdtestRange2.rangeDepth()[0] == 2 && pdtestRange2.rangeDepth()[1] == 2) );

testMethod(testCount, pdtestRange3, `urn.rangeDepth() == [1,3] `, (pdtestRange3.rangeDepth()[0] == 1 && pdtestRange3.rangeDepth()[1] == 3) );

try {
	testCount++;
	testMethod(testCount, testUrn1, `urn.rangeDepth()`, testUrn1.rangeDepth() == 1 ); } catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.rangeDepth()</code> errored correctly testCount = testCount + 1; trying to deal with a passage URN: <strong><code>${error}</code></strong></p></div>`; }

// psgStringDepth()
targetElement.innerHTML += `<h3>psgStringDepth()</h3>`;

tc1 = "1"
tc2 = "1.2"
tc3 = "1.2.3.4"

testMethod(testCount, workPassage, `urn.psgStringDepth(${tc3}, 3) => "1.2.3"`, workPassage.psgStringDepth(tc3, 3) == "1.2.3" );

testMethod(testCount, workPassage, `urn.psgStringDepth(${tc3}, 2) => "1.2"`, workPassage.psgStringDepth(tc3, 2) == "1.2" );

testMethod(testCount, workPassage, `urn.psgStringDepth(${tc3}, 1) => "1.2.3"`, workPassage.psgStringDepth(tc3, 1) == "1" );


tc1 = "1"
tc2 = "1.2"
tc3 = "1.2.3.4"

try {
	testCount++;
	testMethod(testCount, workPassage, `urn.psgStringDepth("", 3)`, workPassage.psgStringDepth("", 3) );
} catch(error){
	errorCount = errorCount + 1;
	passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.psgStringDepth("", 3)</code> errored correctly with an invalid passage string: <strong><code>${error}</code></strong></p></div>`; }

try {
	testCount++;
	testMethod(testCount, workPassage, `urn.psgStringDepth("${tc2}", 3)`, workPassage.psgStringDepth(tc2, 3) );
} catch(error){
	errorCount = errorCount + 1;
	passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.psgStringDepth("${tc2}", 3)</code> errored correctly with an invalid passage string: <strong><code>${error}</code></strong></p></div>`; }

try {
	testCount++;
	testMethod(testCount, workPassage, `urn.psgStringDepth("${tc2}", 0)`, workPassage.psgStringDepth(tc2, 0) );
} catch(error){
	errorCount = errorCount + 1;
	passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.psgStringDepth("${tc2}", 0)</code> errored correctly with an invalid passage string: <strong><code>${error}</code></strong></p></div>`; }


// --- Comparison Functions ---
targetElement.innerHTML += `<div><p  class="test-h2">Comparison Functions</p></div>`

// equals()
targetElement.innerHTML += `<h3>equals()</h3>`;

testMethod(testCount, passageUrn, "urn.equals(CtsUrn, CtsUrn)", passageUrn.equals(passageUrn2) );

testMethod(testCount, passageUrn, "urn.equals(CtsUrn, String)", passageUrn.equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:1.1") );

testMethod(testCount, passageUrn, "SHOULD FAIL: CtsUrn == CtsUrn [WILL NOT WORK! Use urn.equals()]", passageUrn == passageUrn2, true );

testMethod(testCount, passageUrn, "CtsUrn == String", passageUrn == "urn:cts:greekLit:tlg0012.tlg001.allen.token:1.1" );

// versionEquals()
targetElement.innerHTML += `<h3>versionEquals()</h3>`;

var ve1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
var ve2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.2.3");
var ve3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.2");
var ve4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:");
var ve5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.butler:1.1");

testMethod(testCount, 
	ve1, 
	`urn.versionEquals("${ve2}")`, 
	ve1.versionEquals(ve2) == true
);

testMethod(testCount, 
	ve1, 
	`urn.versionEquals("${ve3}")`, 
	ve1.versionEquals(ve3) == true
);

testMethod(testCount, 
	ve1, 
	`urn.versionEquals("${ve3}")`, 
	ve1.versionEquals(ve3) == true
);

testMethod(testCount, 
	ve1, 
	`urn.versionEquals("${ve4}") = false`, 
	ve1.versionEquals(ve4) == false
);

testMethod(testCount, 
	ve1, 
	`urn.versionEquals("${ve5}") == false`, 
	ve1.versionEquals(ve5) == false
);



// passageStrIncludes()
targetElement.innerHTML += `<h3>passageStrIncludes()</h3>`;

var psA1 = "1";
var psA2 = "1.2";
var psA3 = "1.2.3";
var psB1 = "2";
var psB2 = "1.2.4";
var psB3 = "1.2.3.5";

testMethod(testCount, passageUrn, `urn.passageStrIncludes("${psA1}", "${psA2}")`, passageUrn.passageStrIncludes(psA1, psA2, false) );

testMethod(testCount, passageUrn, `urn.passageStrIncludes("${psA1}", "${psA3}")`, passageUrn.passageStrIncludes(psA1, psA3), false );

testMethod(testCount, passageUrn, `urn.passageStrIncludes("${psA2}", "${psA3}")`, passageUrn.passageStrIncludes(psA2, psA3), false );

testMethod(testCount, passageUrn, `urn.passageStrIncludes("${psA2}", "${psB3}")`, passageUrn.passageStrIncludes(psA2, psB3), false );

testMethod(testCount, passageUrn, `SHOULD FAIL: urn.passageStrIncludes("${psA1}", "${psB1}")`, passageUrn.passageStrIncludes(psA1, psB1), true  );

var psA1 = "1";
var psA2 = "1.2";
testMethod(testCount, passageUrn, `SHOULD FAIL: urn.passageStrIncludes("${psA2}", "${psA1}")`, passageUrn.passageStrIncludes(psA2, psA1, true), true  );

testMethod(testCount, passageUrn, `SHOULD FAIL: urn.passageStrIncludes("${psB2}", "${psB3}")`, passageUrn.passageStrIncludes(psB2, psB3), true  );

testMethod(testCount, passageUrn, `SHOULD FAIL: urn.passageStrIncludes("${psA3}", "${psB2}")`, passageUrn.passageStrIncludes(psA3, psB2), true  );

testMethod(testCount, passageUrn, `SHOULD FAIL: urn.passageStrIncludes("${psA2}", "${psA1}")`, passageUrn.passageStrIncludes(psA2, psA1, true), true  );

// areCongruent()
targetElement.innerHTML += `<h3>areCongruent()</h3>`;

var incongU1a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.3");
var incongU1b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.dog:1.1.3");

var incongU2a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.3");
var incongU2b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.butle.tok:1.1.3");

var incongU3a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.3");
var incongU3b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.4");

var incongU4a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.4");
var incongU4b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.4.4");

testMethod(testCount, incongU1a, `SHOULD FAIL: urn.areCongruent(CtsUrn) != "${incongU1a}"`, incongU1a.areCongruent(incongU1b), true );

testMethod(testCount, incongU2a, `SHOULD FAIL: urn.areCongruent(CtsUrn) != "${incongU2b}"`, incongU2a.areCongruent(incongU2b), true );

testMethod(testCount, incongU3a, `SHOULD FAIL: urn.areCongruent(CtsUrn) != "${incongU3b}"`, incongU3a.areCongruent(incongU3b), true );

testMethod(testCount, incongU4a, `SHOULD FAIL: urn.areCongruent(CtsUrn) != "${incongU4b}"`, incongU4a.areCongruent(incongU4b), true );

var congU1a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.2.3");
var congU1b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3");
var congU1c = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2.3");
var congU2a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a.b.c");
var congU2b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a.b");
var congU2c = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a");

testMethod(testCount, congU1a, `urn.areCongruent(CtsUrn) ~= "${congU1b}"`, congU1a.areCongruent(congU1b) );

testMethod(testCount, congU1a, `urn.areCongruent(CtsUrn) ~= "${congU1c}"`, congU1a.areCongruent(congU1c) );

testMethod(testCount, congU1b, `urn.areCongruent(CtsUrn) ~= "${congU1c}"`, congU1b.areCongruent(congU1c) );

testMethod(testCount, congU2a, `urn.areCongruent(CtsUrn) ~= "${congU2b}"`, congU2a.areCongruent(congU2b) );

testMethod(testCount, congU2a, `urn.areCongruent(CtsUrn) ~= "${congU2c}"`, congU2a.areCongruent(congU2c) );

testMethod(testCount, congU2b, `urn.areCongruent(CtsUrn) ~= "${congU2c}"`, congU2b.areCongruent(congU2c) );

var incongR1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-1.2");
var incongR2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-1.3");
var incongR3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-2.2");
var incongR4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2.1");
var incongR5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2");
var incongR6 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-3");

testMethod(testCount, incongR1, `SHOULD FAIL: urn.areCongruent(CtsUrn) = "${incongR2}"`, incongR1.areCongruent(incongR2), true );

testMethod(testCount, incongR1, `SHOULD FAIL: urn.areCongruent(CtsUrn) = "${incongR3}"`, incongR1.areCongruent(incongR3), true );

testMethod(testCount, incongR3, `SHOULD FAIL: urn.areCongruent(CtsUrn) = "${incongR4}"`, incongR3.areCongruent(incongR4), true );

testMethod(testCount, incongR5, `SHOULD FAIL: urn.areCongruent(CtsUrn) = "${incongR6}"`, incongR5.areCongruent(incongR6), true );

var congR1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-3");
var congR2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4");
var congR3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3-3.4");

var congR3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4");
var congR4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2-3.4");
var congR5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2-3");

testMethod(testCount, congR1, `urn.areCongruent(CtsUrn) ~= "${congR2}"`, congR1.areCongruent(congR2) );

testMethod(testCount, congR1, `urn.areCongruent(CtsUrn) ~= "${congR3}"`, congR1.areCongruent(congR3) );

testMethod(testCount, congR3, `urn.areCongruent(CtsUrn) ~= "${congR4}"`, congR3.areCongruent(congR4) );

testMethod(testCount, congR3, `urn.areCongruent(CtsUrn) ~= "${congR5}"`, congR3.areCongruent(congR5) );

// --------------------------
// CtsUrn.isCongruentWith()
targetElement.innerHTML += `<h3>isCongruentWith()</h3>`;

		// work, version, exemplar
var icwWork = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1")
var icwVersion = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1")
var icwExemplar = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1")
		// Passages Only
var icwW1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1")
var icwW2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2")
var icwW2a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.3")
var icwW3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2.3")
var icwW3a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2.4")
		// Version-and-Passage
var icwV1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1")
var icwV2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2")
var icwV2a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.3")
var icwV3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3")
var icwV3a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.4")
var icwE1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1")
var icwE2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.2")
var icwE2a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.3")
var icwE3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.2.3")
var icwE3a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.2.4")
		// Range Version
var icwRW1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1-2")
var icwRW1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1-2.1")
var icwRT1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1-2")
var icwRV1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-2.1")
var icwRV2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-2.2")
var icwRT1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.2-2.1.3")
var icwRT2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.2-2.1.3")
		// Problem Children
cr1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:");
cr2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.605-2.6"); 
cx0 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:1");
cx1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:1-1");
cx2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:1.1-1.3");

testMethod(testCount, 
	cx0, 
	`Hacky solution for point-to-range? urn.areCongruent("${cx0}", "${cx2}")`, 
	cx0.areCongruent(cx2) );

testMethod(testCount, 
	cx2, 
	`Hacky solution for point-to-range? urn.areCongruent("${cx2}", "${cx0}")`, 
	cx2.areCongruent(cx0) );

testMethod(testCount, 
	cx1, 
	`Hacky solution for point-to-range? urn.areCongruent("${cx1}", "${cx2}")`, 
	cx1.areCongruent(cx2) );

var incongR1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-1.2");
var incongR2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-1.3");
var incongR3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-2.2");
var incongR4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2.1");
var incongR4a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2.2");
var incongR5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2");
var incongR6 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-3");

testMethod(testCount, incongR3, `SHOULD FAIL: urn.areCongruent(CtsUrn) = "${incongR4}"`, incongR3.areCongruent(incongR4), true );

testMethod(testCount, incongR3, `urn.areCongruent("${incongR4a}")`, incongR3.areCongruent(incongR4a), false );
testMethod(testCount, incongR1, `SHOULD FAIL: urn.areCongruent(CtsUrn) = "${incongR2}"`, incongR1.areCongruent(incongR2), true );
testMethod(testCount, incongR1, `SHOULD FAIL: urn.areCongruent(CtsUrn) = "${incongR3}"`, incongR1.areCongruent(incongR3), true );

var icwW1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1")
var icwW2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2")
var icwW3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2.3")
var icwV2a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.3")
var icwV1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1")
var icwV2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2")
var icwV2a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.3")
var icwV3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3")
var icwE2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.2")

testMethod(testCount, 
	icwW2, 
	`SHOULD FAIL urn.isCongruentWith("${icwW2.passage}", "${icwW1.passage}")`, 
	icwW2.isCongruentWith(icwW1), true );

testMethod(testCount, 
	icwW3, 
	`SHOULD FAIL urn.isCongruentWith("${icwW3.passage}", "${icwW1.passage}")`, 
	icwW3.isCongruentWith(icwW1), true );

testMethod(testCount, 
	icwV2a, 
	`SHOULD FAIL urn.isCongruentWith("${icwV2a.passage}", "${icwV1.passage}")`, 
	icwV2a.isCongruentWith(icwV1), true );

		// icwV2 icwV3
testMethod(testCount, 
	icwV3, 
	`SHOULD FAIL urn.isCongruentWith("${icwV3.passage}", "${icwV2.passage}")`, 
	icwV3.isCongruentWith(icwV2), true );

		// icwV2 icwV3a
testMethod(testCount, 
	icwE2, 
	`SHOULD FAIL urn.isCongruentWith("${icwE2.passage}", "${icwV2.passage}")`, 
	icwE2.isCongruentWith(icwV2), true );

testMethod(testCount, 
	cr1, 
	`Work -> Version. urn.isCongruentWith("${cr1}", "${cr2}")`, 
	cr1.isCongruentWith(cr2) );

testMethod(testCount, 
	cx0, 
	`Hacky solution for point-to-range? urn.isCongruentWith("${cx0}", "${cx2}")`, 
	cx0.isCongruentWith(cx2) );

testMethod(testCount, 
	cx1, 
	`Hacky solution for point-to-range? urn.isCongruentWith("${cx1}", "${cx2}")`, 
	cx1.isCongruentWith(cx2) );

		// Biblio-levels
testMethod(testCount, 
	icwWork, 
	`Work -> Version. urn.isCongruentWith("${icwWork}", "${icwVersion}")`, 
	icwWork.isCongruentWith(icwVersion) );

testMethod(testCount, 
	icwVersion, 
	`SHOULD FAIL: Version -> Work. urn.isCongruentWith("${icwVersion}", "${icwWork}")`, 
	icwVersion.isCongruentWith(icwWork), true );

testMethod(testCount, 
	icwWork, 
	`Work -> Exemplar. urn.isCongruentWith("${icwWork}", "${icwExemplar}")`, 
	icwWork.isCongruentWith(icwExemplar) );

testMethod(testCount, 
	icwExemplar, 
	`SHOULD FAIL: Exemplar -> Work. urn.isCongruentWith("${icwExemplar}", "${icwWork}")`, 
	icwExemplar.isCongruentWith(icwWork), true );

testMethod(testCount, 
	icwVersion, 
	`Version -> Exemplar. urn.isCongruentWith("${icwVersion}", "${icwExemplar}")`, 
	icwVersion.isCongruentWith(icwExemplar) );

testMethod(testCount, 
	icwExemplar, 
	`SHOULD FAIL: Exemplar -> Version. urn.isCongruentWith("${exemplarUrn}", "${icwVersion}")`, 
	icwExemplar.isCongruentWith(icwVersion), true );

		// Passages
testMethod(testCount, 
	icwW1, 
	`urn.isCongruentWith("${icwW1.passage}", "${icwW2.passage}")`, 
	icwW1.isCongruentWith(icwW2) );

testMethod(testCount, 
	icwW2, 
	`SHOULD FAIL urn.isCongruentWith("${icwW2.passage}", "${icwW1.passage}")`, 
	icwW2.isCongruentWith(icwW1), true );

testMethod(testCount, 
	icwW1, 
	`urn.isCongruentWith("${icwW1.passage}", "${icwW3.passage}")`, 
	icwW1.isCongruentWith(icwW3) );

testMethod(testCount, 
	icwW3, 
	`SHOULD FAIL urn.isCongruentWith("${icwW3.passage}", "${icwW1.passage}")`, 
	icwW3.isCongruentWith(icwW1), true );

testMethod(testCount, 
	icwV1, 
	`urn.isCongruentWith("${icwV1.passage}", "${icwV2a.passage}")`, 
	icwV1.isCongruentWith(icwV2a) );

testMethod(testCount, 
	icwV2a, 
	`SHOULD FAIL urn.isCongruentWith("${icwV2a.passage}", "${icwV1.passage}")`, 
	icwV2a.isCongruentWith(icwV1), true );

		// icwV2 icwV3
testMethod(testCount, 
	icwV2, 
	`urn.isCongruentWith("${icwV2.passage}", "${icwV3.passage}")`, 
	icwV2.isCongruentWith(icwV3) );

testMethod(testCount, 
	icwV3, 
	`SHOULD FAIL urn.isCongruentWith("${icwV3.passage}", "${icwV2.passage}")`, 
	icwV3.isCongruentWith(icwV2), true );

		// icwV2 icwV3a
testMethod(testCount, 
	icwV2, 
	`urn.isCongruentWith("${icwV2.passage}", "${icwV3a.passage}")`, 
	icwV2.isCongruentWith(icwV3a) );

testMethod(testCount, 
	icwE2, 
	`SHOULD FAIL urn.isCongruentWith("${icwV3a.passage}", "${icwV2.passage}")`, 
	icwV3a.isCongruentWith(icwV2), true );

		// icwV2 icwE2
testMethod(testCount, 
	icwV2, 
	`urn.isCongruentWith("${icwV2.passage}", "${icwE2.passage}")`, 
	icwV2.isCongruentWith(icwE2) );

testMethod(testCount, 
	icwE2, 
	`SHOULD FAIL urn.isCongruentWith("${icwE2.passage}", "${icwV2.passage}")`, 
	icwE2.isCongruentWith(icwV2), true );

		// icwV2 icwE3
testMethod(testCount, 
	icwV2, 
	`urn.isCongruentWith("${icwV2.passage}", "${icwE3.passage}")`, 
	icwV2.isCongruentWith(icwE3) );

testMethod(testCount, 
	icwE3, 
	`SHOULD FAIL urn.isCongruentWith("${icwE3.passage}", "${icwV2.passage}")`, 
	icwE3.isCongruentWith(icwV2), true );

		// icwV2 icwE3a
testMethod(testCount, 
	icwV2, 
	`urn.isCongruentWith("${icwV2.passage}", "${icwE3a.passage}")`, 
	icwV2.isCongruentWith(icwE3a) );

testMethod(testCount, 
	icwE3a, 
	`SHOULD FAIL urn.isCongruentWith("${icwE3a.passage}", "${icwV2.passage}")`, 
	icwE3a.isCongruentWith(icwV2), true );

		// icwRW1 icwRV1
testMethod(testCount, 
	icwRW1, 
	`urn.isCongruentWith("${icwRW1.passage}", "${icwRV1.passage}")`, 
	icwRW1.isCongruentWith(icwRV1) );

testMethod(testCount, 
	icwRV1, 
	`SHOULD FAIL urn.isCongruentWith("${icwRV1.passage}", "${icwRW1.passage}")`, 
	icwRV1.isCongruentWith(icwRW1), true );

		// icwRW1 icwRT2
testMethod(testCount, 
	icwRW1, 
	`urn.isCongruentWith("${icwRW1.passage}", "${icwRT2.passage}")`, 
	icwRW1.isCongruentWith(icwRT2) );

testMethod(testCount, 
	icwRT2, 
	`SHOULD FAIL urn.isCongruentWith("${icwRT2.passage}", "${icwRW1.passage}")`, 
	icwRT2.isCongruentWith(icwRW1), true );

	// icwRV1 icwRT1
testMethod(testCount, 
	icwRV1, 
	`urn.isCongruentWith("${icwRV1.passage}", "${icwRT1.passage}")`, 
	icwRV1.isCongruentWith(icwRT1) );

testMethod(testCount, 
	icwRT1, 
	`SHOULD FAIL urn.isCongruentWith("${icwRT1.passage}", "${icwRV1.passage}")`, 
	icwRT1.isCongruentWith(icwRV1), true );

	// Specific
odWorkUrn = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002:");
odVUrn = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray:1.3");
odTUrn = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.1.1");

testMethod(testCount, 
	odWorkUrn, 
	`Work -> Version. urn.isCongruentWith("${odWorkUrn}", "${odVUrn}")`, 
	odWorkUrn.isCongruentWith(odVUrn) );

testMethod(testCount, 
	odWorkUrn, 
	`Work -> Version. urn.isCongruentWith("${odWorkUrn}", "${odTUrn}")`, 
	odWorkUrn.isCongruentWith(odTUrn) );

cr1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:");
cr2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.605-2.6"); 
cx0 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:1");
cx1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:1-1");
cx2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:1.1-1.3");

testMethod(testCount, 
	cx0, 
	`Hacky solution for point-to-range? urn.isCongruentWith("${cx0}", "${cx2}")`, 
	cx0.isCongruentWith(cx2) );

testMethod(testCount, 
	cx1, 
	`Hacky solution for point-to-range? urn.isCongruentWith("${cx1}", "${cx2}")`, 
	cx1.isCongruentWith(cx2) );

testMethod(testCount, 
	cx0, 
	`Hacky solution for point-to-range? urn.areCongruent("${cx0}", "${cx2}")`, 
	cx0.areCongruent(cx2) );

testMethod(testCount, 
	cx2, 
	`Hacky solution for point-to-range? urn.areCongruent("${cx2}", "${cx0}")`, 
	cx2.areCongruent(cx0) );

testMethod(testCount, 
	cx1, 
	`Hacky solution for point-to-range? urn.areCongruent("${cx1}", "${cx2}")`, 
	cx1.areCongruent(cx2) );

testMethod(testCount, 
	cr1, 
	`Work -> Version. urn.isCongruentWith("${cr1}", "${cr2}")`, 
	cr1.isCongruentWith(cr2) );

// ----------------------------
// CtsUrn.biblMatches()

targetElement.innerHTML += `<h3>CtsUrn.biblMatches()</h3>`;

var bm1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a");
var bm2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a");
var bm3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:b");

testMethod(testCount, passageUrn, `urn.biblMatches("${bm1}", "${bm3}")`, bm1.biblMatches(bm3) );

testMethod(testCount, passageUrn, `SHOULD FAIL: urn.biblMatches("${bm1}", "${bm2}")`, bm1.biblMatches(bm2), true );

// ----------------------------
// CtsUr.passageIncludes() / CtsUrn.passageContains()
targetElement.innerHTML += `<h3>CtsUrn.passageIncludes() / CtsUrn.passageContains()</h3>`;

var pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a");
var pi2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a.b");
var pi3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a.b.c");
var pi4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a.b.c");
var pi5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a.b");
var pi6 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a.c");
var noPassage1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray:");
var noPassage2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002:");
var somePassage1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002:2.1");
var somePassage2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray:2.1");

			//   Problem children

var corpGTtester1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.2");
var corpGTtester2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");

var corpGT1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
var corpGT2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");

testMethod(testCount, workUrn, "urn.passageContains() range includes passage", corpGTtester1.passageContains(corpGT1), false );
testMethod(testCount, workUrn, "urn.passageIncludes() range includes passage", corpGTtester1.passageIncludes(corpGT1), false );

			// specify just a text
var gt0 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:");
var gt0yes1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
var gt0no1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:1.1");

testMethod(testCount, gt0, `urn.passageIncludes(${gt0yes1})`, gt0.passageIncludes(gt0yes1) );
testMethod(testCount, gt0, `urn.passageIncludes(${gt0no1})`, gt0.passageIncludes(gt0yes1), false  );

			// precise passage
var gt1p = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var gt1pyes1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var gt1pno1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:1.2");

testMethod(testCount, gt1p, `urn.passageIncludes(${gt1pyes1})`, gt1p.passageIncludes(gt1pyes1) );
testMethod(testCount, gt1p, `SHOULD FAIL: urn.passageIncludes(${gt1pno1})`, gt1p.passageIncludes(gt1pno1), true );

			// precise range
var gt1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.2");
var gt1yes1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.2");
var gt1no1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.2");

testMethod(testCount, gt1, `urn.passageIncludes(${gt1yes1})`, gt1.passageIncludes(gt1yes1), false );
testMethod(testCount, gt1, `urn.passageIncludes(${gt1no1})`, gt1.passageIncludes(gt1no1), false );

			// precise exemplar range
var gt2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2.1-1.3.1");
var gt2yes1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2.1-1.3.1");
var gt2yes2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2-1.3");
var gt2yes3 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1");
var gt2no1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray:1.2.1-1.3.1");

testMethod(testCount, gt2, `urn.passageIncludes(${gt2yes1})`, gt2.passageIncludes(gt2yes1) );
testMethod(testCount, gt2, `SHOULD FAIL: urn.passageIncludes(${gt2yes2})`, gt2.passageIncludes(gt2yes2), true );
testMethod(testCount, gt2, `SHOULD FAIL: urn.passageIncludes(${gt2yes3})`, gt2.passageIncludes(gt2yes3), true );
testMethod(testCount, gt2yes3, `SHOULD FAIL: urn.passageIncludes(${gt2yes3})`, gt2yes3.passageIncludes(gt2), false );
testMethod(testCount, gt2, `SHOULD FAIL: urn.passageIncludes(${gt2no1})`, gt2.passageIncludes(gt2no1), true );

			// containing exemplar range
var gt3 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2-1.3");
var gt3yes1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2-1.3");
var gt3yes2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1");
var gt3no1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2-1.4");

testMethod(testCount, gt3, `urn.passageIncludes(${gt3yes1})`, gt3.passageIncludes(gt3yes1) );
testMethod(testCount, gt3, `SHOULD FAIL: urn.passageIncludes(${gt3yes2})`, gt3.passageIncludes(gt3yes2), true );
testMethod(testCount, gt3yes2, `urn.passageIncludes(${gt3yes2})`, gt3yes2.passageIncludes(gt3), false );
testMethod(testCount, gt3, `SHOULD FAIL: urn.passageIncludes(${gt3no1})`, gt3.passageIncludes(gt3no1), true );

			// version 
var gt4 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray:1.2-1.3");
var gt4yes1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2-1.3");
var gt4yes2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray:1.2-1.3");
var gt4no1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2-1.4");
var gt4no2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002:1.2-1.3");

testMethod(testCount, gt4, `SHOULD FAIL: urn.passageIncludes(${gt4yes1})`, gt4.passageIncludes(gt4yes1), true );
testMethod(testCount, gt4, `urn.passageIncludes(${gt4yes2})`, gt4.passageIncludes(gt4yes2) );
testMethod(testCount, gt4, `SHOULD FAIL: urn.passageIncludes(${gt4no1})`, gt4.passageIncludes(gt4no1), true );
testMethod(testCount, gt4, `SHOULD FAIL: urn.passageIncludes(${gt4no2})`, gt4.passageIncludes(gt4no2), true );

			// work
var gt5 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002:1.2-1.3");
var gt5yes1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2-1.3");
var gt5yes2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray:1.2-1.3");
var gt5yes3 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002:1.2-1.3");
var gt5no1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2-1.3");


testMethod(testCount, noPassage1, `urn.passageIncludes("${somePassage1}", "${somePassage1}")`, somePassage1.passageIncludes(somePassage1) );

testMethod(testCount, noPassage2, `urn.passageIncludes("${noPassage2}", "${somePassage1}")`, noPassage2.passageIncludes(somePassage1) );

testMethod(testCount, noPassage2, `urn.passageIncludes("${noPassage2}", "${somePassage1}")`, noPassage2.passageIncludes(somePassage1) );

testMethod(testCount, passageUrn, `urn.passageIncludes("${pi1}", "${pi2}")`, pi1.passageIncludes(pi2) );

testMethod(testCount, passageUrn, `urn.passageIncludes("${pi1}", "${pi3}")`, pi1.passageIncludes(pi3) );

testMethod(testCount, passageUrn, `urn.passageIncludes("${pi2}", "${pi3}")`, pi2.passageIncludes(pi3) );

testMethod(testCount, passageUrn, `urn.passageIncludes("${pi5}", "${pi4}")`, pi5.passageIncludes(pi4) );

testMethod(testCount, passageUrn, `urn.passageIncludes("${pi1}", "${pi6}")`, pi1.passageIncludes(pi6) );

testMethod(testCount, passageUrn, `SHOULD FAIL: urn.passageIncludes("${pi3}", "${pi4}")`, pi3.passageIncludes(pi4), true  );

testMethod(testCount, passageUrn, `SHOULD FAIL: urn.passageIncludes("${pi2}", "${pi6}")`, pi2.passageIncludes(pi6), true  );

testMethod(testCount, passageUrn, `SHOULD FAIL: urn.passageIncludes("${pi2}", "${pi1}")`, pi2.passageIncludes(pi1), true  );

testMethod(testCount, passageUrn, `SHOULD FAIL: urn.passageIncludes("${pi2}", "${pi1}")`, pi2.passageIncludes(pi1), true  );

testMethod(testCount, passageUrn, `SHOULD FAIL: urn.passageIncludes("${pi4}", "${pi5}")`, pi4.passageIncludes(pi5), true  );

			// passageContains() - Synonym for passageIncludes()
targetElement.innerHTML += `<h3>passageContains(). A synonym for passageIncludes()</h3>`;

testMethod(testCount, passageUrn, `urn.passageContains("${pi1}", "${pi2}")`, pi1.passageContains(pi2) );

testMethod(testCount, passageUrn, `urn.passageContains("${pi1}", "${pi3}")`, pi1.passageContains(pi3) );

testMethod(testCount, passageUrn, `urn.passageContains("${pi2}", "${pi3}")`, pi2.passageContains(pi3) );

// --- Retrieval Functions ---
targetElement.innerHTML += `<div><p  class="test-h2">Retrieval Functions</p></div>`

// toString()
targetElement.innerHTML += `<h3>toString()</h3>`;

var versionPassage = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:24.111")

testMethod(testCount, versionPassage, "urn.getPassage()", versionPassage.toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:24.111" );

// getPassage()
targetElement.innerHTML += `<h3>getPassage()</h3>`;

testMethod(testCount, passageUrn, "urn.getPassage()", passageUrn.getPassage() == "1.1" );

testMethod(testCount, workUrn, "urn.getPassage()", workUrn.getPassage() == "" );

testMethod(testCount, rangeUrn, "urn.getPassage()", rangeUrn.getPassage() == "1.1-3.3" );


// --- Manipulation Functions ---
targetElement.innerHTML += `<div><p  class="test-h2">Manipulation Functions</p></div>`

// dropPassage()
targetElement.innerHTML += `<h3>dropPassage()</h3>`;

testMethod(testCount, passageUrn, `urn.dropPassage() ${passageUrn} -> "urn:cts:greekLit:tlg0012.tlg001.allen.token:"`, passageUrn.dropPassage().equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:") );

// replacePassage()
targetElement.innerHTML += `<h3>replacePassage()</h3>`;

testMethod(testCount, passageUrn, `urn.replacePassage("2.2"}): ${passageUrn} -> "urn:cts:greekLit:tlg0012.tlg001.allen.token:2.2"`, passageUrn.replacePassage("2.2").equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:2.2") );

// splitRange()
targetElement.innerHTML += `<h3>splitRange()</h3>`;

testMethod(testCount, rangeUrn, "urn.splitRange()", ((rangeUrn.splitRange()[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1") && (rangeUrn.splitRange()[1].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3")) );

try {
	testCount++;
	testMethod(testCount, passageUrn, "urn.splitRange()", ((passageUrn.splitRange()[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1") && (passageUrn.splitRange()[1].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3")) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.splitRange()</code> errored correctly with non-range URN: <strong><code>${error}</code></strong></p></div>`; }

testMethod(testCount, 
	rangeUrn,
	"urn.rangeFrom()",
	rangeUrn.rangeFrom().toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1" 
);

testMethod(testCount, 
	rangeUrn,
	"urn.rangeTo()",
	rangeUrn.rangeTo().toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3" 
);

testMethod(testCount, rangeUrn, "urn.splitRange()", ((rangeUrn.splitRange()[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1") && (rangeUrn.splitRange()[1].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3")) );

try {
	testCount++;
	testMethod(testCount, passageUrn, "urn.splitRange()", ((passageUrn.splitRange()[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1") && (passageUrn.splitRange()[1].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3")) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.splitRange()</code> errored correctly with non-range URN: <strong><code>${error}</code></strong></p></div>`; }

// rangeFrom(), rangeStart()
targetElement.innerHTML += `<h3>rangeFrom()</h3>`;

testMethod(testCount, rangeUrn, "urn.rangeFrom()", rangeUrn.rangeFrom().toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1" );

testMethod(testCount, rangeUrn, "urn.rangeStart()", rangeUrn.rangeStart().toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1" );

// rangeTo(), rangeEnd()
targetElement.innerHTML += `<h3>rangeTo()</h3>`;

testMethod(testCount, rangeUrn, "urn.rangeTo()", rangeUrn.rangeTo().toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3" );

testMethod(testCount, rangeUrn, "urn.rangeEnd()", rangeUrn.rangeEnd().toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3" );

// makeRange()
targetElement.innerHTML += `<h3>makeRange()</h3>`;

var testUrn0 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2");
var testUrn3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var testUrn4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:3.4");
var testRange1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-2.2");
var testRange2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:3.3-4.4");

testMethod(testCount, testUrn1, "urn.makeRange()", testUrn1.makeRange(testUrn2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1-2" );

testMethod(testCount, testUrn3, "urn.makeRange()", testUrn3.makeRange(testUrn4) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4" );

testMethod(testCount, testRange1, "urn.makeRange()", testRange1.makeRange(testRange2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1-4.4" );

try {
	testCount++;
	testMethod(testCount, testUrn0, `urn.makeRange()`, testUrn0.makeRange(testUrn3).equals(testUrn3) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.makeRange()</code> errored correctly testCount = testCount + 1;
trying to deal with no-passage URN: <strong><code>${error}</code></strong></p></div>`; }

try {
	testCount++;
	testMethod(testCount, testUrn3, `urn.makeRange()`, testUrn3.makeRange(testUrn0).equals(testUrn3) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.makeRange()</code> errored correctly testCount = testCount + 1;
trying to deal with no-passage URN: <strong><code>${error}</code></strong></p></div>`; }

// versionLevelUrn()
targetElement.innerHTML += `<h3>versionLevelUrn()</h3>`;

testMethod(testCount, exemplarUrn, "urn.versionLevelUrn()", exemplarUrn.versionLevelUrn().toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:" );

try {
	testCount++;
	testMethod(testCount, workUrn, "urn.versionLevelUrn()", workUrn.versionLevelUrn() );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.versionLevelUrn()</code> errored correctly with work-level URN: <strong><code>${error}</code></strong></p></div>`; }

// workLevelUrn()
targetElement.innerHTML += `<h3>workLevelUrn()</h3>`;

testMethod(testCount, exemplarUrn, "urn.workLevelUrn()", exemplarUrn.workLevelUrn().equals(workUrn) );

testMethod(testCount, versionUrn, "urn.workLevelUrn()", versionUrn.workLevelUrn().equals(workUrn) );

// versionFromExemplar()
targetElement.innerHTML += `<h3>versionFromExemplar()</h3>`;

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");

testMethod(testCount, testUrn1, `urn.versionFromExemplar() == ${testUrn2.toString()} `, testUrn1.versionFromExemplar().toString() == testUrn2.toString() );

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");

testMethod(testCount, testUrn1, `urn.versionFromExemplar() == ${testUrn2.toString()} `, testUrn1.versionFromExemplar().toString() == testUrn2.toString() );

// addExemplar()
targetElement.innerHTML += `<h3>addExemplar()</h3>`;

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");

testMethod(testCount, testUrn2, `urn.versionFromExemplar() == ${testUrn1.toString()} `, testUrn2.addExemplar("tok").toString() == testUrn1.toString() );

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");

testMethod(testCount, testUrn2, `urn.versionFromExemplar() == ${testUrn1.toString()} `, testUrn2.addExemplar("tok").toString() == testUrn1.toString() );

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:2.2");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.dog:2.2");

testMethod(testCount, testUrn2, `urn.versionFromExemplar() == ${testUrn1.toString()} `, testUrn2.addExemplar("tok").toString() == testUrn1.toString() );

// addPassage()
targetElement.innerHTML += `<h3>addPassage()</h3>`;

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
var invalidPass1 = "3-4-5";
var invalidPass2 = "3:4";
var validPass1 = "3.4.5";
var validPass2 = "1.definition.3";
var validPass3 = "1.1-2.2";

testMethod(testCount, testUrn1, `urn.addPassage(${validPass1}) == ${testUrn1.toString() + validPass1} `, testUrn1.addPassage(validPass1).toString() == `${testUrn1.toString() + validPass1}` );

testMethod(testCount, testUrn1, `urn.addPassage(${validPass2}) == ${testUrn1.toString() + validPass2} `, testUrn1.addPassage(validPass2).toString() == `${testUrn1.toString() + validPass2}` );

testMethod(testCount, testUrn2, `urn.addPassage(${validPass2}) == ${testUrn1.toString() + validPass2} `, testUrn2.addPassage(validPass2).toString() == `${testUrn1.toString() + validPass2}` );

try {
	testCount = testCount + 1;
	testMethod(testCount, testUrn1, `urn.addPassage(${invalidPass1})`, testUrn1.addPassage(invalidPass1) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.addPassage(${invalidPass1})</code> errored correctly with an invalid passage string: <strong><code>${error}</code></strong></p></div>`; }

try {
	testCount++;
	testMethod(testCount, testUrn1, `urn.addPassage(${invalidPass2})`, testUrn1.addPassage(invalidPass2) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.addPassage(${invalidPass2})</code> errored correctly with an invalid passage string: <strong><code>${error}</code></strong></p></div>`; }

// chopPassage()
targetElement.innerHTML += `<h3>chopPassage()</h3>`;

var testUrn0 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var testUrn3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3");
var testRange2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4");

testMethod(testCount, testUrn0, "urn.chopPassage()", testUrn0.chopPassage() == "urn:cts:greekLit:tlg0012.tlg001.allen:" );

testMethod(testCount, testUrn1, "urn.chopPassage()", testUrn1.chopPassage() == "urn:cts:greekLit:tlg0012.tlg001.allen:" );

testMethod(testCount, testUrn2, "urn.chopPassage()", testUrn2.chopPassage() == "urn:cts:greekLit:tlg0012.tlg001.allen:1" );

testMethod(testCount, testUrn3, "urn.chopPassage()", testUrn3.chopPassage() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2" );

try {
	testCount++;
	testMethod(testCount, testRange2, `urn.chopPassage()`, testRange2.chopPassage().equals(testUrn0) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.chopPassage()</code> errored correctly testCount = testCount + 1;
trying to deal with a range URN: <strong><code>${error}</code></strong></p></div>`; }

// extendPassage()
targetElement.innerHTML += `<h3>extendPassage()</h3>`;

var testUrn0 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var testUrn3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var testRange1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-2.2");

testMethod(testCount, testUrn0, "urn.extendPassage()", testUrn0.extendPassage("x") == "urn:cts:greekLit:tlg0012.tlg001.allen:x" );

testMethod(testCount, testUrn1, "urn.extendPassage()", testUrn1.extendPassage("x") == "urn:cts:greekLit:tlg0012.tlg001.allen:1.x" );

testMethod(testCount, testUrn3, "urn.extendPassage()", testUrn3.extendPassage("x") == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2.x" );

try {
	testCount++;
	testMethod(testCount, testRange1, `urn.extendPassage()`, testRange1.extendPassage("x").equals(testUrn0) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.extendPassage()</code> errored correctly testCount = testCount + 1;
trying to deal with a range URN: <strong><code>${error}</code></strong></p></div>`; }

// passageToDepth()
targetElement.innerHTML += `<h3>passageToDepth()</h3>`;

var pi0 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var pi4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3.4");
var r3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3-4.5.6");
var r4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3.4-5.6");
var r5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2.3.4");

testMethod(testCount, pi4, `urn.passageToDepth(2) => "1.2"`, pi4.passageToDepth(2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2" );

testMethod(testCount, pi4, `urn.passageToDepth(2) => "1.2"`, pi4.passageToDepth(2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2" );

testMethod(testCount, r3, `urn.passageToDepth(2) => "1.2-4.5"`, r3.passageToDepth(2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2-4.5" );

testMethod(testCount, r4, `urn.passageToDepth(2) => "1.2-5.6"`, r4.passageToDepth(2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2-5.6" );

try {
	testCount++;
	testMethod(testCount, pi0, `urn.passageToDepth(2)`, pi0.passageToDepth(2) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.passageToDepth(2)</code> errored correctly, missing a passage-component: <strong><code>${error}</code></strong></p></div>`; }

try {
	testCount++;
	testMethod(testCount, pi1, `urn.passageToDepth(2)`, pi1.passageToDepth(2) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.passageToDepth(2)</code> errored correctly: <strong><code>${error}</code></strong></p></div>`; }

try {
	testCount++;
	testMethod(testCount, r4, `urn.passageToDepth(3)`, r4.passageToDepth(3) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.passageToDepth(3)</code> errored correctly: <strong><code>${error}</code></strong></p></div>`; }

try {
	testCount++;
	testMethod(testCount, r5, `urn.passageToDepth(2)`, r5.passageToDepth(2) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.passageToDepth(2)</code> errored correctly: <strong><code>${error}</code></strong></p></div>`; }

try {
	testCount++;
	testMethod(testCount, pi0, `urn.passageToDepth(2)`, pi0.passageToDepth(2) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.passageToDepth(2)</code> errored correctly, missing a passage-component: <strong><code>${error}</code></strong></p></div>`; }

try {
	testCount++;
	testMethod(testCount, pi1, `urn.passageToDepth(2)`, pi1.passageToDepth(2) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.passageToDepth(2)</code> errored correctly: <strong><code>${error}</code></strong></p></div>`; }

try {
	testCount++;
	testMethod(testCount, r4, `urn.passageToDepth(3)`, r4.passageToDepth(3) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.passageToDepth(3)</code> errored correctly: <strong><code>${error}</code></strong></p></div>`; }

try {
	testCount++;
	testMethod(testCount, r5, `urn.passageToDepth(2)`, r5.passageToDepth(2) );
} catch(error){
	errorCount = errorCount + 1;
passedCount++;
	targetElement.innerHTML += `<div id="test_${testCount}><p style="color: navy">${testCount}. <code>urn.passageToDepth(2)</code> errored correctly: <strong><code>${error}</code></strong></p></div>`; }

// equalizePassageDepths()
targetElement.innerHTML += `<h3>equalizePassageDepths()</h3>`;

var u1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var u2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a.b.c.d");
var r1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3.4-5.6.7");
var r2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a.b.c-d.e.f.g");

testMethod(testCount, u1, `urn.equalizePassageDepths()`, (u1.equalizePassageDepths(u2)[0] == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2") );

testMethod(testCount, u1, `urn.equalizePassageDepths()`, (u1.equalizePassageDepths(u2)[1] == "urn:cts:greekLit:tlg0012.tlg001.allen:a.b") );

testMethod(testCount, r1, `urn.equalizePassageDepths()`, (r1.equalizePassageDepths(r2)[0] == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3-5.6.7") );

testMethod(testCount, r1, `urn.equalizePassageDepths()`, (r1.equalizePassageDepths(r2)[1] == "urn:cts:greekLit:tlg0012.tlg001.allen:a.b.c-d.e.f") );

testMethod(testCount, u1, `urn.equalizePassageDepths()`, (u1.equalizePassageDepths(r2)[0] == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2") );

testMethod(testCount, u1, `urn.equalizePassageDepths()`, (u1.equalizePassageDepths(r2)[1] == "urn:cts:greekLit:tlg0012.tlg001.allen:a.b-d.e") );



// ==================== FINAL SUMMARY ====================
showSummary();