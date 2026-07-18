
/* =====================================================
   Lightweight browser-based tests for CtsPassage
   No external dependencies
   ===================================================== */


const targetElement = document.getElementById("test-output");

let testCount = 0;
let errorCount = 0
let passedCount = 0;
let failedCount = 0;

function passageReport(testPassage) {
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	targetElement.innerHTML += `
		<div style="background-color: #ddd;">
		<p>${testCount}. Test passage constructed: <strong>"${testPassage}"</strong></p>
		<ul style="background-color: #eee;">
		<li>urn: ${testPassage.urn}</li>
		<li>text: ${testPassage.text}</li>
		</ul>
		</div>`;
}

function testMethod(urn, message, testPassed, shouldFail = false) {
  testCount++;
  if (testPassed || shouldFail) passedCount++;
  else failedCount++;

  const color = (testPassed || shouldFail ) ? "green" : "red";
  targetElement.innerHTML += `
    <div>
      <p style="color: ${color}">
        <strong>${testCount}. ${message}</strong>: ${urn}
      </p>
    </div>
  `;
}

function showSummary() {
  targetElement.innerHTML += `
    <hr>
  	 <div style="background-color: #ccdeff; border: 1px solid navy; padding: 25px;">
    <h3>Summary</h3>
    <p><strong>Total tests:</strong> ${testCount}</p>
    <p style="color: green"><strong>Passed:</strong> ${passedCount}</p>
    <p style="color: red"><strong>Failed:</strong> ${failedCount}</p>
    <p style="color: navy"><strong>Errored well:</strong> ${errorCount}</p>
  	</div>

  `;
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

var rangeUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.2");
var workUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1");
var badUrnStr = "urn:cts:greekLit:tlg0012.tlg001.allen:1.1:";


testPsg1 = new CtsPassage(u1, s1);
testPsg1b = new CtsPassage(u1, s1);
testPsg2 = new CtsPassage(u2, s2);

// ==================== TESTS ====================

// --- New Tests ---
targetElement.innerHTML += `<h2 class="test-h2">New Tests</h2>`

targetElement.innerHTML += "<p>Newly added tests here, for convenience.</p>"

// --- Basic Construction ---
targetElement.innerHTML += `<h2 class="test-h2">Basic Construction</h2>`

// Passage report
validPassage = new CtsPassage(u1, s1);
passageReport(validPassage);

// Good passage 
targetElement.innerHTML += `<h3>Good urn </h3>`;

try {
	testCount = testCount + 1;
	goodPassage = new CtsPassage(u1, s1);
	targetElement.innerHTML += `<h2 style="color: green;">${testCount}. Passage constructed: <strong>"${goodPassage}"</strong></h2>`;
	passedCount = passedCount + 1;
} catch(error){
	testCount = testCount + 1;
	failedCount = failedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Good Passage not constructed! ${error.message}</h2>`; }

// Range urn
targetElement.innerHTML += `<h3>Range urn should error</h3>`;

try {
	testCount = testCount + 1;
	badPassage = new CtsPassage(rangeUrn, s1);
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></h2>`;
	failedCount = failedCount + 1;
} catch(error){
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad passage failed: ${error.message}</h2>`; }

// Work-level urn
targetElement.innerHTML += `<h3>Work-level urn should error</h3>`;

try {
	testCount = testCount + 1;
	badPassage = new CtsPassage(workUrn, s1);
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></h2>`;
} catch(error){
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad passage failed: ${error.message}</h2>`; }

// Invalid urn
targetElement.innerHTML += `<h3>Invalid urn should error</h3>`;

try {
	testCount = testCount + 1;
	badPassage = new CtsPassage(badUrnStr, s1);
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></h2>`;
} catch(error){
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad passage failed: ${error.message}</h2>`; }

// Empty text
targetElement.innerHTML += `<h3>Empty text should error</h3>`;

try {
	testCount = testCount + 1;
	badPassage = new CtsPassage(u1, "");
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></h2>`;
   console.log(badUrn);
} catch(error){
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad passage failed: ${error.message}</h2>`; }

// Whitespace text
targetElement.innerHTML += `<h3>Whitespace-only text should error</h3>`;

try {
	testCount = testCount + 1;
	badPassage = new CtsPassage(u1, "    ");
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></h2>`;
   console.log(badUrn);
} catch(error){
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad passage failed: ${error.message}</h2>`; }

try {
	testCount = testCount + 1;
	badPassage = new CtsPassage(u1, "\t\t\t");
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad passage constructed: <strong>${badPassage}</strong></h2>`;
   console.log(badUrn);
} catch(error){
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad passage failed: ${error.message}</h2>`; }

// --- Properties ---
targetElement.innerHTML += `<h2 class="test-h2">Properties</h2>`

// CtsPassage.urn
targetElement.innerHTML += `<h3>CtsPassage.urn</h3>`;

testMethod(
	testPsg1, 
	`psg.urn == ${u1}`, 
	testPsg1.urn.equals(u1) 
	);

// CtsPassage.text
targetElement.innerHTML += `<h3>CtsPassage.text</h3>`;

testMethod(
	testPsg1, 
	`psg.text == ${s1}`, 
	testPsg1.text == s1 
	);

// --- Basic Methods ---
targetElement.innerHTML += `<h2 class="test-h2">Methods</h2>`

// toString() 
targetElement.innerHTML += `<h3>toString()</h3>`;

testMethod(
	testPsg1, 
	`psg.toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"`, 
	testPsg1.toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"
	);

testMethod(
	testPsg1, 
	`psg.toString('#') == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"`, 
	testPsg1.toString('#') == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"
	);

testMethod(
	testPsg1, 
	`psg.toString('|') == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1|μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"`, 
	testPsg1.toString('|') == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1|μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"
	);


// getUrn() 
targetElement.innerHTML += `<h3>getUrn()</h3>`;

testMethod(
	testPsg1, 
	`psg.getUrn() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1"`, 
	testPsg1.getUrn() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1"
	);

// getText() 
targetElement.innerHTML += `<h3>getText()</h3>`;

testMethod(
	testPsg1, 
	`psg.getText() == "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"`, 
	testPsg1.getText() == "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"
	);

// equals()
targetElement.innerHTML += `<h3>equals()</h3>`;

testMethod(
	testPsg1, 
	`psg.equals()`, 
	testPsg1.equals(testPsg1b)
	);

testMethod(
	testPsg1, 
	`SHOULD FAIL: psg.equals()`, 
	testPsg1.equals(testPsg2), true
	);

// == "string"
targetElement.innerHTML += `<h3>== "string"</h3>`;

testMethod(
	testPsg1, 
	`testPsg == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"`, 
	testPsg1 == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"
	);

testMethod(
	testPsg1, 
	`SHOULD FAIL: testPsg == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος"`, 
	testPsg1 == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#οὐλομένην, ἣ μυρί' Ἀχαιοῖς ἄλγε' ἔθηκε,", true
	);


// == CtsPassage
targetElement.innerHTML += `<h3>== "string"</h3>`;

testMethod(
	testPsg1, 
	`SHOULD FAIL: testPsg1 == testPsg1b (This can never work in Javascript.)`, 
	testPsg1 == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", true
	);



// ==================== FINAL SUMMARY ====================
showSummary();