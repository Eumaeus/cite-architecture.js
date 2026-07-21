
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

function passageReport(testCorpus) {
	testCount = testCount + 1;
	passedCount = passedCount + 1;
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
}

function testMethod(corpus, message, testPassed, shouldFail = false) {
  testCount++;
    if (!testPassed && !shouldFail) failedCount++;
  if (!testPassed && shouldFail) passedCount++;
  if (testPassed && !shouldFail) passedCount++;
  if (testPassed && shouldFail) failedCount++;

  const color = ((testPassed && !shouldFail) || (!testPassed && shouldFail) ) ? "green" : "red";
  targetElement.innerHTML += `
    <div>
      <p style="color: ${color}">
        <strong>${testCount}. ${message}</strong>: ${corpus.summary}
      </p>
    </div>
  `;
}

function showSummary() {
  report = `
    <hr>
  	 <div style="background-color: #ccdeff; border: 1px solid navy; padding: 25px;">
    <h3>Summary</h3>
    <p><strong>Total tests:</strong> ${testCount}</p>
    <p style="color: green"><strong>Passed:</strong> ${passedCount}</p>
    <p style="color: red"><strong>Failed:</strong> ${failedCount - 2}</p>
    <p style="color: navy"><strong>Errored well:</strong> ${errorCount}</p>
  	</div>

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

testMethod(c1, message = `Passed. Should have passed.`, testPassed = true, shouldFail = false );
testMethod(c1, message = `Failed. Should have failed.`, testPassed = false, shouldFail = true );
testMethod(c1, message = `Passed. Should have failed.`, testPassed = true, shouldFail = true );
testMethod(c1, message = `Failed. Should have passed.`, testPassed = false, shouldFail = false );

// =================
// === New Tests ===
targetElement.innerHTML += `<div><p  class="test-h2">New Tests</p></div>`

// NEW TESTS HERE
targetElement.innerHTML += "<p>Newly added tests here, for convenience.</p>"


			// specify just a text
var gt0 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:");
			// precise passage (1 passage)
var gt1p = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.2");
			// precise range (2 passages)
var gt1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.2");
			// precise exemplar range (2 passages)
var gt2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2.1-1.3.1");
			// containing exemplar range (2 passages)
var gt3 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.token:1.2-1.3");
			// version (4 passages)
var gt4 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray:1.2-1.3");
			// work (4 passages)
var gt5 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002:1.2-1.3");

// Small Corpus
testMethod(multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt4}`, multiTextCorpus.getText(gt4).passages.length == 4 );

testMethod(multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt5}`, multiTextCorpus.getText(gt5).passages.length == 5 );

testMethod(multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt1}`, multiTextCorpus.getText(gt1).passages.length == 2 );

testMethod(multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt0}`, multiTextCorpus.getText(gt0).passages.length == 3 );

testMethod(multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt1p}`, multiTextCorpus.getText(gt1p).passages.length == 1 );

testMethod(multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt2}`, multiTextCorpus.getText(gt2).passages.length == 2 );

testMethod(multiTextCorpus, `corpus.getText() in ${multiTextCorpus.summary} with ${gt3}`, multiTextCorpus.getText(gt3).passages.length == 2 );


// large corpus
		// range 7 passages
var gtVLC0 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.610-2.5");
		// container 8 passages
var gtVLC1 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444");
		// range 14 passages
var gtVLC2 = new CtsUrn("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.444-2.1");
		// work 29 passages
var gtVLC3 = new CtsUrn("urn:cts:greekLit:tlg0013.tlg005:");
		// work, container 21 passages
var gtVLC4 = new CtsUrn("urn:cts:greekLit:tlg0013.tlg005:2-3");

testMethod(veryLargeCorpus, `corpus.getText() range 7 passages in ${multiTextCorpus.summary} with ${gtVLC0}`, veryLargeCorpus.getText(gtVLC0).passages.length == 7 );

testMethod(veryLargeCorpus, `corpus.getText() container 8 passages in ${multiTextCorpus.summary} with ${gtVLC1}`, veryLargeCorpus.getText(gtVLC1).passages.length == 8 );

testMethod(veryLargeCorpus, `corpus.getText() range 14 passages in ${multiTextCorpus.summary} with ${gtVLC2}`, veryLargeCorpus.getText(gtVLC2).passages.length == 14 );

testMethod(veryLargeCorpus, `corpus.getText() work 29 passages in ${multiTextCorpus.summary} with ${gtVLC3}`, veryLargeCorpus.getText(gtVLC3).passages.length == 29 );

testMethod(veryLargeCorpus, `corpus.getText() work, container 21 passages in ${multiTextCorpus.summary} with ${gtVLC4}`, veryLargeCorpus.getText(gtVLC4).passages.length == 21 );


// ==========================
// === Basic Construction ===
targetElement.innerHTML += `<div><p  class="test-h2">Basic Construction</p></div>`

// Corpus report
validCorpus = new CtsCorpus(a1);
passageReport(validCorpus);

// Good corpus 
targetElement.innerHTML += `<h3>Good corpus </h3>`;

testMethod(odysseyVersionCorpus, `New Corpus: corpus.length == 3`, new CtsCorpus(odysseyVersionArray).length == 3 );

testMethod(multiTextCorpus, `New Corpus (multiple texts): corpus.length == 6`, new CtsCorpus(multiTextArray).length == 9 );

// Static factory

try {
	emptyCorpus = CtsCorpus.fromString(cexStringEmpty);
	targetElement.innerHTML += `<div><p  style="color: green;">${testCount}. Empty corpus constructed from CtsCorpus.fromString(): <strong>"${emptyCorpus.summary}"</strong></p></div>`;
	passedCount = passedCount + 1;
	testCount = testCount + 1;
} catch(error){
	testCount = testCount + 1;
	failedCount = failedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Good corpus not constructed! ${error.message}</p></div>`; }

try {
	fromStringCorpusNH = CtsCorpus.fromString(cexStringNoHeader);
	targetElement.innerHTML += `<div><p  style="color: green;">${testCount}. Corpus constructed from CtsCorpus.fromString() (no header): <strong>"${fromStringCorpusNH.summary}"</strong></p></div>`;
	passedCount = passedCount + 1;
	testCount = testCount + 1;
} catch(error){
	testCount = testCount + 1;
	failedCount = failedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Good corpus not constructed! ${error.message}</p></div>`; }

try {
	fromStringCorpus = CtsCorpus.fromString(cexStringHeader);
	targetElement.innerHTML += `<div><p  style="color: green;">${testCount}. Corpus constructed from CtsCorpus.fromString() ("#!ctsdata" header): <strong>"${fromStringCorpus.summary}"</strong></p></div>`;
	passedCount = passedCount + 1;
	testCount = testCount + 1;
} catch(error){
	testCount = testCount + 1;
	failedCount = failedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Good corpus not constructed! ${error.message}</p></div>`; }

try {
	goodCorpus = new CtsCorpus(a1);
	targetElement.innerHTML += `<div><p  style="color: green;">${testCount}. Corpus constructed: <strong>"${goodCorpus.summary}"</strong></p></div>`;
	passedCount = passedCount + 1;
	testCount = testCount + 1;
} catch(error){
	testCount = testCount + 1;
	failedCount = failedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Good corpus not constructed! ${error.message}</p></div>`; }

// Bad corpus: Not an array
targetElement.innerHTML += `<h3>Not an array</h3>`;

try {
	badCorpus = new CtsCorpus(p1);
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Bad corpus constructed!</p></div>`;
	failedCount = failedCount + 1;
	testCount = testCount + 1;
} catch(error){
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. Bad corpus failed: ${error.message}</p></div>`; }

// Bad corpus: Not an array of CtsPassage
targetElement.innerHTML += `<h3>Bad array: not an array of CtsPassages</h3>`;

try {
	badCorpus = new CtsCorpus(badArray1);
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Bad corpus constructed!</p></div>`;
	failedCount = failedCount + 1;
	testCount = testCount + 1;
} catch(error){
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. Bad corpus failed: ${error.message}</p></div>`; }

// Bad corpus: Duplicate passages
targetElement.innerHTML += `<h3>Bad array: duplicate passages</h3>`;

try {
	badCorpus = new CtsCorpus(dupUrnArray);
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Bad corpus constructed! Duplicate passages.</strong></p></div>`;
	failedCount = failedCount + 1;
	testCount = testCount + 1;
} catch(error){
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. Bad corpus failed: ${error.message}</p></div>`; }

// Bad corpus: non-node-level URN
targetElement.innerHTML += `<h3>Bad array: non-node-level URN</h3>`;

try {
	badCorpus = new CtsCorpus(containingUrnArray);
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Bad corpus constructed. Containing URN.</strong></p></div>`;
	failedCount = failedCount + 1;
} catch(error){
	testCount = testCount + 1;
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. Bad corpus failed: ${error.message}</p></div>`; }

// Bad corpus: interleaved text-passages
targetElement.innerHTML += `<h3>Bad corpus: interleaved text-passages</h3>`;

try {
	badCorpus = new CtsCorpus(interleavedArray);
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. Bad corpus constructed. Interleaved text-passages.</strong></p></div>`;
	failedCount = failedCount + 1;
	testCount = testCount + 1;
} catch(error){
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. Bad corpus failed: ${error.message}</p></div>`; }


// ==================
// === Properties ===
targetElement.innerHTML += `<div><p  class="test-h2">Properties</p></div>`

// CtsCorpus.length
targetElement.innerHTML += `<h3>CtsCorpus.length</h3>`;

testMethod(c1, `corpus.length == 3`, c1.length == 3 );

// CtsCorpus.text
testMethod(c1, `corpus.text[0] instanceof CtsPassage`, (c1.passages[0] instanceof CtsPassage) && (c1.passages[1] instanceof CtsPassage));

// CtsCorpus.urns
testMethod(c1, `corpus.urns`, (c1.urns));

testMethod(c1, `corpus.urns`, (c1.urns.toString() == c1.passages.map(p => p.urn).toString()));

// CtsCorpus.texts

testMethod(c1, `corpus.texts == 1`, c1.texts.length == 1);

testMethod(odysseyCorpus, `corpus.texts == 2`, odysseyCorpus.texts.length == 2);

testMethod(multiTextCorpus, `corpus.texts == 3`, multiTextCorpus.texts.length == 3);

// =====================
// === Basic Methods ===
targetElement.innerHTML += `<div><p  class="test-h2">Methods</p></div>`

// CtsCorpus.toString() 
targetElement.innerHTML += `<h3>CtsCorpus.toString()</h3>`;

testMethod(c1, `corpus.toString()`, c1.toString() == corpusString1 );

// ================================
// === Query/Assessment Methods ===
targetElement.innerHTML += `<div><p  class="test-h2">Methods</p></div>`

// ctscorpus.hasText()
targetElement.innerHTML += `<h3>ctscorpus.hasText()</h3>`;

testMethod(c1, `corpus.hasText(): ${c1.summary} :: ${someIliadUrn}`, c1.hasText(someIliadUrn) );
testMethod(odysseyCorpus, `corpus.hasText(): ${odysseyCorpus.summary} :: ${someOdysseyVersionUrn}`, odysseyCorpus.hasText(someOdysseyVersionUrn) );
testMethod(odysseyVersionCorpus, `SHOULD FAIL: corpus.hasText(): ${odysseyVersionCorpus.summary} :: ${someOdysseyWorkUrn}`, odysseyVersionCorpus.hasText(someOdysseyWorkUrn), true );
testMethod(odysseyVersionCorpus, `SHOULD FAIL: corpus.hasText(): ${odysseyVersionCorpus.summary} :: ${someIliadUrn}`, odysseyVersionCorpus.hasText(someIliadUrn), true );


// CtsCorpus.getValidReff()
targetElement.innerHTML += `<h3>ctscorpus.getValidReff()</h3>`;

//			all passages
testMethod(c1, `corpus.getValidReff()`, c1.getValidReff().toString() == [u1, u2, u3].toString() );

//			version urn
testMethod(odysseyCorpus, `corpus.getValidReff()`, odysseyVersionCorpus.getValidReff().toString() == odysseyVersionReff.toString() );

//			version urn
testMethod(multiTextCorpus, `corpus.getValidReff() (${odysseyCorpus.length} passages)`, multiTextCorpus.getValidReff(odysseyVersion).toString() == odysseyCorpus.urns.toString() );

//			work urn
testMethod(multiTextCorpus, `## corpus.getValidReff() (${odysseyCorpus.length} passages)`, multiTextCorpus.getValidReff(odysseyWork).toString() == odysseyCorpus.urns.toString() );

//			exemplar urn
testMethod(multiTextCorpus, `corpus.getValidReff() (${odysseyTokenCorpus.length})`, multiTextCorpus.getValidReff(odysseyToken).toString() == odysseyTokenCorpus.urns.toString() );

//			exemplar urn, should exclude version urns
testMethod(multiTextCorpus, `SHOULD FAIL: corpus.getValidReff() (${odysseyCorpus.length} Odyssey passages, but only ${odysseyTokenCorpus.length} Odyssey-token passages.)`, multiTextCorpus.getValidReff(odysseyToken).toString() == odysseyCorpus.urns.toString(), true );

// CtsCorpus.countValidReff()
targetElement.innerHTML += `<h3>CtsCorpus.countValidReff</h3>`;

testMethod(multiTextCorpus, `corpus.countValidReff() (${odysseyCorpus.length} passages)`, multiTextCorpus.countValidReff(odysseyVersion) == odysseyCorpus.length );

testMethod(multiTextCorpus, `corpus.countValidReff() (${odysseyCorpus.length} passages)`, multiTextCorpus.countValidReff(odysseyToken) == odysseyTokenCorpus.length );


// CtsCorpus.isValidRef()
targetElement.innerHTML += `<h3>CtsCorpus.isValidRef</h3>`;

testMethod(c1, `corpus.isValidRef(${someIliadUrn}) in ${c1.summary}`, c1.isValidRef(someIliadUrn) );

testMethod(c1, `SHOULD FAIL: corpus.isValidRef(${someOdysseyWorkUrn}) in ${c1.summary}`, c1.isValidRef(someOdysseyWorkUrn), true );

testMethod(multiTextCorpus, `corpus.isValidRef(${someIliadUrn}) in ${multiTextCorpus.summary}`, multiTextCorpus.isValidRef(someIliadUrn) );

testMethod(multiTextCorpus, `corpus.isValidRef(${someOdysseyVersionUrn}) in ${multiTextCorpus.summary}`, multiTextCorpus.isValidRef(someOdysseyVersionUrn) );

testMethod(multiTextCorpus, `SHOULD FAIL: corpus.isValidRef(${someOdysseyWorkUrn}) in ${multiTextCorpus.summary}`, multiTextCorpus.isValidRef(someOdysseyWorkUrn), true );

testMethod(odysseyVersionCorpus, `corpus.isValidRef(${someOdysseyVersionUrn}) in ${multiTextCorpus.summary}`, multiTextCorpus.isValidRef(someOdysseyVersionUrn), false );

testMethod(odysseyVersionCorpus, `SHOULD FAIL: corpus.isValidRef(${someOdysseyTokenUrn}) in ${odysseyVersionCorpus.summary}`, odysseyVersionCorpus.isValidRef(someOdysseyTokenUrn), true );

testMethod(odysseyCorpus, `corpus.isValidRef(${someOdysseyTokenUrn}) in ${odysseyCorpus.summary}`, odysseyCorpus.isValidRef(someOdysseyTokenUrn) );

testMethod(odysseyCorpus, `SHOULD FAIL: corpus.isValidRef(${someIliadUrn}) in ${odysseyCorpus.summary}`, odysseyCorpus.isValidRef(someIliadUrn), true );


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


testMethod(multiTextCorpus, `corpus.getValidReff() Allen Range 1.1-1.2  in ${multiTextCorpus.summary} with ${gvrKnown2Work5}`, multiTextCorpus.getValidReff(gvrKnown2Work5).length == 2);

testMethod(multiTextCorpus, `corpus.getValidReff() Range 1.1-1.2  in ${multiTextCorpus.summary} with ${grvRange1}`, multiTextCorpus.getValidReff(grvRange1).length == 2);

testMethod(multiTextCorpus, `corpus.getValidReff() Range 1.2-1.3  in ${multiTextCorpus.summary} with ${grvRange2}`, multiTextCorpus.getValidReff(grvRange2).length == 2);

testMethod(multiTextCorpus, `corpus.getValidReff() Version Book 1  in ${multiTextCorpus.summary} with ${gvrBook1}`, multiTextCorpus.getValidReff(gvrBook1).length == 3);

testMethod(multiTextCorpus, `corpus.getValidReff() Specific 1.3 in ${multiTextCorpus.summary} with ${gvrKnown2Work3}`, multiTextCorpus.getValidReff(gvrKnown2Work3).length == 1);

testMethod(veryLargeCorpus, `corpus.getValidReff() Version Book 2  in ${multiTextCorpus.summary} with ${gvrBook2}`, veryLargeCorpus.getValidReff(gvrBook2).length == 6);

testMethod(multiTextCorpus, `SHOULD FAIL: corpus.getValidReff() Version Book 1  in ${multiTextCorpus.summary} with ${gvrBook2}`, multiTextCorpus.getValidReff(gvrBook2).length == 3, true);

testMethod(multiTextCorpus, `corpus.getValidReff() Version-Level in ${multiTextCorpus.summary} with ${gvrKnown2Work}`, multiTextCorpus.getValidReff(gvrKnown2Work).length == 3);

testMethod(veryLargeCorpus, `corpus.getValidReff() Version-Level in ${veryLargeCorpus.summary} with ${gvrKnown2Work}`, veryLargeCorpus.getValidReff(gvrKnown2Work).length == 13);

testMethod(multiTextCorpus, `corpus.getValidReff() Work-Level in ${multiTextCorpus.summary} with ${gvrKnown2Work2}`, multiTextCorpus.getValidReff(gvrKnown2Work2).length == 3);

testMethod(veryLargeCorpus, `corpus.getValidReff() Work-Level in ${veryLargeCorpus.summary} with ${gvrKnown2Work2}`, veryLargeCorpus.getValidReff(gvrKnown2Work2).length == 13);

try {
	testMethod(multiTextCorpus, `corpus.getValidReff() 1.x-1.2  in ${multiTextCorpus.summary} with ${reallyBadUrn1}`, multiTextCorpus.getValidReff(reallyBadUrn1).length == 2);
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. SHOULD HAVE ERRORED. GetValidReff() failed to error on missing URN.</p></div>`;
		failedCount = failedCount + 1;
		testCount = testCount + 1;
} catch(error) {
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. ERRORED! GetValidReff(): ${error.message}</p></div>`;	
}

try {
	testMethod(multiTextCorpus, `corpus.getValidReff() 1.1-1.x  in ${multiTextCorpus.summary} with ${reallyBadUrn2}`, multiTextCorpus.getValidReff(reallyBadUrn2).length == 2);
	targetElement.innerHTML += `<div><p  style="color: red;">${testCount}. SHOULD HAVE ERRORED. GetValidReff() failed to error on missing URN.</p></div>`;
		failedCount = failedCount + 1;
		testCount = testCount + 1;
} catch(error) {
	testCount = testCount + 1;
	passedCount = passedCount + 1;
	errorCount = errorCount + 1;
  targetElement.innerHTML += `<div><p  style="color: navy;">${testCount}. ERRORED! GetValidReff(): ${error.message}</p></div>`;	
}



// CtsCorpus.isValidRange()
targetElement.innerHTML += `<h3>CtsCorpus.isValidRange</h3>`;

var vRange1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.610-2.2");
var vRange2 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token1-1.444.token8");
var vRange3 = CtsUrn.fromString("urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token1-4.token7");
var vRange5 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.3");
var ivRange1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1-2");
var ivRange2 = CtsUrn.fromString("urn:cts:greekLit:tlg0013.tlg005.fucex.tok:1.token1-5.token7");

testMethod(veryLargeCorpus, `corpus.isValidRange(${vRange1}) in ${veryLargeCorpus.summary}`, veryLargeCorpus.isValidRange(vRange1) );

testMethod(veryLargeCorpus, `corpus.isValidRange(${vRange2}) in ${veryLargeCorpus.summary}`, veryLargeCorpus.isValidRange(vRange2) );

testMethod(veryLargeCorpus, `corpus.isValidRange(${vRange3}) in ${veryLargeCorpus.summary}`, veryLargeCorpus.isValidRange(vRange3) );

testMethod(c1, `corpus.isValidRange(${vRange5}) in ${c1.summary}`, c1.isValidRange(vRange5) );

testMethod(veryLargeCorpus, `SHOULD FAIL: corpus.isValidRange(${ivRange1}) in ${veryLargeCorpus.summary}`, veryLargeCorpus.isValidRange(ivRange1), true );

testMethod(veryLargeCorpus, `SHOULD FAIL: corpus.isValidRange(${ivRange2}) in ${veryLargeCorpus.summary}`, veryLargeCorpus.isValidRange(ivRange2), true);

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

testMethod(veryLargeCorpus, `corpus.corpusRanges() in ${veryLargeCorpus.summary}`, veryLargeCorpus.corpusRanges().toString() == vlcRA.toString());

testMethod(veryLargeCorpus, `corpus.corpusRanges("urn:cts:greekLit:tlg0012.tlg001.allen:") in ${veryLargeCorpus.summary}`, veryLargeCorpus.corpusRanges(CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:")).toString() == [vlcr1].toString());

testMethod(c1, `corpus.corpusRanges("urn:cts:greekLit:tlg0012.tlg001:") in ${c1.summary}`, c1.corpusRanges(CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001:")).toString() == [c1r].toString());

testMethod(c1, `corpus.corpusRanges("urn:cts:greekLit:tlg0012.tlg001.allen:") in ${c1.summary}`, c1.corpusRanges(CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:")).toString() == [c1r].toString());

testMethod(c1, `corpus.corpusRanges("urn:cts:greekLit:tlg0012.tlg001.allen:1") in ${c1.summary}`, c1.corpusRanges(CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1")).toString() == [c1r].toString());

var line443Urn = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.tok:");
var line443Range = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg002.murray.tok:1.443.token1-2.2.token7")

testMethod(veryLargeCorpus, `corpus.corpusRanges(${line443Urn}) in ${veryLargeCorpus.summary}`, veryLargeCorpus.corpusRanges(line443Urn).toString() == [line443Range].toString());

// CtsCorpus.listTexts()
targetElement.innerHTML += `<h3>CtsCorpus.listTexts</h3>`;

var lturn1 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:");
var lturn2 = odysseyWork;
var lturn3 = odysseyVersion;
var lturn4 = odysseyToken;
var lturn5 = CtsUrn.fromString("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");


testMethod(multiTextCorpus, `corpus.listTexts() in ${multiTextCorpus.summary}`, multiTextCorpus.listTexts().toString() == [lturn1, lturn3, lturn4].toString() );

testMethod(multiTextCorpus, `corpus.listTexts() in ${multiTextCorpus.summary}`, multiTextCorpus.listTexts(lturn2).toString() == [lturn3, lturn4].toString() );

testMethod(multiTextCorpus, `corpus.listTexts() in ${multiTextCorpus.summary}`, multiTextCorpus.listTexts(lturn3).toString() == [lturn3, lturn4].toString() );

testMethod(multiTextCorpus, `corpus.listTexts() in ${multiTextCorpus.summary}`, multiTextCorpus.listTexts(lturn4).toString() == [lturn4].toString() );

testMethod(multiTextCorpus, `corpus.listTexts() in ${multiTextCorpus.summary}`, multiTextCorpus.listTexts(lturn5).toString() == [lturn1].toString() );

// CtsCorpus.rangesFromPassages()
targetElement.innerHTML += `<h3>CtsCorpus.rangesFromPassages</h3>`;

testMethod(c1, `corpus.rangesFromPassages() in ${c1.summary}`, c1.rangesFromPassages([p1,p2]).toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.2" );

testMethod(c1, `corpus.rangesFromPassages() in ${c1.summary}`, c1.rangesFromPassages([p2,p3]).toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.2-1.3" );

// =========================================================
// -- Refining / Text Retrieval Methods

// CtsCorpus.textCorpora()
targetElement.innerHTML += `<h3>CtsCorpus.textCorpora</h3>`;

testMethod(multiTextCorpus, `corpus.textCorpora() in ${multiTextCorpus.summary}`, multiTextCorpus.textCorpora().length == 3 );

testMethod(multiTextCorpus, `corpus.textCorpora() in ${multiTextCorpus.summary}`, multiTextCorpus.textCorpora()[0].urns[0].toString() == "urn:cts:greekLit:tlg0012.tlg001.allen:1.1" );

testMethod(multiTextCorpus, `corpus.textCorpora() in ${multiTextCorpus.summary}`, multiTextCorpus.textCorpora()[1].urns[0].toString() == "urn:cts:greekLit:tlg0012.tlg002.murray:1.1" );

testMethod(multiTextCorpus, `corpus.textCorpora() in ${multiTextCorpus.summary}`, multiTextCorpus.textCorpora()[2].urns[0].toString() == "urn:cts:greekLit:tlg0012.tlg002.murray.token:1.1.1" );


// CtsCorpus.getPassage()
targetElement.innerHTML += `<h3>CtsCorpus.getPassage</h3>`;

testMethod(multiTextCorpus, `corpus.getPassage() in ${multiTextCorpus.summary} with ${gvrKnown2Work3}`, multiTextCorpus.getPassage(gvrKnown2Work3));

// CtsCorpus.getText()
targetElement.innerHTML += `<h3>CtsCorpus.getText</h3>`;




// CtsCorpus.findPassages()
targetElement.innerHTML += `<h3>CtsCorpus.findPassages</h3>`;

			// specify just a text
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

// ==================== FINAL SUMMARY ====================
showSummary();