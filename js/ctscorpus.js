
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
