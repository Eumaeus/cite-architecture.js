
/* =====================================================
  Lightweight browser-based tests for CtsPassage
   No external dependencies
   ===================================================== */


const targetElement = document.getElementById("test-output");

let testCount = 0;
let errorCount = 0
let passedCount = 0;
let failedCount = 0;

function passageReport(testCorpus) {
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	targetElement.innerHTML += `
		<div style="background-color: #ddd;">
		<p>${testCount}. Test corpus constructed: <strong>"${testCorpus}"</strong></p>
		<ul style="background-color: #eee;">
		<li>text: ${testCorpus.text}</li>
		<li>length: ${testPassage.length}</li>
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

corpusString1 = ```urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος
urn:cts:greekLit:tlg0012.tlg001.allen:1.2#οὐλομένην, ἣ μυρί' Ἀχαιοῖς ἄλγε' ἔθηκε,
urn:cts:greekLit:tlg0012.tlg001.allen:1.3#πολλὰς δ' ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν```;

var u1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
var s1 = "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος";
var u2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var s2 = "οὐλομένην, ἣ μυρί' Ἀχαιοῖς ἄλγε' ἔθηκε,";
var u3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.3");
var s3 = "πολλὰς δ' ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν";

p1 = new CtsPassage(u1, s1);
p2 = new CtsPassage(u2, s2);
p3 = new CtsPassage(u3, s3);

a1 = [p1, p2, p3];

c1 = new CtsCorpus(a1);

let p1b = p1

badArray1 = ["urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", p2, p3];
badArray2 = [p1, p1b, p2];


// ==================== TESTS ====================

// --- New Tests ---
targetElement.innerHTML += `<h2 class="test-h2">New Tests</h2>`

// NEW TESTS HERE

targetElement.innerHTML += "<p>Newly added tests here, for convenience.</p>"

// --- Basic Construction ---
targetElement.innerHTML += `<h2 class="test-h2">Basic Construction</h2>`

// Corpus report
validCorpus = new CtsCorpus(c1);
passageReport(validCorpus);

// Good corpus 
targetElement.innerHTML += `<h3>Good corpus </h3>`;

try {
	testCount = testCount + 1;
	goodCorpus = new CtsCorpus(a1);
	targetElement.innerHTML += `<h2 style="color: green;">${testCount}. Passage constructed: <strong>"${goodCorpus}"</strong></h2>`;
	passedCount = passedCount + 1;
} catch(error){
	testCount = testCount + 1;
	failedCount = failedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Good corpus not constructed! ${error.message}</h2>`; }

// Bad corpus: Not an array of CtsPassage
targetElement.innerHTML += `<h3>Bad array</h3>`;

try {
	testCount = testCount + 1;
	badCorpus = new CtsCorpus(badArray1);
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad corpus constructed: <strong>${badPassage}</strong></h2>`;
	failedCount = failedCount + 1;
} catch(error){
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad corpus failed: ${error.message}</h2>`; }

// Bad corpus: Duplicate passages
targetElement.innerHTML += `<h3>Bad array</h3>`;

try {
	testCount = testCount + 1;
	badCorpus = new CtsCorpus(badArray2);
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad corpus constructed: <strong>${badPassage}</strong></h2>`;
	failedCount = failedCount + 1;
} catch(error){
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad corpus failed: ${error.message}</h2>`; }

// --- Properties ---
targetElement.innerHTML += `<h2 class="test-h2">Properties</h2>`

// CtsCorpus.length
targetElement.innerHTML += `<h3>CtsCorpus.length</h3>`;

testMethod(c1, `corpus.length == 3`, c1.length == 3 );

// CtsCorpus.text
testMethod(c1, `corpus.text[0] instanceof CtsPassage`, (c1.text[0] instanceof CtsPassage) && (c1.text[1] instanceof CtsPassage));

// --- Basic Methods ---
targetElement.innerHTML += `<h2 class="test-h2">Methods</h2>`

// toString() 
targetElement.innerHTML += `<h3>toString()</h3>`;

testMethod(c1, `corpus.toString()`, testPsg1.toString() == corpusString1 );

// ==================== FINAL SUMMARY ====================
showSummary();