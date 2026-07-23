
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


function passageReport(testCorpus) {
	passedCount++;
	targetElement.innerHTML += `
		<div style="background-color: #ddd;">
		<p>${testCount}. Test corpus constructed: <strong>"${testCorpus}"</strong></p>
		<ul style="background-color: #eee;">
		<li>texts:<br/>${testCorpus.texts}</li>
		<li>length: ${testCorpus.length}</li>
		<li>passages:<br/>${testCorpus.passages}</li>
		<li>urns:<br/>${testCorpus.urns}</li>
		<li>summary: ${testCorpus.summary}</li>
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
    <p style="color: navy"><strong>Errored well:</strong> ${errorCount}</p>
    ${failedTestReport}
  `;
  reportElementTop.innerHTML = report;
  reportElementBottom.innerHTML = report;

}

// ====================
// TEST DATA
// ====================

// Good Corpus String
var corpusString1 = `urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος
urn:cts:greekLit:tlg0012.tlg001.allen:1.2#οὐλομένην, ἣ μυρί' Ἀχαιοῖς ἄλγε' ἔθηκε,
urn:cts:greekLit:tlg0012.tlg001.allen:1.3#πολλὰς δ' ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν`;

// Good Data (Iliad)
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
let p1b = p1;


// Good Data (Odyssey)

var odysseyVersion1 = CtsPassage.fromString("urn:cts:greekLit:tlg0012.tlg002.murray:1.1#ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ");
var odysseyVersion2 = CtsPassage.fromString("urn:cts:greekLit:tlg0012.tlg002.murray:1.2#πλάγχθη, ἐπεὶ Τροίης ἱερὸν πτολίεθρον ἔπερσεν·");
var odysseyVersion3 = CtsPassage.fromString("urn:cts:greekLit:tlg0012.tlg002.murray:1.3#πολλῶν δʼ ἀνθρώπων ἴδεν ἄστεα καὶ νόον ἔγνω,");

var odysseyToken1 = CtsPassage.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.1.1#ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ");
var odysseyToken2 = CtsPassage.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2.1#πλάγχθη, ἐπεὶ Τροίης ἱερὸν πτολίεθρον ἔπερσεν·");
var odysseyToken3 = CtsPassage.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.3.1#πολλῶν δʼ ἀνθρώπων ἴδεν ἄστεα καὶ νόον ἔγνω,");

var odysseyVersionReff = ["urn:cts:greekLit:tlg0012.tlg002.murray:1.1","urn:cts:greekLit:tlg0012.tlg002.murray:1.2","urn:cts:greekLit:tlg0012.tlg002.murray:1.3"];
var odysseyTokenReff = ["urn:cts:greekLit:tlg0012.tlg002.murray.token:1.1.1","urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2.1","urn:cts:greekLit:tlg0012.tlg002.murray.token:1.3.1"];

var iliadAllenVersion = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var odysseyVersion = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray:");
var odysseyVersion12 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray:1.2");
var odysseyReff = [...odysseyVersionReff, ...odysseyTokenReff];

var odysseyVersionArray = [odysseyVersion1, odysseyVersion2, odysseyVersion3];
var odysseyTokenArray = [odysseyToken1, odysseyToken2, odysseyToken3];

var odysseyVersionCorpus = new CtsCorpus(odysseyVersionArray);
var odysseyTokenCorpus = new CtsCorpus(odysseyTokenArray);
var odysseyCorpus = new CtsCorpus([...odysseyVersionArray, ...odysseyTokenArray]);

var odysseyWork = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002:");
var odysseyVersion = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray:");
var odysseyToken = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray.token:");

// Multiple texts: should be good!
multiTextArray = [p1, p2, p3, odysseyVersion1, odysseyVersion2, odysseyVersion3, odysseyToken1, odysseyToken2, odysseyToken3];
multiTextCorpus = new CtsCorpus(multiTextArray);

// Interleaved texts: should fail!
interleavedArray = [p1, p3, odysseyVersion1, p2, odysseyVersion2, odysseyVersion3]

// Not an array of CtsPassage
badArray1 = ["urn:cts:greekLit:tlg0012.tlg001.allen:1.1#μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", p2, p3];

// Duplicate urns
dupUrnArray = [p1, p1b, p2];

// Inadvertant containing urn
containingElementPassage = new CtsPassage(new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1"), "ἡρώων , αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν" );
containingUrnArray = [p1, p2, p3, containingElementPassage];

// For `fromString()`

cexStringHeader = `#!ctsdata
urn:cts:greekLit:tlg0013.tlg002.fucex:1#Δήμητρ' ἠύκομον, σεμνὴν θεόν, ἄρχομ' ἀείδειν, 
urn:cts:greekLit:tlg0013.tlg002.fucex:2#αὐτὴν ἠδὲ θύγατρα τανύσφυρον, ἣν Ἀιδωνεὺς 
urn:cts:greekLit:tlg0013.tlg002.fucex:3#ἥρπαξεν, δῶκεν δὲ βαρύκτυπος εὐρύοπα Ζεύς, 
urn:cts:greekLit:tlg0013.tlg002.fucex:4#νόσφιν Δήμητρος χρυσαόρου, ἀγλαοκάρπου,`;

cexStringNoHeader = `urn:cts:greekLit:tlg0013.tlg002.fucex:1#Δήμητρ' ἠύκομον, σεμνὴν θεόν, ἄρχομ' ἀείδειν,
urn:cts:greekLit:tlg0013.tlg002.fucex:2#αὐτὴν ἠδὲ θύγατρα τανύσφυρον, ἣν Ἀιδωνεὺς 
urn:cts:greekLit:tlg0013.tlg002.fucex:3#ἥρπαξεν, δῶκεν δὲ βαρύκτυπος εὐρύοπα Ζεύς, 
urn:cts:greekLit:tlg0013.tlg002.fucex:4#νόσφιν Δήμητρος χρυσαόρου, ἀγλαοκάρπου,
`;

longCexString = `#!ctsdata
urn:cts:greekLit:tlg0012.tlg001.allen:1.605#αὐτὰρ ἐπεὶ κατέδυ λαμπρὸν φάος ἠελίοιο ,
urn:cts:greekLit:tlg0012.tlg001.allen:1.606#οἳ μὲν κακκείοντες ἔβαν οἶκον δὲ ἕκαστος ,
urn:cts:greekLit:tlg0012.tlg001.allen:1.607#ἧχι ἑκάστῳ δῶμα περικλυτὸς ἀμφιγυήεις
urn:cts:greekLit:tlg0012.tlg001.allen:1.608#Ἥφαιστος ποίησεν ἰδυίῃσι πραπίδεσσι ·
urn:cts:greekLit:tlg0012.tlg001.allen:1.609#Ζεὺς δὲ πρὸς ὃν λέχος ἤϊ' Ὀλύμπιος ἀστεροπητής ,
urn:cts:greekLit:tlg0012.tlg001.allen:1.610#ἔνθα πάρος κοιμᾶθ' ὅτε μιν γλυκὺς ὕπνος ἱκάνοι ·
urn:cts:greekLit:tlg0012.tlg001.allen:1.611#ἔνθα καθεῦδ' ἀναβάς , παρὰ δὲ χρυσόθρονος Ἥρη .
urn:cts:greekLit:tlg0012.tlg001.allen:2.1#ἄλλοι μέν ῥα θεοί τε καὶ ἀνέρες ἱπποκορυσταὶ
urn:cts:greekLit:tlg0012.tlg001.allen:2.2#εὗδον παννύχιοι , Δία δ' οὐκ ἔχε νήδυμος ὕπνος ,
urn:cts:greekLit:tlg0012.tlg001.allen:2.3#ἀλλ' ὅ γε μερμήριζε κατὰ φρένα ὡς Ἀχιλῆα
urn:cts:greekLit:tlg0012.tlg001.allen:2.4#τιμήσῃ , ὀλέσῃ δὲ πολέας ἐπὶ νηυσὶν Ἀχαιῶν .
urn:cts:greekLit:tlg0012.tlg001.allen:2.5#ἥδε δέ οἱ κατὰ θυμὸν ἀρίστη φαίνετο βουλή ,
urn:cts:greekLit:tlg0012.tlg001.allen:2.6#πέμψαι ἐπ' Ἀτρεΐδῃ Ἀγαμέμνονι οὖλον ὄνειρον ·
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token1#ἔνθʹ
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token2#ὅ
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token3#γε
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token4#παννύχιος
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token5#,
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token6#κεκαλυμμένος
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token7#οἰὸς
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token8#ἀώτῳ
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token9#,
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444.token1#βούλευε
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444.token2#φρεσὶν
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444.token3#ᾗσιν
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444.token4#ὁδὸν
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444.token5#τὴν
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444.token6#πέφραδʹ
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444.token7#Ἀθήνη
urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444.token8#.
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.1.token1#ἦμος
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.1.token2#δʹ
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.1.token3#ἠριγένεια
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.1.token4#φάνη
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.1.token5#ῥοδοδάκτυλος
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.1.token6#Ἠώς
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.1.token7#,
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.2.token1#ὤρνυτʹ
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.2.token2#ἄρʹ
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.2.token3#ἐξ
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.2.token4#εὐνῆφιν
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.2.token5#Ὀδυσσῆος
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.2.token6#φίλος
urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.2.token7#υἱὸς
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token1#"
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token2#μοῦσά
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token3#μοι
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token4#ἔννεπε
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token5#ἔργα
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token6#πολυχρύσου
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token7#Ἀφροδίτης
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token8#,
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:2.token1#Κύπριδος
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:2.token2#,
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:2.token3#ἥτε
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:2.token4#θεοῖσιν
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:2.token5#ἐπὶ
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:2.token6#γλυκὺν
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:2.token7#ἵμερον
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:2.token8#ὦρσε
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:3.token1#καί
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:3.token2#τ’
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:3.token3#ἐδαμάσσατο
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:3.token4#φῦλα
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:3.token5#καταθνητῶν
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:3.token6#ἀνθρώπων
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:4.token1#οἰωνούς
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:4.token2#τε
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:4.token3#διιπετέας
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:4.token4#καὶ
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:4.token5#θηρία
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:4.token6#πάντα
urn:cts:greekLit:tlg0013.tlg005.fucex.tok:4.token7#,`

veryLargeCorpus = CtsCorpus.fromString(longCexString);

cexStringEmpty = "";

// Some URNs

var someIliadUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
var someOdysseyWorkUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002:1.1");
var someOdysseyVersionUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray:1.1");
var someOdysseyTokenUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.1.1");

// ==================== TESTS ====================

// --- Confirm Reporting
targetElement.innerHTML += `<div><p  class="test-h2">Confirm Reporting <br/>(These don't count in the summary report.)</p></div>`

testMethod(testCount, c1, message = `Passed. Should have passed.`, testPassed = true, shouldFail = false );
testMethod(testCount, c1, message = `Failed. Should have failed.`, testPassed = false, shouldFail = true );
testMethod(testCount, c1, message = `Passed. Should have failed.`, testPassed = true, shouldFail = true );
testMethod(testCount, c1, message = `Failed. Should have passed.`, testPassed = false, shouldFail = false );
passedCount--; passedCount--; failedCount--; failedCount--;
// --- End Confirm Reporting

// =================
// === New Tests ===
targetElement.innerHTML += `<div><p  class="test-h2">New Tests</p></div>`


// NEW TESTS HERE
targetElement.innerHTML += "<p>Newly added tests here, for convenience.</p>"

// ==========================
// === Basic Construction ===
targetElement.innerHTML += `<div><p  class="test-h2">Basic Construction</p></div>`

// Corpus report
validCorpus = new CtsCorpus(a1);
passageReport(validCorpus);

// Good corpus 
targetElement.innerHTML += `<h3>Good corpus </h3>`;

testMethod(testCount, odysseyVersionCorpus, `New Corpus: corpus.length == 3`, new CtsCorpus(odysseyVersionArray).length == 3 );

testMethod(testCount, multiTextCorpus, `New Corpus (multiple texts): corpus.length == 6`, new CtsCorpus(multiTextArray).length == 9 );

// Static factory

try {
	emptyCorpus = CtsCorpus.fromString(cexStringEmpty);
	message = `Successfully created a CtsCorpus with an empty passage-array.`;
	tryToPass(message);
} catch(error){
	message = `Errored: ${error.message}`;
	catchToFail(message);
}


try {
	fromStringCorpusNH = CtsCorpus.fromString(cexStringNoHeader);
	message = `Created CtsCorpus with .fromString(): (no header).`
	tryToPass(message);
} catch(error){
	message = `Errored: ${error.message}`
	catchToFail(message);
}


try {
	fromStringCorpus = CtsCorpus.fromString(cexStringHeader);
	message = `Corpus constructed from CtsCorpus.fromString() ("#!ctsdata" header).`;
	tryToPass(message);
} catch(error){
	message = `Errored: ${error.message}`;
	catchToFail(message);
}

try {
	goodCorpus = new CtsCorpus(a1);
	message = `Corpus constructed: "${goodCorpus.summary}".`;
	tryToPass(message);
} catch(error){
	message = `Errored: ${error.message}`;
	catchToFail(message);
}

// Bad corpus: Not an array
targetElement.innerHTML += `<h3>Not an array</h3>`;

try {
	badCorpus = new CtsCorpus(p1);
	message = `Bad corpus constructed.`;
	tryToFail(message);
} catch(error){
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

// Bad corpus: Not an array of CtsPassage
targetElement.innerHTML += `<h3>Bad array: not an array of CtsPassages</h3>`;

try {
	badCorpus = new CtsCorpus(badArray1);
	message = `Bad corpus constructed.`;
	tryToFail(message);
} catch(error){
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

// Bad corpus: Duplicate passages
targetElement.innerHTML += `<h3>Bad array: duplicate passages</h3>`;

try {
	badCorpus = new CtsCorpus(dupUrnArray);
	message = `Bad corpus constructed. Duplicate passages.`;
	tryToFail(message);
} catch(error){
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

// Bad corpus: non-node-level URN
targetElement.innerHTML += `<h3>Bad array: non-node-level URN</h3>`;

try {
	badCorpus = new CtsCorpus(containingUrnArray);
	message = `Bad corpus constructed. Containing URN.`;
	tryToFail(message);
} catch(error){
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

// Bad corpus: interleaved text-passages
targetElement.innerHTML += `<h3>Bad corpus: interleaved text-passages</h3>`;

try {
	badCorpus = new CtsCorpus(interleavedArray);
	message = `Bad corpus constructed. Interleaved texts.`;
	tryToFail(message);
} catch(error){
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}


// ==================
// === Properties ===
targetElement.innerHTML += `<div><p  class="test-h2">Properties</p></div>`

// CtsCorpus.length
targetElement.innerHTML += `<h3>CtsCorpus.length</h3>`;

testMethod(testCount, c1, `corpus.length == 3`, c1.length == 3 );

// CtsCorpus.text
testMethod(testCount, c1, `corpus.text[0] instanceof CtsPassage`, (c1.passages[0] instanceof CtsPassage) && (c1.passages[1] instanceof CtsPassage));

// CtsCorpus.urns
testMethod(testCount, c1, `corpus.urns`, (c1.urns));

testMethod(testCount, c1, `corpus.urns`, (c1.urns.toString() == c1.passages.map(p => p.urn).toString()));

// CtsCorpus.texts

testMethod(testCount, c1, `corpus.texts == 1`, c1.texts.length == 1);

testMethod(testCount, odysseyCorpus, `corpus.texts == 2`, odysseyCorpus.texts.length == 2);

testMethod(testCount, multiTextCorpus, `corpus.texts == 3`, multiTextCorpus.texts.length == 3);

// =====================
// === Basic Methods ===
targetElement.innerHTML += `<div><p  class="test-h2">Methods</p></div>`

// CtsCorpus.toString() 
targetElement.innerHTML += `<h3>CtsCorpus.toString()</h3>`;

testMethod(testCount, c1, `corpus.toString()`, c1.toString() == corpusString1 );

// ================================
// === Query/Assessment Methods ===
targetElement.innerHTML += `<div><p  class="test-h2">Methods</p></div>`

// ctscorpus.hasText()
targetElement.innerHTML += `<h3>ctscorpus.hasText()</h3>`;

testMethod(testCount, c1, `corpus.hasText(): ${c1.summary} :: ${someIliadUrn}`, c1.hasText(someIliadUrn) );
testMethod(testCount, odysseyCorpus, `corpus.hasText(): ${odysseyCorpus.summary} :: ${someOdysseyVersionUrn}`, odysseyCorpus.hasText(someOdysseyVersionUrn) );
testMethod(testCount, odysseyVersionCorpus, `SHOULD FAIL: corpus.hasText(): ${odysseyVersionCorpus.summary} :: ${someOdysseyWorkUrn}`, odysseyVersionCorpus.hasText(someOdysseyWorkUrn), true );
testMethod(testCount, odysseyVersionCorpus, `SHOULD FAIL: corpus.hasText(): ${odysseyVersionCorpus.summary} :: ${someIliadUrn}`, odysseyVersionCorpus.hasText(someIliadUrn), true );


// CtsCorpus.getValidReff()
targetElement.innerHTML += `<h3>ctscorpus.getValidReff()</h3>`;

//			all passages
testMethod(testCount, c1, `corpus.getValidReff()`, c1.getValidReff().toString() == [u1, u2, u3].toString() );

//			version urn
testMethod(testCount, odysseyCorpus, `corpus.getValidReff()`, odysseyVersionCorpus.getValidReff().toString() == odysseyVersionReff.toString() );

//			version urn
testMethod(testCount, multiTextCorpus, `corpus.getValidReff() (${odysseyCorpus.length} passages)`, multiTextCorpus.getValidReff(odysseyVersion).toString() == odysseyCorpus.urns.toString() );

//			work urn
testMethod(testCount, multiTextCorpus, `## corpus.getValidReff() (${odysseyCorpus.length} passages)`, multiTextCorpus.getValidReff(odysseyWork).toString() == odysseyCorpus.urns.toString() );

//			exemplar urn
testMethod(testCount, multiTextCorpus, `corpus.getValidReff() (${odysseyTokenCorpus.length})`, multiTextCorpus.getValidReff(odysseyToken).toString() == odysseyTokenCorpus.urns.toString() );

//			exemplar urn, should exclude version urns
testMethod(testCount, multiTextCorpus, `SHOULD FAIL: corpus.getValidReff() (${odysseyCorpus.length} Odyssey passages, but only ${odysseyTokenCorpus.length} Odyssey-token passages.)`, multiTextCorpus.getValidReff(odysseyToken).toString() == odysseyCorpus.urns.toString(), true );



// CtsCorpus.countValidReff()
targetElement.innerHTML += `<h3>CtsCorpus.countValidReff</h3>`;

testMethod(testCount, multiTextCorpus, `corpus.countValidReff() (${odysseyCorpus.length} passages)`, multiTextCorpus.countValidReff(odysseyVersion) == odysseyCorpus.length );

testMethod(testCount, multiTextCorpus, `corpus.countValidReff() (${odysseyCorpus.length} passages)`, multiTextCorpus.countValidReff(odysseyToken) == odysseyTokenCorpus.length );


// CtsCorpus.isValidRef()
targetElement.innerHTML += `<h3>CtsCorpus.isValidRef</h3>`;

testMethod(testCount, c1, `corpus.isValidRef(${someIliadUrn}) in ${c1.summary}`, c1.isValidRef(someIliadUrn) );

testMethod(testCount, c1, `SHOULD FAIL: corpus.isValidRef(${someOdysseyWorkUrn}) in ${c1.summary}`, c1.isValidRef(someOdysseyWorkUrn), true );

testMethod(testCount, multiTextCorpus, `corpus.isValidRef(${someIliadUrn}) in ${multiTextCorpus.summary}`, multiTextCorpus.isValidRef(someIliadUrn) );

testMethod(testCount, multiTextCorpus, `corpus.isValidRef(${someOdysseyVersionUrn}) in ${multiTextCorpus.summary}`, multiTextCorpus.isValidRef(someOdysseyVersionUrn) );

testMethod(testCount, multiTextCorpus, `SHOULD FAIL: corpus.isValidRef(${someOdysseyWorkUrn}) in ${multiTextCorpus.summary}`, multiTextCorpus.isValidRef(someOdysseyWorkUrn), true );

testMethod(testCount, odysseyVersionCorpus, `corpus.isValidRef(${someOdysseyVersionUrn}) in ${multiTextCorpus.summary}`, multiTextCorpus.isValidRef(someOdysseyVersionUrn), false );

testMethod(testCount, odysseyVersionCorpus, `SHOULD FAIL: corpus.isValidRef(${someOdysseyTokenUrn}) in ${odysseyVersionCorpus.summary}`, odysseyVersionCorpus.isValidRef(someOdysseyTokenUrn), true );

testMethod(testCount, odysseyCorpus, `corpus.isValidRef(${someOdysseyTokenUrn}) in ${odysseyCorpus.summary}`, odysseyCorpus.isValidRef(someOdysseyTokenUrn) );

testMethod(testCount, odysseyCorpus, `SHOULD FAIL: corpus.isValidRef(${someIliadUrn}) in ${odysseyCorpus.summary}`, odysseyCorpus.isValidRef(someIliadUrn), true );


// CtsCorpus.getValidReff()
var gvrKnown2Work = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:");
var gvrKnown2Work2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:");
var gvrKnown2Work3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.3");
var gvrKnown2Work4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:1.3");
var gvrKnown2Work5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.2");
var gvrBook1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1");
var gvrBook2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2");
var gvrBookLine = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444");
var grvRange1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.2");
var grvRange2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-1.3");
var grvRange3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.610-2.2");
var reallyBadUrn1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.x-1.2");
var reallyBadUrn2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.x");


testMethod(testCount, multiTextCorpus, `corpus.getValidReff() Allen Range 1.1-1.2  in ${multiTextCorpus.summary} with ${gvrKnown2Work5}`, multiTextCorpus.getValidReff(gvrKnown2Work5).length == 2);

testMethod(testCount, multiTextCorpus, `corpus.getValidReff() Range 1.1-1.2  in ${multiTextCorpus.summary} with ${grvRange1}`, multiTextCorpus.getValidReff(grvRange1).length == 2);

testMethod(testCount, multiTextCorpus, `corpus.getValidReff() Range 1.2-1.3  in ${multiTextCorpus.summary} with ${grvRange2}`, multiTextCorpus.getValidReff(grvRange2).length == 2);

testMethod(testCount, multiTextCorpus, `corpus.getValidReff() Version Book 1  in ${multiTextCorpus.summary} with ${gvrBook1}`, multiTextCorpus.getValidReff(gvrBook1).length == 3);

testMethod(testCount, multiTextCorpus, `corpus.getValidReff() Specific 1.3 in ${multiTextCorpus.summary} with ${gvrKnown2Work3}`, multiTextCorpus.getValidReff(gvrKnown2Work3).length == 1);

testMethod(testCount, veryLargeCorpus, `corpus.getValidReff() Version Book 2  in ${multiTextCorpus.summary} with ${gvrBook2}`, veryLargeCorpus.getValidReff(gvrBook2).length == 6);

testMethod(testCount, multiTextCorpus, `SHOULD FAIL: corpus.getValidReff() Version Book 1  in ${multiTextCorpus.summary} with ${gvrBook2}`, multiTextCorpus.getValidReff(gvrBook2).length == 3, true);

testMethod(testCount, multiTextCorpus, `corpus.getValidReff() Version-Level in ${multiTextCorpus.summary} with ${gvrKnown2Work}`, multiTextCorpus.getValidReff(gvrKnown2Work).length == 3);

testMethod(testCount, veryLargeCorpus, `corpus.getValidReff() Version-Level in ${veryLargeCorpus.summary} with ${gvrKnown2Work}`, veryLargeCorpus.getValidReff(gvrKnown2Work).length == 13);

testMethod(testCount, multiTextCorpus, `corpus.getValidReff() Work-Level in ${multiTextCorpus.summary} with ${gvrKnown2Work2}`, multiTextCorpus.getValidReff(gvrKnown2Work2).length == 3);

testMethod(testCount, veryLargeCorpus, `corpus.getValidReff() Work-Level in ${veryLargeCorpus.summary} with ${gvrKnown2Work2}`, veryLargeCorpus.getValidReff(gvrKnown2Work2).length == 13);

testMethod(testCount, multiTextCorpus, `corpus.getValidReff() 1.x-1.2  in ${multiTextCorpus.summary} with ${reallyBadUrn1}`, multiTextCorpus.getValidReff(reallyBadUrn1).length == 0);

testMethod(testCount, multiTextCorpus, `corpus.getValidReff() 1.1-1.x  in ${multiTextCorpus.summary} with ${reallyBadUrn2}`, multiTextCorpus.getValidReff(reallyBadUrn2).length == 0);



// CtsCorpus.isValidRange()
targetElement.innerHTML += `<h3>CtsCorpus.isValidRange</h3>`;

var vRange1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.610-2.2");
var vRange2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token1-1.444.token8");
var vRange3 = CtsUrn.fromString("urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token1-4.token7");
var vRange5 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.3");
var ivRange1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1-2");
var ivRange2 = CtsUrn.fromString("urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token1-5.token7");

testMethod(testCount, veryLargeCorpus, `corpus.isValidRange(${vRange1}) in ${veryLargeCorpus.summary}`, veryLargeCorpus.isValidRange(vRange1) );

testMethod(testCount, veryLargeCorpus, `corpus.isValidRange(${vRange2}) in ${veryLargeCorpus.summary}`, veryLargeCorpus.isValidRange(vRange2) );

testMethod(testCount, veryLargeCorpus, `corpus.isValidRange(${vRange3}) in ${veryLargeCorpus.summary}`, veryLargeCorpus.isValidRange(vRange3) );

testMethod(testCount, c1, `corpus.isValidRange(${vRange5}) in ${c1.summary}`, c1.isValidRange(vRange5) );

testMethod(testCount, veryLargeCorpus, `SHOULD FAIL: corpus.isValidRange(${ivRange1}) in ${veryLargeCorpus.summary}`, veryLargeCorpus.isValidRange(ivRange1), true );

testMethod(testCount, veryLargeCorpus, `SHOULD FAIL: corpus.isValidRange(${ivRange2}) in ${veryLargeCorpus.summary}`, veryLargeCorpus.isValidRange(ivRange2), true);

// CtsCorpus.corpusRanges()
targetElement.innerHTML += `<h3>CtsCorpus.corpusRanges</h3>`;

var vlcr1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.605-2.6");
var vlcr2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token1-2.2.token7");
var vlcr3 = CtsUrn.fromString("urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token1-4.token7");
var c1r = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.3");

var vlcRA = [vlcr1, vlcr2, vlcr3];
var c1RA = [c1r];

var line443Urn = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443");
var line443Range = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token1-1.443.token9")

testMethod(testCount, veryLargeCorpus, `corpus.corpusRanges() in ${veryLargeCorpus.summary}`, veryLargeCorpus.corpusRanges().toString() == vlcRA.toString());

testMethod(testCount, veryLargeCorpus, `corpus.corpusRanges("urn:cts:greekLit:tlg0012.tlg001.allen:") in ${veryLargeCorpus.summary}`, veryLargeCorpus.corpusRanges(CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:")).toString() == [vlcr1].toString());

testMethod(testCount, c1, `corpus.corpusRanges("urn:cts:greekLit:tlg0012.tlg001:") in ${c1.summary}`, c1.corpusRanges(CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:")).toString() == [c1r].toString());

testMethod(testCount, c1, `corpus.corpusRanges("urn:cts:greekLit:tlg0012.tlg001.allen:") in ${c1.summary}`, c1.corpusRanges(CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:")).toString() == [c1r].toString());

testMethod(testCount, c1, `corpus.corpusRanges("urn:cts:greekLit:tlg0012.tlg001.allen:1") in ${c1.summary}`, c1.corpusRanges(CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1")).toString() == [c1r].toString());

var line443Urn = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.tok:");
var line443Range = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token1-2.2.token7")

testMethod(testCount, veryLargeCorpus, `corpus.corpusRanges(${line443Urn}) in ${veryLargeCorpus.summary}`, veryLargeCorpus.corpusRanges(line443Urn).toString() == [line443Range].toString());

// CtsCorpus.listTexts()
targetElement.innerHTML += `<h3>CtsCorpus.listTexts</h3>`;

var lturn1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:");
var lturn2 = odysseyWork;
var lturn3 = odysseyVersion;
var lturn4 = odysseyToken;
var lturn5 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");


testMethod(testCount, multiTextCorpus, `corpus.listTexts() in ${multiTextCorpus.summary}`, multiTextCorpus.listTexts().toString() == [lturn1, lturn3, lturn4].toString() );

testMethod(testCount, multiTextCorpus, `corpus.listTexts() in ${multiTextCorpus.summary}`, multiTextCorpus.listTexts(lturn2).toString() == [lturn3, lturn4].toString() );

testMethod(testCount, multiTextCorpus, `corpus.listTexts() in ${multiTextCorpus.summary}`, multiTextCorpus.listTexts(lturn3).toString() == [lturn3, lturn4].toString() );

testMethod(testCount, multiTextCorpus, `corpus.listTexts() in ${multiTextCorpus.summary}`, multiTextCorpus.listTexts(lturn4).toString() == [lturn4].toString() );

testMethod(testCount, multiTextCorpus, `corpus.listTexts() in ${multiTextCorpus.summary}`, multiTextCorpus.listTexts(lturn5).toString() == [lturn1].toString() );

// CtsCorpus.rangesFromPassages()
targetElement.innerHTML += `<h3>CtsCorpus.rangesFromPassages</h3>`;

testMethod(testCount, c1, `corpus.rangesFromPassages() in ${c1.summary}`, c1.rangesFromPassages([p1,p2]).toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.2" );

testMethod(testCount, c1, `corpus.rangesFromPassages() in ${c1.summary}`, c1.rangesFromPassages([p2,p3]).toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2-1.3" );

// =========================================================
// -- Refining / Text Retrieval Methods

// CtsCorpus.textCorpora()
targetElement.innerHTML += `<h3>CtsCorpus.textCorpora</h3>`;

testMethod(testCount, multiTextCorpus, `corpus.textCorpora() in ${multiTextCorpus.summary}`, multiTextCorpus.textCorpora().length == 3 );

testMethod(testCount, multiTextCorpus, `corpus.textCorpora() in ${multiTextCorpus.summary}`, multiTextCorpus.textCorpora()[0].urns[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1" );

testMethod(testCount, multiTextCorpus, `corpus.textCorpora() in ${multiTextCorpus.summary}`, multiTextCorpus.textCorpora()[1].urns[0].toString() == "urn:cts:greekLit:tlg0012.tlg002.murray:1.1" );

testMethod(testCount, multiTextCorpus, `corpus.textCorpora() in ${multiTextCorpus.summary}`, multiTextCorpus.textCorpora()[2].urns[0].toString() == "urn:cts:greekLit:tlg0012.tlg002.murray.token:1.1.1" );

// CtsCorpus.textCorpus()
targetElement.innerHTML += `<h3>CtsCorpus.textCorpus</h3>`;

var textCorpUrn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444.token3");

testMethod(testCount, veryLargeCorpus, `corpus.textCorpus() in ${veryLargeCorpus.summary}`, veryLargeCorpus.textCorpus(textCorpUrn).urns[0].toString() == "urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token1" );

testMethod(testCount, veryLargeCorpus, `corpus.textCorpus() in ${veryLargeCorpus.summary}`, veryLargeCorpus.textCorpus(textCorpUrn).urns.at(-1).toString() == "urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.2.token7" );


// CtsCorpus.getPassage()
targetElement.innerHTML += `<h3>CtsCorpus.getPassage</h3>`;

testMethod(testCount, multiTextCorpus, `corpus.getPassage() in ${multiTextCorpus.summary} with ${gvrKnown2Work3}`, multiTextCorpus.getPassage(gvrKnown2Work3));

// CtsCorpus.getText()
targetElement.innerHTML += `<h3>CtsCorpus.getText</h3>`;


			// Separate versions of the same work
var multiTextArray2 = [odysseyVersion1, odysseyVersion2, odysseyVersion3, p1, p2, p3, odysseyToken1, odysseyToken2, odysseyToken3];
multiTextCorpus2 = new CtsCorpus(multiTextArray2);

			// specify just a text
var gt0 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:");
			// precise passage (1 passage)
var gt1p = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
			// precise range (2 passages)
var gt1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.2");
var gt1a = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.2-1.3");
			// precise exemplar range (2 passages)
var gt2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2.1-1.3.1");
			// containing exemplar range (2 passages)
var gt3 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2-1.3");
			// version (4 passages)
var gt4 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray:1.2-1.3");
			// work (4 passages)
var gt5 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002:1.2-1.3");

// large corpus
		// range 7 passages
var gtVLC0 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.610-2.5");
		// container 8 passages
var gtVLC1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444");
		// range 15 passages
var gtVLC2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444-2.1");
		// work 29 passages
var gtVLC3 = new CtsUrn("urn:cts:greekLit:tlg0013.tlg005:");
		// work, container 21 passages
var gtVLC4 = new CtsUrn("urn:cts:greekLit:tlg0013.tlg005:2-3");

// Separated Versions
testMethod(testCount, multiTextCorpus2, `corpus.getText() Disparate Versions! ${multiTextCorpus2.summary} with ${gt4}`, multiTextCorpus2.getText(gt4).passages.length == 4 );

// Small Corpus
testMethod(testCount, multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt5}`, multiTextCorpus.getText(gt5).passages.length == 4 );

testMethod(testCount, multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt4}`, multiTextCorpus.getText(gt4).passages.length == 4 );

testMethod(testCount, multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt1}`, multiTextCorpus.getText(gt1).passages.length == 2 );

testMethod(testCount, multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt1a}`, multiTextCorpus.getText(gt1a).passages.length == 2 );

testMethod(testCount, multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt0}`, multiTextCorpus.getText(gt0).passages.length == 3 );

testMethod(testCount, multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt1p}`, multiTextCorpus.getText(gt1p).passages.length == 1 );

testMethod(testCount, multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt2}`, multiTextCorpus.getText(gt2).passages.length == 2 );

testMethod(testCount, multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt3}`, multiTextCorpus.getText(gt3).passages.length == 2 );

// large corpus
testMethod(testCount, veryLargeCorpus, `corpus.getText() range 15 passages in ${multiTextCorpus.summary} with ${gtVLC2}`, veryLargeCorpus.getText(gtVLC2).passages.length == 15 );

testMethod(testCount, veryLargeCorpus, `corpus.getText() work, container 14 passages in ${multiTextCorpus.summary} with ${gtVLC4}`, veryLargeCorpus.getText(gtVLC4).passages.length == 14 );

testMethod(testCount, veryLargeCorpus, `corpus.getText() range 7 passages in ${multiTextCorpus.summary} with ${gtVLC0}`, veryLargeCorpus.getText(gtVLC0).passages.length == 7 );

testMethod(testCount, veryLargeCorpus, `corpus.getText() container 8 passages in ${multiTextCorpus.summary} with ${gtVLC1}`, veryLargeCorpus.getText(gtVLC1).passages.length == 8 );

testMethod(testCount, veryLargeCorpus, `corpus.getText() work 29 passages in ${multiTextCorpus.summary} with ${gtVLC3}`, veryLargeCorpus.getText(gtVLC3).passages.length == 29 );


// CtsCorpus.findPassages()
targetElement.innerHTML += `<h3>CtsCorpus.findPassages</h3>`;

			// specify just a text (3 passages)
var fp0 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:");
			// precise range (2 passages)
var fp1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.2");
			// precise exemplar range (2 passages)
var fp2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2.1-1.3.1");
			// containing exemplar range (2 passages)
var fp3 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2-1.3");
			// version (4 passages)
var fp4 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray:1.2-1.3");
			// work (4 passages)
var fp5 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002:1.2-1.3");

testMethod(testCount, multiTextCorpus, `corpus.findPassages(): work: 3 passages in ${multiTextCorpus.summary} with ${fp0}`, multiTextCorpus.getText(fp0).passages.length == 3 );

testMethod(testCount, multiTextCorpus, `corpus.findPassages(): precise range (2 passages) in ${multiTextCorpus.summary} with ${fp1}`, multiTextCorpus.getText(fp1).passages.length == 2 );

testMethod(testCount, multiTextCorpus, `corpus.findPassages(): precise exemplar range (2 passages) in ${multiTextCorpus.summary} with ${fp2}`, multiTextCorpus.getText(fp2).passages.length == 2 );

testMethod(testCount, multiTextCorpus, `corpus.findPassages(): containing exemplar range (2 passages) in ${multiTextCorpus.summary} with ${fp3}`, multiTextCorpus.getText(fp3).passages.length == 2 );

testMethod(testCount, multiTextCorpus, `corpus.findPassages(): version (4 passages) in ${multiTextCorpus.summary} with ${fp4}`, multiTextCorpus.getText(fp4).passages.length == 4 );

testMethod(testCount, multiTextCorpus, `corpus.findPassages(): work (4 passages) in ${multiTextCorpus.summary} with ${fp5}`, multiTextCorpus.getText(fp5).passages.length == 4 );

// =========================================================
// -- Navigation Methods

// CtsCorpus.getFirstRef()
targetElement.innerHTML += `<h3>CtsCorpus.getFirstRef</h3>`;

try {
	fr = multiTextCorpus.getFirstRef("not-a-urn");
	message = "Should have failed with non-CtsUrn parameter".
	tryToFail(message);
} catch(error) {
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

testMethod(testCount, multiTextCorpus, `corpus.getFirstRef(): in ${multiTextCorpus.summary} with ${odysseyVersion}`, multiTextCorpus.getFirstRef(odysseyVersion).toString() == "urn:cts:greekLit:tlg0012.tlg002.murray:1.1" );

testMethod(testCount, multiTextCorpus, `corpus.getFirstRef(): in ${multiTextCorpus.summary} with ${odysseyVersion12}`, multiTextCorpus.getFirstRef(odysseyVersion12).toString() == "urn:cts:greekLit:tlg0012.tlg002.murray:1.1" );

testMethod(testCount, c1, `SHOULD FAIL: corpus.getFirstRef(): in ${c1.summary} with ${odysseyVersion12}`, c1.getFirstRef(odysseyVersion12), true );

testMethod(testCount, multiTextCorpus, `corpus.getFirstRef(): in ${c1.summary} with ${odysseyVersion12} == null`, c1.getFirstRef(odysseyVersion12) == null );

testMethod(testCount, multiTextCorpus, `corpus.getFirstRef(): in ${c1.summary} with ${odysseyVersion12} == null`, c1.getFirstRef(odysseyVersion12) == null );

var gfr0 = new CtsUrn("urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token1");
var gfr1 = new CtsUrn("urn:cts:greekLit:tlg0013.tlg005.fucex.tok:3.token2");
var gfr2 = new CtsUrn("urn:cts:greekLit:tlg0013.tlg005:");
var gfr3 = new CtsUrn("urn:cts:greekLit:tlg0013.tlg005.fucex:2-3");

testMethod(testCount, veryLargeCorpus, `corpus.getFirstRef(): in ${veryLargeCorpus.summary} with ${gfr1} == null`, veryLargeCorpus.getFirstRef(gfr1).toString() == gfr0.toString() );

testMethod(testCount, veryLargeCorpus, `corpus.getFirstRef(): in ${veryLargeCorpus.summary} with ${gfr2}`, veryLargeCorpus.getFirstRef(gfr2).toString() == gfr0.toString() );

testMethod(testCount, veryLargeCorpus, `corpus.getFirstRef(): in ${veryLargeCorpus.summary} with ${gfr3}`, veryLargeCorpus.getFirstRef(gfr3).toString() == gfr0.toString() );

// CtsCorpus.getFirstPassage()
targetElement.innerHTML += `<h3>CtsCorpus.getFirstPassage</h3>`;

try {
	fr = multiTextCorpus.getFirstPassage("not-a-urn");
	message = "Should have failed with non-CtsUrn parameter".
	tryToFail(message);
} catch(error) {
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

var gfr1u = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token1");
var gfr1p = "ἔνθʹ";
var gfr2u = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444.token7");
var gfr2p = "Ἀθήνη";
var gfr3u = new CtsUrn("urn:cts:greekLit:tlg0013.tlg005.fucex:2-3");
var gfrE = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray.tok:");
var gfrV = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray:");
var gfrW = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002:");
var od1p = "ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ"


testMethod(testCount, multiTextCorpus, `corpus.getFirstPassage(): in ${multiTextCorpus.summary} with ${odysseyVersion}`, multiTextCorpus.getFirstPassage(odysseyVersion).text == "ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ" );

testMethod(testCount, veryLargeCorpus, `corpus.getFirstPassage(): in ${veryLargeCorpus.summary} with ${gfr2u}`, veryLargeCorpus.getFirstPassage(gfr2u).text == "ἔνθʹ" );

testMethod(testCount, veryLargeCorpus, `corpus.getFirstPassage(): in ${veryLargeCorpus.summary} with ${gfr3u}`, veryLargeCorpus.getFirstPassage(gfr3u).urn.toString() == gfr0 );

testMethod(testCount, veryLargeCorpus, `corpus.getFirstPassage(): in ${veryLargeCorpus.summary} with ${gfrE}`, veryLargeCorpus.getFirstPassage(gfrE).text == "ἔνθʹ" );

testMethod(testCount, veryLargeCorpus, `corpus.getFirstPassage(): in ${veryLargeCorpus.summary} with ${gfrV}`, veryLargeCorpus.getFirstPassage(gfrV).text == "ἔνθʹ" );

// CtsCorpus.getPrevRef()
targetElement.innerHTML += `<h3>CtsCorpus.getPrevRef</h3>`;

var gpR0a = new CtsUrn("urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token1");
var gpR0b = new CtsUrn("urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token2");
var gpR0c = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.2.token6")
var gpR0d = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray.tok:2.2.token7")
var gpR0null = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray:");

var gpR1a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.605");
var gpR1b = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.611");
var gpR1bPassage = "ἔνθα καθεῦδ' ἀναβάς , παρὰ δὲ χρυσόθρονος Ἥρη .";
var gpR1c = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.1");
var gpR1d = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.5");
var gpR1e = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.6");
var gpR1null = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001:");


try {
	fr = multiTextCorpus.getPrevRef("not-a-urn");
	message = "Should have failed with non-CtsUrn parameter".
	tryToFail(message);
} catch(error) {
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

testMethod(testCount, veryLargeCorpus, `corpus.getPrevRef(): in ${veryLargeCorpus.summary} with ${gpR0d}`, veryLargeCorpus.getPrevRef(gpR0d).toString() == gpR0c.toString() );

testMethod(testCount, veryLargeCorpus, `corpus.getPrevRef(): in ${veryLargeCorpus.summary} with ${gpR0b}`, veryLargeCorpus.getPrevRef(gpR0b).toString() == gpR0a.toString() );

testMethod(testCount, veryLargeCorpus, `corpus.getPrevRef(): in ${veryLargeCorpus.summary} with ${gpR1a} == null`, veryLargeCorpus.getPrevRef(gpR1a) == null );

testMethod(testCount, veryLargeCorpus, `corpus.getPrevRef(): in ${veryLargeCorpus.summary} with ${gpR1c}`, veryLargeCorpus.getPrevRef(gpR1c).toString() == gpR1b.toString() );

try {
	testValue = veryLargeCorpus.getPrevRef(gpR0a) == null;
	message = "Did not error on first urn of a text";
	tryToPass(message);
} catch(error) {
	message = `Errored: ${error.message}`;
	catchToFail();
}

try {
	testValue = multiTextCorpus.getPrevRef(gpR1a) == null;
	message = "Did not error on first urn of a text";
	tryToPass(message);
} catch(error) {
	message = `Errored: ${error.message}`;
	catchToFail();
}

testMethod(testCount, veryLargeCorpus, `corpus.getPrevRef(): in ${veryLargeCorpus.summary} with ${gpR1c}`, veryLargeCorpus.getPrevRef(gpR0a) == null );

testMethod(testCount, multiTextCorpus, `corpus.getPrevRef(): in ${multiTextCorpus.summary} with ${gpR1c}`, multiTextCorpus.getPrevRef(gpR1a) == null );

// CtsCorpus.getNextRef()
targetElement.innerHTML += `<h3>CtsCorpus.getNextRef</h3>`;

try {
	fr = multiTextCorpus.getNextRef("not-a-urn");
	message = "Should have failed with non-CtsUrn parameter".
	tryToFail(message);
} catch(error) {
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

testMethod(testCount, veryLargeCorpus, `corpus.getNextRef(): in ${veryLargeCorpus.summary} with ${gpR1b}`, veryLargeCorpus.getNextRef(gpR1b).toString() == gpR1c.toString() );

testMethod(testCount, veryLargeCorpus, `corpus.getNextRef(): in ${veryLargeCorpus.summary} with ${gpR1d}`, veryLargeCorpus.getNextRef(gpR1d).toString() == gpR1e.toString() );

testMethod(testCount, veryLargeCorpus, `corpus.getNextRef(): in ${veryLargeCorpus.summary} with ${gpR1e} == null`, veryLargeCorpus.getNextRef(gpR1e) == null );


// CtsCorpus.getPrev()
targetElement.innerHTML += `<h3>CtsCorpus.getPrev</h3>`;

try {
	fr = multiTextCorpus.getPrev("not-a-urn");
	message = "Should have failed with non-CtsUrn parameter".
	tryToFail(message);
} catch(error) {
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

testMethod(testCount, veryLargeCorpus, `corpus.getPrev(): in ${veryLargeCorpus.summary} with ${gpR0b}`, veryLargeCorpus.getPrev(gpR0b).urn.toString() == gpR0a.toString() );

testMethod(testCount, veryLargeCorpus, `corpus.getPrev(): in ${veryLargeCorpus.summary} with ${gpR0a} == null`, veryLargeCorpus.getPrev(gpR0a) == null );

testMethod(testCount, veryLargeCorpus, `corpus.getPrev(): in ${veryLargeCorpus.summary} with ${gpR1c}`, veryLargeCorpus.getPrev(gpR1c).urn.toString() == gpR1b.toString() );

testMethod(testCount, veryLargeCorpus, `corpus.getPrev(): in ${veryLargeCorpus.summary} with ${gpR1c}`, veryLargeCorpus.getPrev(gpR1c).text == gpR1bPassage );

try {
	testVal = veryLargeCorpus.getPrev(gpR1a);
	message = `Caught error. Should not have attempted .getPassage() with a null value.`
	tryToPass(message);
} catch(error) {
	message = `Errored: ${error.message}`;
	catchToFail(message);
}

try {
	testVal = veryLargeCorpus.getPrev(gpR0null);
	message = "Did not attempt getPassage() with a null urn.";
	tryToPass(message);
} catch(error) {
	message = `Errored: ${error.message}`;
	catchToFail(message);
}

// CtsCorpus.getNext()
targetElement.innerHTML += `<h3>CtsCorpus.getNext</h3>`;

try {
	fr = multiTextCorpus.getNext("not-a-urn");
	message = "Should have failed with non-CtsUrn parameter".
	tryToFail(message);
} catch(error) {
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

testMethod(testCount, veryLargeCorpus, `corpus.getNext(): in ${veryLargeCorpus.summary} with ${gpR1d}`, veryLargeCorpus.getNext(gpR1d).urn.toString() == gpR1e.toString() );

testMethod(testCount, veryLargeCorpus, `corpus.getNext(): in ${veryLargeCorpus.summary} with ${gpR1e} == null`, veryLargeCorpus.getNext(gpR1e) == null );

testMethod(testCount, veryLargeCorpus, `corpus.getNext(): in ${veryLargeCorpus.summary} with ${gpR0a} == null`, veryLargeCorpus.getNext(gpR0a).urn.toString() == gpR0b.toString() );

try {
	testVal = veryLargeCorpus.getNext(gpR0a) == null;
	message = `Should not throw an error when doing .getNext() on the last urn of a text.`
	tryToPass(message);
} catch(error) {
	message = `Errored: ${error.message}`;
	catchToFail(message);
}

testMethod(testCount, veryLargeCorpus, `corpus.getNext(): in ${veryLargeCorpus.summary} with ${gpR0d} == null`, veryLargeCorpus.getNext(gpR0d) == null );


try {
	testVal = veryLargeCorpus.getNext(gpR0null);
	message = "Did not attempt getPassage() with a null urn.";
	tryToPass(message);
} catch(error) {
	message = `Errored: ${error.message}`;
	catchToFail(message);
}

// =========================================================
// -- Methods for Browsing


// CtsCorpus.slideRange()
targetElement.innerHTML += `<h3>CtsCorpus.slideRange</h3>`;

try {
	fr = multiTextCorpus.slideRange("not-a-urn");
	message = "Should have failed with non-CtsUrn parameter".
	tryToFail(message);
} catch(error) {
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

try {
	fr = multiTextCorpus.slideRange(u1, "not-an-Int");
	message = "Should have failed with non-Int second parameter".
	tryToFail(message);
} catch(error) {
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

// 3 passages in the middle, 2 before and 2 after; 
// 			1.605 is the first
//			1.611 is the last
var slide1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.607-1.609");
var slideBack1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.606-1.608");
var slideBack2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.605-1.607");
var slideBack3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.605-1.606");
var slideBack4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.605-1.605");
var slideBack4a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.605");
var slideBack5 = null;
var slideForward1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.609-1.611");
var slideForward2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.610-2.1");
var slideForward3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.611-2.2");
var slideForward4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.1-2.3");
var slideForward5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.2-2.4");
var slideForward6 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.3-2.5");
var slideForward7 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.4-2.6");
var slideForward8 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.5-2.6");
var slideForward9 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.6-2.6");
var slideForward9a = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.6");
var slideForward10 = null;

// Slide backwards

targetElement.innerHTML += `<p>…sliding backwards</p>`;


testMethod(testCount, veryLargeCorpus, `Slide backward from ${slide1.passage} (test for return), by 1`, veryLargeCorpus.slideRange(slide1, -1) );

testMethod(testCount, veryLargeCorpus, `Slide backward from ${slide1.passage}, by 1`, slideBack1.toString() == veryLargeCorpus.slideRange(slide1, -1) );

testMethod(testCount, veryLargeCorpus, `Slide backward from ${slide1.passage}, by 2`, slideBack2.toString() == veryLargeCorpus.slideRange(slide1, -2) );

testMethod(testCount, veryLargeCorpus, `Slide backward from ${slide1.passage}, by 3`, slideBack3.toString() == veryLargeCorpus.slideRange(slide1, -3) );

testMethod(testCount, veryLargeCorpus, `Slide backward from ${slide1.passage}, by 4. Should reduce range-urn`, slideBack4a.toString() == veryLargeCorpus.slideRange(slide1, -4) );

testMethod(testCount, veryLargeCorpus, `SHOULD FAIL: Slide backward from ${slide1.passage}, by 4. Should have reduce range-urn`, slideBack4.toString() == veryLargeCorpus.slideRange(slide1, -4), true );

testMethod(testCount, veryLargeCorpus, `Slide backward from ${slide1.passage}, by 5 == null`, !veryLargeCorpus.slideRange(slide1, -5) );


// Walk backwards, URN-by-URN
targetElement.innerHTML += `<p>…walking backwards, URN-by-URN</p>`;

testMethod(testCount, veryLargeCorpus, `Walk backward from ${slide1.passage}, by 1`, slideBack1.toString() == veryLargeCorpus.slideRange(slide1, -1) );

testMethod(testCount, veryLargeCorpus, `Walk backward from ${slideBack1.passage}, by 1`, slideBack2.toString() == veryLargeCorpus.slideRange(slideBack1, -1) );

testMethod(testCount, veryLargeCorpus, `Walk backward from ${slideBack2.passage}, by 1`, slideBack3.toString() == veryLargeCorpus.slideRange(slideBack2, -1) );

testMethod(testCount, veryLargeCorpus, `SHOULD FAIL: Walk backward from ${slideBack3.passage}, by 1. Should reduce URN.`, slideBack4.toString() == veryLargeCorpus.slideRange(slideBack3, -1), true );

testMethod(testCount, veryLargeCorpus, `Walk backward from ${slideBack3.passage}, by 1`, slideBack4a.toString() == veryLargeCorpus.slideRange(slideBack3, -1) );

testMethod(testCount, veryLargeCorpus, `Walk backward from ${slideBack4a.passage}, by 1`, !veryLargeCorpus.slideRange(slideBack4a, -1) );

testMethod(testCount, veryLargeCorpus, `Walk backward from ${slideBack4.passage}, by 1`, !veryLargeCorpus.slideRange(slideBack4, -1) );


// Slide forward
targetElement.innerHTML += `<p>…sliding forwards</p>`;

testMethod(testCount, veryLargeCorpus, `Slide forward from ${slideForward1.passage}, by 1 (test for return)`, veryLargeCorpus.slideRange(slide1, 1) );

testMethod(testCount, veryLargeCorpus, `Slide forward from ${slideForward1.passage}, by 1`, slideForward2.toString() == veryLargeCorpus.slideRange(slideForward1, 1) );

testMethod(testCount, veryLargeCorpus, `Slide forward from ${slideForward1.passage}, by 2`, slideForward3.toString() == veryLargeCorpus.slideRange(slideForward1, 2) );

testMethod(testCount, veryLargeCorpus, `Slide forward from ${slideForward1.passage}, by 3`, slideForward4.toString() == veryLargeCorpus.slideRange(slideForward1, 3) );

testMethod(testCount, veryLargeCorpus, `Slide forward from ${slideForward1.passage}, by 4`, slideForward5.toString() == veryLargeCorpus.slideRange(slideForward1, 4) );

testMethod(testCount, veryLargeCorpus, `Slide forward from ${slideForward1.passage}, by 5`, slideForward6.toString() == veryLargeCorpus.slideRange(slideForward1, 5) );

testMethod(testCount, veryLargeCorpus, `Slide forward from ${slideForward1.passage}, by 6`, slideForward7.toString() == veryLargeCorpus.slideRange(slideForward1, 6) );

testMethod(testCount, veryLargeCorpus, `Slide forward from ${slideForward1.passage}, by 7`, slideForward8.toString() == veryLargeCorpus.slideRange(slideForward1, 7) );

testMethod(testCount, veryLargeCorpus, `SHOULD FAIL. URN-range should be reduced. Slide forward from ${slideForward1.passage}, by 8`, slideForward9.toString() == veryLargeCorpus.slideRange(slideForward1, 8), true );

testMethod(testCount, veryLargeCorpus, `Slide forward from ${slideForward1.passage}, by 8`, slideForward9a.toString() == veryLargeCorpus.slideRange(slideForward1, 8) );

testMethod(testCount, veryLargeCorpus, `Slide forward from ${slideForward1.passage}, by 9`, !veryLargeCorpus.slideRange(slideForward1, 9) );

// Walk forward, URN-by-URN
targetElement.innerHTML += `<p>…walking forwards URN-by-URN</p>`;


testMethod(testCount, veryLargeCorpus, `Walk forward from ${slideForward1.passage}, by 1`, slideForward2.toString() == veryLargeCorpus.slideRange(slideForward1, 1) );

testMethod(testCount, veryLargeCorpus, `Walk forward from ${slideForward2.passage}, by 1`, slideForward3.toString() == veryLargeCorpus.slideRange(slideForward2, 1) );

testMethod(testCount, veryLargeCorpus, `Walk forward from ${slideForward3.passage}, by 1`, slideForward4.toString() == veryLargeCorpus.slideRange(slideForward3, 1) );

testMethod(testCount, veryLargeCorpus, `Walk forward from ${slideForward4.passage}, by 1`, slideForward5.toString() == veryLargeCorpus.slideRange(slideForward4, 1) );

testMethod(testCount, veryLargeCorpus, `Walk forward from ${slideForward5.passage}, by 1`, slideForward6.toString() == veryLargeCorpus.slideRange(slideForward5, 1) );

testMethod(testCount, veryLargeCorpus, `Walk forward from ${slideForward6.passage}, by 1`, slideForward7.toString() == veryLargeCorpus.slideRange(slideForward6, 1) );

testMethod(testCount, veryLargeCorpus, `Walk forward from ${slideForward7.passage}, by 1`, slideForward8.toString() == veryLargeCorpus.slideRange(slideForward7, 1) );

testMethod(testCount, veryLargeCorpus, `SHOULD FAIL. URN-range should be reduced. Walk forward from ${slideForward8.passage}, by 1`, slideForward9.toString() == veryLargeCorpus.slideRange(slideForward8, 1), true );

testMethod(testCount, veryLargeCorpus, `Walk forward from ${slideForward8.passage}, by 1`, slideForward9a.toString() == veryLargeCorpus.slideRange(slideForward8, 1) );

testMethod(testCount, veryLargeCorpus, `Walk forward from ${slideForward9.passage}, by 1`, !veryLargeCorpus.slideRange(slideForward9, 1) );

testMethod(testCount, veryLargeCorpus, `Walk forward from ${slideForward9a.passage}, by 1`, !veryLargeCorpus.slideRange(slideForward9a, 1) );

// CtsCorpus.changeContext()
targetElement.innerHTML += `<h3>CtsCorpus.changeContext</h3>`;

try {
	fr = multiTextCorpus.changeContext("not-a-urn", 1, 1);
	message = "Should have failed with non-CtsUrn parameter".
	tryToFail(message);
} catch(error) {
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

try {
	fr = multiTextCorpus.changeContext(u1, "x", 1);
	message = "Should have failed with non-CtsUrn parameter".
	tryToFail(message);
} catch(error) {
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

try {
	fr = multiTextCorpus.changeContext(u1, 1, "x");
	message = "Should have failed with non-CtsUrn parameter".
	tryToFail(message);
} catch(error) {
	message = `Correctly errored: ${error.message}`;
	catchToPass(message);
}

try {
	fr = multiTextCorpus.changeContext(u1, 1);
	message = `Succeeded with default value for 'before'.`;
	tryToPass(message);
} catch(error) {
	message = `Errored: ${error.message}`;
	catchToFail(message);
}

/*
urn:cts:greekLit:tlg0012.tlg001.allen:1.605#αὐτὰρ ἐπεὶ κατέδυ λαμπρὸν φάος ἠελίοιο ,
urn:cts:greekLit:tlg0012.tlg001.allen:1.606#οἳ μὲν κακκείοντες ἔβαν οἶκον δὲ ἕκαστος ,
urn:cts:greekLit:tlg0012.tlg001.allen:1.607#ἧχι ἑκάστῳ δῶμα περικλυτὸς ἀμφιγυήεις
urn:cts:greekLit:tlg0012.tlg001.allen:1.608#Ἥφαιστος ποίησεν ἰδυίῃσι πραπίδεσσι ·
urn:cts:greekLit:tlg0012.tlg001.allen:1.609#Ζεὺς δὲ πρὸς ὃν λέχος ἤϊ' Ὀλύμπιος ἀστεροπητής ,
urn:cts:greekLit:tlg0012.tlg001.allen:1.610#ἔνθα πάρος κοιμᾶθ' ὅτε μιν γλυκὺς ὕπνος ἱκάνοι ·
urn:cts:greekLit:tlg0012.tlg001.allen:1.611#ἔνθα καθεῦδ' ἀναβάς , παρὰ δὲ χρυσόθρονος Ἥρη .
urn:cts:greekLit:tlg0012.tlg001.allen:2.1#ἄλλοι μέν ῥα θεοί τε καὶ ἀνέρες ἱπποκορυσταὶ
urn:cts:greekLit:tlg0012.tlg001.allen:2.2#εὗδον παννύχιοι , Δία δ' οὐκ ἔχε νήδυμος ὕπνος ,
urn:cts:greekLit:tlg0012.tlg001.allen:2.3#ἀλλ' ὅ γε μερμήριζε κατὰ φρένα ὡς Ἀχιλῆα
urn:cts:greekLit:tlg0012.tlg001.allen:2.4#τιμήσῃ , ὀλέσῃ δὲ πολέας ἐπὶ νηυσὶν Ἀχαιῶν .
urn:cts:greekLit:tlg0012.tlg001.allen:2.5#ἥδε δέ οἱ κατὰ θυμὸν ἀρίστη φαίνετο βουλή ,
urn:cts:greekLit:tlg0012.tlg001.allen:2.6#πέμψαι ἐπ' Ἀτρεΐδῃ Ἀγαμέμνονι οὖλον ὄνειρον ·
*/

var ccBase = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.610-2.2");
var ccMax = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.605-2.6");
var ccBefore1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.609-2.2");
var ccBeforeLess1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.611-2.2");
var ccBefore5 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.605-2.2");
var ccBefore10 = ccBefore5
var ccAfter1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.610-2.3"); 
var ccAfterLess1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.610-2.1"); 
var ccAfter4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.610-2.6"); 
var ccAfter10 = ccAfter4
var ccBigger1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.609-2.3");
var ccBigger3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.607-2.5"); 
var ccBigger10 = ccMax; 
var ccSmaller1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.611-2.1"); 
var ccSmaller2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.1"); 
var ccSmaller3 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.2"); 
var ccSmaller4 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:2.2"); 

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, add 1 before.`, ccBefore1.toString() == veryLargeCorpus.changeContext(ccBase, 0, 1) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, remove 1 before.`, ccBeforeLess1.toString() == veryLargeCorpus.changeContext(ccBase, 0, -1) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, add 5 before.`, ccBefore5.toString() == veryLargeCorpus.changeContext(ccBase, 0, 5) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, add 10 before. Exceeds the end of the passage.`, ccBefore10.toString() == veryLargeCorpus.changeContext(ccBase, 0, 10) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, add 1 after.`, ccAfter1.toString() == veryLargeCorpus.changeContext(ccBase, 1) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, remove 1 after.`, ccAfterLess1.toString() == veryLargeCorpus.changeContext(ccBase, -1) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, add 4 after.`, ccAfter4.toString() == veryLargeCorpus.changeContext(ccBase, 4) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, add 10 after. Exceeds the start of the passage.`, ccAfter10.toString() == veryLargeCorpus.changeContext(ccBase, 10) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, expand by 1.`, ccBigger1.toString() == veryLargeCorpus.changeContext(ccBase, 1, 1) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, expand by 3.`, ccBigger3.toString() == veryLargeCorpus.changeContext(ccBase, 3, 3) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, expand by 10. Exceeds the whole text.`, ccBigger10.toString() == veryLargeCorpus.changeContext(ccBase, 10, 10) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, contract by 1.`, ccSmaller1.toString() == veryLargeCorpus.changeContext(ccBase, -1, -1) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, contract by 2. Would reduce to a single passage.`, ccSmaller2.toString() == veryLargeCorpus.changeContext(ccBase, -2, -2) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, contract by 2. Would reduce to a single passage and beyond.`, ccSmaller3.toString() == veryLargeCorpus.changeContext(ccBase, -3, -3) );

testMethod(testCount, veryLargeCorpus, `changeContext(): From ${ccBase.passage}, contract by 4. Would reduce to a single passage and beyond.`, ccSmaller4.toString() == veryLargeCorpus.changeContext(ccBase, -4, -4) );


// ==================== FINAL SUMMARY ====================
showSummary();