
/* =====================================================
   Lightweight browser-based tests for CtsUrn
   No external dependencies
   ===================================================== */


const targetElement = document.getElementById("test-output");

let testCount = 0;
let errorCount = 0
let passedCount = 0;
let failedCount = 0;

function urnReport(testUrn) {
	testCount = testCount + 1;
	targetElement.innerHTML += `
		<div style="background-color: #ddd;">
		<p>${testCount}. Test URN constructed: <strong>${testUrn}</strong></p>
		<ul style="background-color: #eee;">
		<li>textgroup: ${testUrn.textgroup}</li>
		<li>work: ${testUrn.workid}</li>
		<li>version: ${testUrn.version}</li>
		<li>exemplar: ${testUrn.exemplar}</li>
		<li>passage: ${testUrn.passage}</li>
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
    <h3>Summary</h3>
    <p><strong>Total tests:</strong> ${testCount}</p>
    <p style="color: green"><strong>Passed:</strong> ${passedCount}</p>
    <p style="color: red"><strong>Failed:</strong> ${failedCount}</p>
    <p style="color: navy"><strong>Errored:</strong> ${errorCount}</p>
  `;
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

// ==================== TESTS ====================

// --- New Tests ---



// --- Basic Construction & Properties ---

urnReport(workUrn);
urnReport(versionUrn);
urnReport(exemplarUrn);
urnReport(passageUrn);
urnReport(rangeUrn);

// --- Classification Functions ---

// urn.hasPassage()
testMethod(passageUrn, "urn.hasPassage()", passageUrn.hasPassage() );
testMethod(workUrn, "SHOULD FAIL: urn.hasPassage()", workUrn.hasPassage(), true );

// urn.isRange()
testMethod(rangeUrn, "urn.isRange()", rangeUrn.isRange() );
testMethod(passageUrn, "SHOULD FAIL: urn.isRange()", passageUrn.isRange(), true );

// urn.isTextGroupUrn()
testMethod(textGroupUrn, "urn.isTextGroupUrn()", textGroupUrn.isTextGroupUrn() );
testMethod(versionUrn, "SHOULD FAIL: urn.isTextGroupUrn()", versionUrn.isTextGroupUrn(), true );

// urn.isVersionUrn()
testMethod(versionUrn, "urn.isVersionUrn()", versionUrn.isVersionUrn() );
testMethod(workUrn, "SHOULD FAIL: urn.isVersionUrn()", workUrn.isVersionUrn(), true );

// urn.isExemplarUrn()

testMethod(exemplarUrn, "urn.isExemplarUrn()", exemplarUrn.isExemplarUrn() );
testMethod(versionUrn, "SHOULD FAIL: urn.isExemplarUrn()", versionUrn.isExemplarUrn(), true );

// urn.passageDepth()

testMethod(pdtestUrn1, `urn.passageDepth() == 1 `, pdtestUrn1.passageDepth() == 1 );

testMethod(pdtestUrn2, `urn.passageDepth() == 2 `, pdtestUrn2.passageDepth() == 2 );

testMethod(pdtestUrn3, `urn.passageDepth() == 3 `, pdtestUrn3.passageDepth() == 3 );

// urn.rangeDepth()

testMethod(pdtestRange1, `urn.rangeDepth() == [1,1] `, (pdtestRange1.rangeDepth()[0] == 1 && pdtestRange1.rangeDepth()[1] == 1) );

testMethod(pdtestRange2, `urn.rangeDepth() == [2,2] `, (pdtestRange2.rangeDepth()[0] == 2 && pdtestRange2.rangeDepth()[1] == 2) );

testMethod(pdtestRange3, `urn.rangeDepth() == [1,3] `, (pdtestRange3.rangeDepth()[0] == 1 && pdtestRange3.rangeDepth()[1] == 3) );

// psgStringDepth()

tc1 = "1"
tc2 = "1.2"
tc3 = "1.2.3.4"

testMethod(workPassage, `urn.psgStringDepth(${tc3}, 3) => "1.2.3"`, workPassage.psgStringDepth(tc3, 3) == "1.2.3" );

testMethod(workPassage, `urn.psgStringDepth(${tc3}, 2) => "1.2"`, workPassage.psgStringDepth(tc3, 2) == "1.2" );

testMethod(workPassage, `urn.psgStringDepth(${tc3}, 1) => "1.2.3"`, workPassage.psgStringDepth(tc3, 1) == "1" );


// --- Comparison Functions ---

// equals()

testMethod(passageUrn, "urn.equals(CtsUrn, CtsUrn)", passageUrn.equals(passageUrn2) );

testMethod(passageUrn, "urn.equals(CtsUrn, String)", passageUrn.equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:1.1") );

testMethod(passageUrn, "SHOULD FAIL: CtsUrn == CtsUrn [WILL NOT WORK! Use urn.equals()]", passageUrn == passageUrn2, true );

testMethod(passageUrn, "CtsUrn == String", passageUrn == "urn:cts:greekLit:tlg0012.tlg001.allen.token:1.1" );

// versionEquals()


// passageStrIncludes()

var psA1 = "1";
var psA2 = "1.2";
var psA3 = "1.2.3";
var psB1 = "2";
var psB2 = "1.2.4";
var psB3 = "1.2.3.5";

testMethod(passageUrn, `urn.passageStrIncludes("${psA1}", "${psA2}")`, passageUrn.passageStrIncludes(psA1, psA2) );

testMethod(passageUrn, `urn.passageStrIncludes("${psA1}", "${psA3}")`, passageUrn.passageStrIncludes(psA1, psA3) );

testMethod(passageUrn, `urn.passageStrIncludes("${psA2}", "${psA3}")`, passageUrn.passageStrIncludes(psA2, psA3) );

testMethod(passageUrn, `urn.passageStrIncludes("${psA2}", "${psB3}")`, passageUrn.passageStrIncludes(psA2, psB3) );

testMethod(passageUrn, `SHOULD FAIL: urn.passageStrIncludes("${psA1}", "${psB1}")`, passageUrn.passageStrIncludes(psA1, psB1), true  );

testMethod(passageUrn, `SHOULD FAIL: urn.passageStrIncludes("${psA2}", "${psA1}")`, passageUrn.passageStrIncludes(psA2, psA1), true  );

testMethod(passageUrn, `SHOULD FAIL: urn.passageStrIncludes("${psB2}", "${psB3}")`, passageUrn.passageStrIncludes(psB2, psB3), true  );

testMethod(passageUrn, `SHOULD FAIL: urn.passageStrIncludes("${psA3}", "${psB2}")`, passageUrn.passageStrIncludes(psA3, psB2), true  );

// isCongruentWith()

var incongU1a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.3");
var incongU1b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.dog:1.1.3");

var incongU2a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.3");
var incongU2b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.butle.tok:1.1.3");

var incongU3a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.3");
var incongU3b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.4");

var incongU4a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1.4");
var incongU4b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.4.4");

testMethod(incongU1a, `SHOULD FAIL: urn.isCongruentWith(CtsUrn) != "${incongU1b}"`, incongU1a.isCongruentWith(incongU1b), true );

testMethod(incongU2a, `SHOULD FAIL: urn.isCongruentWith(CtsUrn) != "${incongU2b}"`, incongU2a.isCongruentWith(incongU2b), true );

testMethod(incongU3a, `SHOULD FAIL: urn.isCongruentWith(CtsUrn) != "${incongU3b}"`, incongU3a.isCongruentWith(incongU3b), true );

testMethod(incongU4a, `SHOULD FAIL: urn.isCongruentWith(CtsUrn) != "${incongU4b}"`, incongU4a.isCongruentWith(incongU4b), true );

var congU1a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.2.3");
var congU1b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3");
var congU1c = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2.3");
var congU2a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a.b.c");
var congU2b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a.b");
var congU2c = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a");

testMethod(congU1a, `urn.isCongruentWith(CtsUrn) ~= "${congU1b}"`, congU1a.isCongruentWith(congU1b) );

testMethod(congU1a, `urn.isCongruentWith(CtsUrn) ~= "${congU1c}"`, congU1a.isCongruentWith(congU1c) );

testMethod(congU1b, `urn.isCongruentWith(CtsUrn) ~= "${congU1c}"`, congU1b.isCongruentWith(congU1c) );

testMethod(congU2a, `urn.isCongruentWith(CtsUrn) ~= "${congU2b}"`, congU2a.isCongruentWith(congU2b) );

testMethod(congU2a, `urn.isCongruentWith(CtsUrn) ~= "${congU2c}"`, congU2a.isCongruentWith(congU2c) );

testMethod(congU2b, `urn.isCongruentWith(CtsUrn) ~= "${congU2c}"`, congU2b.isCongruentWith(congU2c) );

var incongR1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-1.2");
var incongR2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-1.3");
var incongR3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-2.2");
var incongR4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2.1");
var incongR5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2");
var incongR6 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-3");

testMethod(incongR1, `SHOULD FAIL: urn.isCongruentWith(CtsUrn) != "${incongR2}"`, incongR1.isCongruentWith(incongR2), true );

testMethod(incongR1, `SHOULD FAIL: urn.isCongruentWith(CtsUrn) != "${incongR3}"`, incongR1.isCongruentWith(incongR3), true );

testMethod(incongR3, `SHOULD FAIL: urn.isCongruentWith(CtsUrn) != "${incongR4}"`, incongR3.isCongruentWith(incongR4), true );

testMethod(incongR5, `SHOULD FAIL: urn.isCongruentWith(CtsUrn) != "${incongR6}"`, incongR5.isCongruentWith(incongR6), true );

var congR1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-3");
var congR2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4");
var congR3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3-3.4");

var congR3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4");
var congR4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2-3.4");
var congR5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.2-3");

testMethod(congR1, `urn.isCongruentWith(CtsUrn) ~= "${congR2}"`, congR1.isCongruentWith(congR2) );

testMethod(congR1, `urn.isCongruentWith(CtsUrn) ~= "${congR3}"`, congR1.isCongruentWith(congR3) );

testMethod(congR3, `urn.isCongruentWith(CtsUrn) ~= "${congR4}"`, congR3.isCongruentWith(congR4) );

testMethod(congR3, `urn.isCongruentWith(CtsUrn) ~= "${congR5}"`, congR3.isCongruentWith(congR5) );

// biblMatches()

var bm1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a");
var bm2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a");
var bm3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:b");

testMethod(passageUrn, `urn.biblMatches("${bm1}", "${bm3}")`, bm1.biblMatches(bm3) );

testMethod(passageUrn, `SHOULD FAIL: urn.biblMatches("${bm1}", "${bm2}")`, bm1.biblMatches(bm2), true );

// passageIncludes()

var pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a");
var pi2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a.b");
var pi3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a.b.c");
var pi4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a.b.c");
var pi5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:a.b");
var pi6 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a.c");

testMethod(passageUrn, `urn.passageIncludes("${pi1}", "${pi2}")`, pi1.passageIncludes(pi2) );

testMethod(passageUrn, `urn.passageIncludes("${pi1}", "${pi3}")`, pi1.passageIncludes(pi3) );

testMethod(passageUrn, `urn.passageIncludes("${pi2}", "${pi3}")`, pi2.passageIncludes(pi3) );

testMethod(passageUrn, `urn.passageIncludes("${pi5}", "${pi4}")`, pi5.passageIncludes(pi4) );

testMethod(passageUrn, `urn.passageIncludes("${pi1}", "${pi6}")`, pi1.passageIncludes(pi6) );

testMethod(passageUrn, `SHOULD FAIL: urn.passageIncludes("${pi3}", "${pi4}")`, pi3.passageIncludes(pi4), true  );

testMethod(passageUrn, `SHOULD FAIL: urn.passageIncludes("${pi2}", "${pi6}")`, pi2.passageIncludes(pi6), true  );

testMethod(passageUrn, `SHOULD FAIL: urn.passageIncludes("${pi2}", "${pi1}")`, pi2.passageIncludes(pi1), true  );

testMethod(passageUrn, `SHOULD FAIL: urn.passageIncludes("${pi2}", "${pi1}")`, pi2.passageIncludes(pi1), true  );

testMethod(passageUrn, `SHOULD FAIL: urn.passageIncludes("${pi4}", "${pi5}")`, pi4.passageIncludes(pi5), true  );

// // --- Retrieval Functions ---

// toString()

// getPassage()

testMethod(
	passageUrn,
	"urn.getPassage()",
	passageUrn.getPassage() == "1.1"
);

testMethod(
	workUrn,
	"urn.getPassage()",
	  workUrn.getPassage() == ""
);

testMethod(
	rangeUrn,
	"urn.getPassage()",
	rangeUrn.getPassage() == "1.1-3.3"
);


// --- Manipulation Functions ---

// dropPassage()

testMethod(
	passageUrn,
	`urn.dropPassage() ${passageUrn} -> "urn:cts:greekLit:tlg0012.tlg001.allen.token:"`,
	passageUrn.dropPassage().equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:")
);

// replacePassage()

testMethod(
	passageUrn,
	`urn.replacePassage("2.2"}): ${passageUrn} -> "urn:cts:greekLit:tlg0012.tlg001.allen.token:2.2"`,
	passageUrn.replacePassage("2.2").equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:2.2") 
);



// -------------------
// passageToDepth()
// -------------------

var pi0 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var pi1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var pi4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3.4");

var r3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3-4.5.6");
var r4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3.4-5.6");
var r5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1-2.3.4");

testMethod(
	pi4,
	`urn.passageToDepth(2) => "1.2"`,
	pi4.passageToDepth(2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2"
);

testMethod(
	pi4,
	`urn.passageToDepth(2) => "1.2"`,
	pi4.passageToDepth(2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2"
);

testMethod(
	r3,
	`urn.passageToDepth(2) => "1.2-4.5"`,
	r3.passageToDepth(2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2-4.5"
);

testMethod(
	r4,
	`urn.passageToDepth(2) => "1.2-5.6"`,
	r4.passageToDepth(2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2-5.6"
);

try {
	testCount = testCount + 1;
	testMethod(
		pi0,
		`urn.passageToDepth(2)`,
		pi0.passageToDepth(2)
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.passageToDepth(2)</code> errored correctly, missing a passage-component: <strong><code>${error}</code></strong></p></div>`;
}

try {
	testCount = testCount + 1;
	testMethod(
		pi1,
		`urn.passageToDepth(2)`,
		pi1.passageToDepth(2)
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.passageToDepth(2)</code> errored correctly: <strong><code>${error}</code></strong></p></div>`;
}

try {
	testCount = testCount + 1;
	testMethod(
		r4,
		`urn.passageToDepth(3)`,
		r4.passageToDepth(3)
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.passageToDepth(3)</code> errored correctly: <strong><code>${error}</code></strong></p></div>`;
}

try {
	testCount = testCount + 1;
	testMethod(
		r5,
		`urn.passageToDepth(2)`,
		r5.passageToDepth(2)
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.passageToDepth(2)</code> errored correctly: <strong><code>${error}</code></strong></p></div>`;
}




// -------------------
// versionFromExemplar()
// -------------------

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");

testMethod(
	testUrn1,
	`urn.versionFromExemplar() == ${testUrn2.toString()} `,
	testUrn1.versionFromExemplar().toString() == testUrn2.toString() 
);

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");

testMethod(
	testUrn1,
	`urn.versionFromExemplar() == ${testUrn2.toString()} `,
	testUrn1.versionFromExemplar().toString() == testUrn2.toString() 
);

// -------------------
// addExemplar()
// -------------------

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:1.1");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");

testMethod(
	testUrn2,
	`urn.versionFromExemplar() == ${testUrn1.toString()} `,
	testUrn2.addExemplar("tok").toString() == testUrn1.toString() 
);

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");

testMethod(
	testUrn2,
	`urn.versionFromExemplar() == ${testUrn1.toString()} `,
	testUrn2.addExemplar("tok").toString() == testUrn1.toString() 
);

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.tok:2.2");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen.dog:2.2");

testMethod(
	testUrn2,
	`urn.versionFromExemplar() == ${testUrn1.toString()} `,
	testUrn2.addExemplar("tok").toString() == testUrn1.toString() 
);


// -------------------
// addPassage()
// -------------------

var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");

var invalidPass1 = "3-4-5";
var invalidPass2 = "3:4";

var validPass1 = "3.4.5";
var validPass2 = "1.definition.3";
var validPass3 = "1.1-2.2";

// Test valid examples
testMethod(
	testUrn1,
	`urn.addPassage(${validPass1}) == ${testUrn1.toString() + validPass1} `,
	testUrn1.addPassage(validPass1).toString() == `${testUrn1.toString() + validPass1}` 
);

// Test valid examples
testMethod(
	testUrn1,
	`urn.addPassage(${validPass2}) == ${testUrn1.toString() + validPass2} `,
	testUrn1.addPassage(validPass2).toString() == `${testUrn1.toString() + validPass2}` 
);

// Test valid examples
testMethod(
	testUrn2,
	`urn.addPassage(${validPass2}) == ${testUrn1.toString() + validPass2} `,
	testUrn2.addPassage(validPass2).toString() == `${testUrn1.toString() + validPass2}` 
);

// Test passage-string validation
try {
	testCount = testCount + 1;
	testMethod(
		testUrn1,
		`urn.addPassage(${invalidPass1})`,
		testUrn1.addPassage(invalidPass1)
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.addPassage(${invalidPass1})</code> errored correctly with an invalid passage string: <strong><code>${error}</code></strong></p></div>`;
}

try {
	testCount = testCount + 1;
	testMethod(
		testUrn1,
		`urn.addPassage(${invalidPass2})`,
		testUrn1.addPassage(invalidPass2)
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.addPassage(${invalidPass2})</code> errored correctly with an invalid passage string: <strong><code>${error}</code></strong></p></div>`;
}



// -------------------
// .equalizePassageDepths()
// -------------------

var u1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var u2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a.b.c.d");
var r1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3.4-5.6.7");
var r2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:a.b.c-d.e.f.g");

testMethod(
	u1,
	`urn.equalizePassageDepths()`,
	(u1.equalizePassageDepths(u2)[0] == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2")
);

testMethod(
	u1,
	`urn.equalizePassageDepths()`,
	(u1.equalizePassageDepths(u2)[1] == "urn:cts:greekLit:tlg0012.tlg001.allen:a.b")
);

testMethod(
	r1,
	`urn.equalizePassageDepths()`,
	(r1.equalizePassageDepths(r2)[0] == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3-5.6.7")
);

testMethod(
	r1,
	`urn.equalizePassageDepths()`,
	(r1.equalizePassageDepths(r2)[1] == "urn:cts:greekLit:tlg0012.tlg001.allen:a.b.c-d.e.f")
);

testMethod(
	u1,
	`urn.equalizePassageDepths()`,
	(u1.equalizePassageDepths(r2)[0] == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2")
);

testMethod(
	u1,
	`urn.equalizePassageDepths()`,
	(u1.equalizePassageDepths(r2)[1] == "urn:cts:greekLit:tlg0012.tlg001.allen:a.b-d.e")
);


// -------------------
// urn.chopPassage()
// -------------------

var testUrn0 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var testUrn3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2.3");

var testRange2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4");

testMethod(
	testUrn0,
	"urn.chopPassage()",
	testUrn0.chopPassage() == "urn:cts:greekLit:tlg0012.tlg001.allen:"
);

testMethod(
	testUrn1,
	"urn.chopPassage()",
	testUrn1.chopPassage() == "urn:cts:greekLit:tlg0012.tlg001.allen:"
);

testMethod(
	testUrn2,
	"urn.chopPassage()",
	testUrn2.chopPassage() == "urn:cts:greekLit:tlg0012.tlg001.allen:1"
);

testMethod(
	testUrn3,
	"urn.chopPassage()",
	testUrn3.chopPassage() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2"
);

try {
	testCount = testCount + 1;
	testMethod(
		testRange2,
		`urn.chopPassage()`,
		testRange2.chopPassage().equals(testUrn0)
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.chopPassage()</code> errored correctly testCount = testCount + 1;
trying to deal with a range URN: <strong><code>${error}</code></strong></p></div>`;
}

// -------------------
// .extendPassage()
// -------------------

var testUrn0 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var testUrn3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");

var testRange1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-2.2");

testMethod(
	testUrn0,
	"urn.extendPassage()",
	testUrn0.extendPassage("x") == "urn:cts:greekLit:tlg0012.tlg001.allen:x"
);

testMethod(
	testUrn1,
	"urn.extendPassage()",
	testUrn1.extendPassage("x") == "urn:cts:greekLit:tlg0012.tlg001.allen:1.x"
);

testMethod(
	testUrn3,
	"urn.extendPassage()",
	testUrn3.extendPassage("x") == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2.x"
);

try {
	testCount = testCount + 1;
	testMethod(
		testRange1,
		`urn.extendPassage()`,
		testRange1.extendPassage("x").equals(testUrn0)
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.extendPassage()</code> errored correctly testCount = testCount + 1;
trying to deal with a range URN: <strong><code>${error}</code></strong></p></div>`;
}

// -------------------
// .makeRange()
// -------------------

var testUrn0 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var testUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var testUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2");
var testUrn3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
var testUrn4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:3.4");

var testRange1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-2.2");
var testRange2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:3.3-4.4");

testMethod(
	testUrn1,
	"urn.makeRange()",
	testUrn1.makeRange(testUrn2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1-2"
);

testMethod(
	testUrn3,
	"urn.makeRange()",
	testUrn3.makeRange(testUrn4) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2-3.4"
);

testMethod(
	testRange1,
	"urn.makeRange()",
	testRange1.makeRange(testRange2) == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1-4.4"
);

try {
	testCount = testCount + 1;
	testMethod(
		testUrn0,
		`urn.makeRange()`,
		testUrn0.makeRange(testUrn3).equals(testUrn3)
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.makeRange()</code> errored correctly testCount = testCount + 1;
trying to deal with no-passage URN: <strong><code>${error}</code></strong></p></div>`;
}

try {
	testCount = testCount + 1;
	testMethod(
		testUrn3,
		`urn.makeRange()`,
		testUrn3.makeRange(testUrn0).equals(testUrn3)
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.makeRange()</code> errored correctly testCount = testCount + 1;
trying to deal with no-passage URN: <strong><code>${error}</code></strong></p></div>`;
}



// -------------------
// getPassage() & hasPassage()
// -------------------


// -------------------
// dropPassage(), replacePassage()
// -------------------

testMethod(
	passageUrn,
	"urn.dropPassage()",

	passageUrn.dropPassage().equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:")
);

testMethod(
	passageUrn,
	"urn.replacePassage({String})",
	passageUrn.replacePassage("2.2").equals("urn:cts:greekLit:tlg0012.tlg001.allen.token:2.2") 
);

// -------------------
// splitRange(), rangeFrom(), rangeTo()
// -------------------

testMethod(
	rangeUrn,
	"urn.splitRange()",
	((rangeUrn.splitRange()[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1") &&
	(rangeUrn.splitRange()[1].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3"))
);

try {
	testCount = testCount + 1;
	testMethod(
		passageUrn,
		"urn.splitRange()",
		((passageUrn.splitRange()[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1") &&
		(passageUrn.splitRange()[1].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3"))
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.splitRange()</code> errored correctly with non-range URN: <strong><code>${error}</code></strong></p></div>`;
}

testMethod(
	rangeUrn,
	"urn.rangeFrom()",
	rangeUrn.rangeFrom().toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1" 
);

testMethod(
	rangeUrn,
	"urn.rangeTo()",
	rangeUrn.rangeTo().toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:3.3" 
);

// -------------------
// versionLevelUrn(), workLevelUrn()
// -------------------

testMethod(
	exemplarUrn,
	"urn.versionLevelUrn()",
	exemplarUrn.versionLevelUrn().toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:" 
);


try {
	testCount = testCount + 1;
	testMethod(
		workUrn,
		"urn.versionLevelUrn()",
		workUrn.versionLevelUrn()
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.versionLevelUrn()</code> errored correctly with work-level URN: <strong><code>${error}</code></strong></p></div>`;
}

testMethod(
	exemplarUrn,
	"urn.workLevelUrn()",
	exemplarUrn.workLevelUrn().equals(workUrn)
);

testMethod(
	versionUrn,
	"urn.workLevelUrn()",
	versionUrn.workLevelUrn().equals(workUrn)
);

// ==================== ERROR TESTS ====================

targetElement.innerHTML += `<h1>Error-Checking Tests</h1>`

tc1 = "1"
tc2 = "1.2"
tc3 = "1.2.3.4"

try {
	testCount = testCount + 1;
	testMethod(
		workPassage,
		`urn.psgStringDepth("", 3)`,
		workPassage.psgStringDepth("", 3)
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.psgStringDepth("", 3)</code> errored correctly with an invalid passage string: <strong><code>${error}</code></strong></p></div>`;
}

try {
	testCount = testCount + 1;
	testMethod(
		workPassage,
		`urn.psgStringDepth("${tc2}", 3)`,
		workPassage.psgStringDepth(tc2, 3)
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.psgStringDepth("${tc2}", 3)</code> errored correctly with an invalid passage string: <strong><code>${error}</code></strong></p></div>`;
}

try {
	testCount = testCount + 1;
	testMethod(
		workPassage,
		`urn.psgStringDepth("${tc2}", 0)`,
		workPassage.psgStringDepth(tc2, 0)
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.psgStringDepth("${tc2}", 0)</code> errored correctly with an invalid passage string: <strong><code>${error}</code></strong></p></div>`;
}


try {
	testCount = testCount + 1;
	testMethod(
		testRange1,
		`urn.passageDepth()`,
		testRange1.passageDepth() == 1
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.passageDepth()</code> errored correctly testCount = testCount + 1;
trying to deal with a range URN: <strong><code>${error}</code></strong></p></div>`;
}

try {
	testCount = testCount + 1;
	testMethod(
		testUrn1,
		`urn.rangeDepth()`,
		testUrn1.rangeDepth() == 1
	);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
	targetElement.innerHTML += `<div><p style="color: navy">${testCount}. <code>urn.rangeDepth()</code> errored correctly testCount = testCount + 1;
trying to deal with a passage URN: <strong><code>${error}</code></strong></p></div>`;
}


try {
	testCount = testCount + 1;
  // Testing with a good URN
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
	targetElement.innerHTML += `<h2 style="color: green;">${testCount}. Good URN passed: <strong>${badUrn}</strong></h2>`;
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2 style="color: red;">${testCount}. SHOULD HAVE FAILED. Good urn rejected! ${error.message}</h2>`;
}

try {
	testCount = testCount + 1;
  // No final colon
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001");
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad urn rejected! ${error.message}</h2>`;
}

try {
	testCount = testCount + 1;
  // Trailing period
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1.");
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad urn rejected! ${error.message}</h2>`;
}

try {
	testCount = testCount + 1;
  // Trailing hyhen
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1-");
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad urn rejected! ${error.message}</h2>`;
}

try {
	testCount = testCount + 1;
  // Inappropriate final colon
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1:");
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad urn rejected! ${error.message}</h2>`;
}

try {
	testCount = testCount + 1;
  // Bad Range
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.1-2.2-3.3");
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad urn rejected! ${error.message}</h2>`;
}

try {
	testCount = testCount + 1;
  // Bad citation
	badUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1,3");
	targetElement.innerHTML += `<h2 style="color: red;">${testCount}. Bad! URN constructed: <strong>${badUrn}</strong></h2>`;
   console.log(badUrn);
} catch(error){
	testCount = testCount + 1;
	errorCount = errorCount + 1;
  // Code to handle the error
  //console.error("An error occurred:", error.message);
  targetElement.innerHTML += `<h2 style="color: navy;">${testCount}. Bad urn rejected! ${error.message}</h2>`;
}

// ==================== FINAL SUMMARY ====================
showSummary();