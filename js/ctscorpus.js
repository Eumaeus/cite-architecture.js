
// --------------------------
// --- CtsCorpus Class -----
//
// A `CtsCorpus` is an Array of `CtsPassage` objects. 

// **The order of the elements in the array is significant.**
// 
// Create a new `CtsCorpus` object with:
// 
//     psg1 = new CtsPassage(new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1"), "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος");
//     psg2 = new CtsPassage(new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2"),  "οὐλομένην, ἣ μυρί’ Ἀχαιοῖς ἄλγε’ ἔθηκε,");
//     psg3 = new CtsPassage(new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.3"), "πολλὰς δ’ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν");
//     
//     my_ctscorpus = new CtsCorpus([ psg1, psg2, psg3]);
// 
// --------------------------

class CtsCorpusError extends Error {
  constructor(message) {
    super(message);
    this.name = "CtsCorpusError";
  }
}

class CtsCorpus {
  constructor(passageArray) {
    if ( !(passageArray instanceof Array)) {
      throw new CtsCorpusError("passageArray must be an array.");
    }
    if (!passageArray.every(item => item instanceof CtsPassage)) {
      throw new CtsCorpusError("passageArray must be an array of CtsPassage objects.");
    }

    // Validate uniquiness of URNs here

    // Validate atomic urns here

    // Validate no interleaved texts here.

    this.passages = passageArray;
    this.length = this.passages.length;
    this.summary = `CtsCorpus (${this.length} passages): [ ${this.passages[0].urn}: ${this.passages[0].text.slice(0, 7)}… ]`;
  }	

  toString() {
    return this.passages.map(p => p.toString()).join("\n");
  }
}