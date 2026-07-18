// --------------------------
// --- CtsPassage Class -----
//
// A `CtsPassage` unites text-content with a citation. A `CtsPassage` object has two components:
// 
// 1. A `CtsUrn` (which may **not** be a range-urn).
// 2. A `string`.
// 
// Create a new `CtsPassage` object with, *e.g.*:
// 
//    my_ctsurn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
//    my_text = "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος";
// 
//    my_ctspassage = new CtsPassage(my_ctsurn, my_text);
//
// --------------------------

class CtsPassageError extends Error {
  constructor(message) {
    super(message);
    this.name = "CtsPassageError";
  }
}

class CtsPassage {
	constructor(ctsurn, text) {
		if (typeof ctsurn !== "CtsUrn") {
			throw new CtsPassageError(`'${ctsurn}' is not a valid CtsUrn.`);
		}

		this.urn = ctsurn;
		this.text = text.trim();

	} // constructor

	getUrn() {
		return this.urn;
	}

	getText() {
		return this.text;
	}

	toString( delimiter = '#') {
		return this.urn.toString() + delimiter + this.text();
	}

	 equals(other) {
  	return this.toString() == other.toString();
  }

	// Intercepts the comparison when compared to a primitive
	[Symbol.toPrimitive](hint) {
		return this.toString(); 
	}

}

