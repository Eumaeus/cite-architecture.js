
/* =====================================================
   Lightweight browser-based tests for 
   CtsLibrary
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


function entryReport(testLibrary) {
	passedCount++;
	targetElement.innerHTML += `
		<div style="background-color: #ddd;">
		<p>${testCount}. Test passage constructed.</p>
		<p>Corpus: ${testLibrary.corpus.summary}</p>
		${testLibrary.prettyPrintHTML()}
		</div>`;
	testCount++;
}

function testMethod(testnum, library, message, testPassed, shouldFail = false) {
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
        <strong>${testCount}. ${message}</strong>: ${library.toString()}
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

const minimalCex = `
// A minimal CEX serialization of a CtsLibrary

#!ctscatalog
urn#citationScheme#groupName#workTitle#versionLabel#exemplarLabel#online#lang
urn:cts:greekLit:tlg0012.tlg001.mendes:#book/line#Homeric Epic#Iliad#Manuel Odorico Mendes, 1864##true#por
urn:cts:greekLit:tlg0012.tlg001.allen:#book/line#Homeric Epic#Iliad#Greek. Allen, ed. Perseus Digital Library. Creative Commons Attribution 3.0 License##true#grc
urn:cts:croala:kunicr.ilias.croala_ohco2:#book/line#Kunić, Rajmund#Ilias#Latin. Hanc editionem electronicam curavit Neven Jovanović. CroALa 2013.  Modified and distributed under the terms of the CC BY-NC-SA 3.0 HR licence.##false#lat

#!ctsdata
urn:cts:greekLit:tlg0012.tlg001.mendes:1.1#Canta-me, ó deusa, do Peleio Aquiles
urn:cts:greekLit:tlg0012.tlg001.mendes:1.2#A ira tenaz, que, lutuosa aos Gregos,
urn:cts:greekLit:tlg0012.tlg001.mendes:1.3#Verdes no Orco lançou mil fortes almas,
urn:cts:greekLit:tlg0012.tlg001.allen:1.1#Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος 
urn:cts:greekLit:tlg0012.tlg001.allen:1.2#οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε, 
urn:cts:greekLit:tlg0012.tlg001.allen:1.3#πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν 
`;

// Convenience URNs
const mendesUrn   = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.mendes:");
const allenUrn    = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
const kunicUrn    = new CtsUrn("urn:cts:croala:kunicr.ilias.croala_ohco2:");
const workUrn     = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:");          // work-level
const passageUrn  = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.mendes:1.1");
const unknownUrn  = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.perseus-grc1:");

// ==================== TESTS ====================


// --- Confirm Reporting
targetElement.innerHTML += `<div><p  class="test-h2">Confirm Reporting <br/>(These don't count in the summary report.)</p></div>`

testMethod(testCount, "demo", message = `Passed. Should have passed.`, testPassed = true, shouldFail = false );
testMethod(testCount, "demo", message = `Failed. Should have failed.`, testPassed = false, shouldFail = true );
testMethod(testCount, "demo", message = `Passed. Should have failed.`, testPassed = true, shouldFail = true );
testMethod(testCount, "demo", message = `Failed. Should have passed.`, testPassed = false, shouldFail = false );

passedCount--; passedCount--;
failedCount --; failedCount --;
// ----End Confirm Reporting

// --- New Tests ---
targetElement.innerHTML += `<div><p  class="test-h2">New Tests</p></div>`

targetElement.innerHTML += "<p>Newly added tests here, for convenience.</p>"

// Passage report
//libraryReport(goodLibrary1);
//libraryReport(goodLibrary2);


// ================================================================
// 1. fromCex – happy path
// ================================================================

targetElement.innerHTML += `<div><p class="test-h2">Construction & Serialization</p></div>`;

let lib;
try {
  lib = CtsLibrary.fromCex(minimalCex);
  tryToPass("fromCex succeeded with minimal sample");
} catch (e) {
  catchToFail(`fromCex failed: ${e.message}`);
}


if (lib) {
  testMethod(testCount, lib, "catalog length === 3", lib.catalog.length === 3);
  testMethod(testCount, lib, "corpus has 6 passages", lib.corpus.passages.length === 6);
  testMethod(testCount, lib, "onlineTexts().length === 2", lib.onlineTexts().length === 2);
  testMethod(testCount, lib, "offlineTexts().length === 1", lib.offlineTexts().length === 1);
  testMethod(testCount, lib, "Kunić entry is offline", 
    lib.catalog.find(e => e.ctsUrn.equals(kunicUrn)).online === false);
}


// ================================================================
// 2. Constructor validation
// ================================================================
targetElement.innerHTML += `<h2>2. Constructor validation</h2>`;

// Duplicate catalog entry
try {
  const dupEntry = CtsCatalogEntry.fromString(
    "urn:cts:greekLit:tlg0012.tlg001.mendes:#book/line#Homeric Epic#Iliad#Manuel Odorico Mendes, 1864##true#por"
  );
  const badCat = [...lib.catalog, dupEntry];
  new CtsLibrary(badCat, lib.corpus);
  tryToFail("Constructor accepted duplicate catalog entry");
} catch (e) {
  catchToPass(`Correctly rejected duplicate: ${e.message}`);
}


// online=true but missing from corpus
try {
  const offlineKunic = lib.catalog.find(e => e.ctsUrn.equals(kunicUrn));
  // force it online while corpus has no passages for it
  const forcedOnline = new CtsCatalogEntry(
    offlineKunic.ctsUrn, offlineKunic.citationScheme, offlineKunic.groupName,
    offlineKunic.workTitle, offlineKunic.versionLabel, offlineKunic.exemplarLabel,
    true, offlineKunic.lang
  );
  const badCat2 = lib.catalog.map(e => e.ctsUrn.equals(kunicUrn) ? forcedOnline : e);
  new CtsLibrary(badCat2, lib.corpus);
  tryToFail("Constructor accepted online=true with no passages");
} catch (e) {
  catchToPass(`Correctly rejected online mismatch: ${e.message}`);
}


// --- **Catalog Accessors** ---
targetElement.innerHTML += `<div><p class="test-h2">Catalog Accessors</p></div>`


// --- **Subsetting / Retrieval** ---
targetElement.innerHTML += `<div><p class="test-h2">Catalog Accessors</p></div>`




// ==================== FINAL SUMMARY ====================
showSummary();