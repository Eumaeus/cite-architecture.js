
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

function testMethod(testnum, entry, message, testPassed, shouldFail = false) {
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
        <strong>${testCount}. ${message}</strong>: ${entry.toString()}
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
const entryStr1b = "urn:cts:latinLit:phi0448.phi001.dosreis:#OTHERbook/chapter#OTHERCaesar#OTHERDe Bello Gallico#OTHERFrancisco Sotero dos Reis, 1783##true#por";
const entryStr2 = "urn:cts:latinLit:phi0448.phi001.holmes_lat:#book/chapter/section#Caesar#De Bello Gallico#T. Rice Holmes, 1914##true#lat";
const entryStr3 = "urn:cts:greekLit:tlg0031.tlg004.kjv_fu:#chapter/verse#New Testament#John#English: KJV##true#eng";
const entryStr4 = "urn:cts:greekLit:tlg0031.tlg004.kjv_fu.tok:#chapter/verse/token#New Testament#John#English: KJV#tokenized for syntax#true#eng";

// Passage URNs derived from the first and fourth entries
const passageUrn1 = new CtsUrn("urn:cts:latinLit:phi0448.phi001.dosreis:1.1");
const passageUrn4 = new CtsUrn("urn:cts:greekLit:tlg0031.tlg004.kjv_fu.tok:3.16.1");
const passageUrn4b = new CtsUrn("urn:cts:greekLit:tlg0031.tlg004.kjv_fu:3.16.1");
const unrelatedUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1");

const goodEntry = CtsCatalogEntry.fromString(entryStr4);

// Bad Entries
const badUrn = "urn:cts:greekLit:tlg0031.tlg004.kjv_fu#chapter/verse#New Testament#John#English: KJV##true#eng";
const noTextGroup = "urn:cts:greekLit:tlg0031.tlg004.kjv_fu:#chapter/verse# #John#English: KJV##true#eng";
const badLang = "urn:cts:greekLit:tlg0031.tlg004.kjv_fu:#chapter/verse#New Testament#John#English: KJV##true#en";


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

try {
  const eBad = CtsCatalogEntry.fromString(badUrn);
  tryToFail(`Succeeded from bad CEX string. → '${badUrn}'`);
} catch (error) {
  catchToPass(`Errored correctly: ${error.message}`);
}

try {
  const eBad = CtsCatalogEntry.fromString(noTextGroup);
  tryToFail(`Succeeded from bad CEX string. → '${noTextGroup}'`);
} catch (error) {
  catchToPass(`Errored correctly: ${error.message}`);
}


try {
  const eBad = CtsCatalogEntry.fromString(badLang);
  tryToFail(`Succeeded from bad CEX string. → '${badLang}'`);
} catch (error) {
  catchToPass(`Errored correctly: ${error.message}`);
}

// --- Properties ---
targetElement.innerHTML += `<div><p  class="test-h2">Properties</p></div>`

// "urn:cts:greekLit:tlg0031.tlg004.kjv_fu.tok:#chapter/verse/token#New Testament#John#English: KJV#tokenized for syntax#true#eng";

const e1 = CtsCatalogEntry.fromString(entryStr1);
const e4 = CtsCatalogEntry.fromString(entryStr4);

testMethod(testCount, e4, `entry.ctsUrn == 'urn:cts:greekLit:tlg0031.tlg004.kjv_fu.tok:'`, e4.ctsUrn.toString() == "urn:cts:greekLit:tlg0031.tlg004.kjv_fu.tok:" );

testMethod(testCount, e4, `entry.citationScheme == 'chapter/verse/token'`, e4.citationScheme == "chapter/verse/token" );

testMethod(testCount, e4, `entry.textGroup == 'New Testament'`, e4.textGroup == "New Testament" );

testMethod(testCount, e4, `entry.work == 'John'`, e4.work == "John" );

testMethod(testCount, e4, `entry.version == 'English: KJV'`, e4.version == "English: KJV" );

testMethod(testCount, e4, `entry.exemplar == 'tokenized for syntax'`, e4.exemplar == "tokenized for syntax" );

testMethod(testCount, e4, `entry.online == true`, e4.online);

testMethod(testCount, e4, `entry.lang == 'eng'`, e4.lang == "eng" );

// --- Comparison ---
targetElement.innerHTML += `<div><p  class="test-h2">Comparison</p></div>`

const eqEntry1 = CtsCatalogEntry.fromString(entryStr1);
const eqEntry1b = CtsCatalogEntry.fromString(entryStr1b);
const eqEntry2 = CtsCatalogEntry.fromString(entryStr2);

testMethod(testCount, e4, `entry.equals()`, eqEntry1.equals(eqEntry1b) );

testMethod(testCount, e4, `entry.equals()`, eqEntry1b.equals(eqEntry1) );

testMethod(testCount, e4, `entry.equals()`, eqEntry1.equals(eqEntry2) == false );

// --- Cataloging and Describing Texts
targetElement.innerHTML += `<div><p  class="test-h2">Cataloging and Describing Texts</p></div>`

testMethod(testCount, e1, `entry.isEntryForText()`, e1.isEntryForText(passageUrn1) );

testMethod(testCount, e4, `entry.isEntryForText()`, e4.isEntryForText(passageUrn4) );

testMethod(testCount, e4, `entry.isEntryForText()`, e4.isEntryForText(passageUrn4b) == false );

testMethod(testCount, e4, `entry.entryDescribesText()`, e4.entryDescribesText(passageUrn4b) );

// --- Serialization
targetElement.innerHTML += `<div><p  class="test-h2">Serialization</p></div>`

testMethod(testCount, e4, `entry.toString() Roundtrip`, e4.toString() == entryStr4 );

// Test CtsCatalogEntry.prettyPrintHTML()

targetElement.innerHTML += `<h3>Test of CtsCatalogEntry.prettyPrintHTML()</h3><hr>`;
targetElement.innerHTML += e4.prettyPrintHTML();
targetElement.innerHTML += `<hr><p></p>`;


// Test CtsCatalogEntry.prettyPrintMarkdown()

targetElement.innerHTML += `<h3>Test of CtsCatalogEntry.prettyPrintMarkdown()</h3><hr>`;
targetElement.innerHTML += marked.parse(e4.prettyPrintMarkdown());
targetElement.innerHTML += `<hr><p></p>`;

// ==================== FINAL SUMMARY ====================
showSummary();