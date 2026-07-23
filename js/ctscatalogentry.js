// --------------------------
// --- CtsCatalogEntry Class -----
//
// A `CtsPassage` provides metadata for a CTS text.
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

class CtsCatalogEntryError extends Error {
  constructor(message) {
    super(message);
    this.name = "CtsCatalogEntryError";
  }
}

class CtsCatalogEntry {
	constructor(ctsurn, citationscheme, textgroup, work, version, exemplar, online, lang) {
		if (!(ctsurn instanceof CtsUrn)) {
			throw new CtsCatalogEntryError(`'${ctsurn}' is not a valid CtsUrn.`);
		}
		if (ctsurn.hasPassage()) {
		  throw new CtsCatalogEntryError(`CtsCatalogEntry cannot be constructed from a URN with a passage-component ('${ctsurn.passage}'): ${ctsurn}`);
		}
		if (typeof citationScheme !== "string") {
  		throw new CtsCatalogEntryError("`citationScheme` must be a string");
		}
		if (typeof textgroup !== "string") {
  		throw new CtsCatalogEntryError("`textgroup` must be a string");
		}
		if (typeof work !== "string") {
  		throw new CtsCatalogEntryError("`work` must be a string");
		}
		if (typeof version !== "string") {
  		throw new CtsCatalogEntryError("`version` must be a string");
		}
		if (typeof exemplar !== "string") {
  		throw new CtsCatalogEntryError("`exemplar` must be a string");
		}
		if (typeof online !== "boolean") {
  		throw new CtsCatalogEntryError("`online` must be a Boolean (true/false)");
		}
		if (typeof lang !== "string") {
  		throw new CtsCatalogEntryError("`lang` must be a string");
		}

		// Basic Properties
		this.urn = ctsurn;
		this.citationScheme = citationScheme.trim();
		this.textgroup = textgroup.trim();
		this.work = work.trim();
		this.version = version.trim();
		this.exemplar = exemplar.trim();
		this.online = online
		this.lang = lang.trim();
		// Convenience Properties
		this.parts = [urn, citationScheme, textgroup, work, version, exemplar, online.toString(), lang];


	} // constructor

	// In js/ctspassage.js, inside class CtsPassage
	static fromString(cexstring, delimiter = '#') {
		if (typeof cexstring !== 'string') {
			throw new CtsCatalogEntryError("Input must be a string.");
		}
		const parts = cexstring.split(delimiter);
		if (parts.length < 8) {
			throw new CtsCatalogEntryError(`String must contain eight values (some may be empty) separated by delimiter '${delimiter}'. The default delimiter may be overridden with the 'delimiter' parameter.`);
		}
		const urnStr = parts[0].trim();
		const urn = new CtsUrn(urnStr);
		const citationscheme = parts[1].trim();
		const group = parts[1].trim();
		const work = (parts[2].trim() != "") ? parts[2].trim() : null;
		const version = (parts[3].trim() != "") ? parts[3].trim() : null;
		const exemplar = (parts[4].trim() != "") ? parts[4].trim() : null;
		const online = parts[6] === "true";
		const lang = parts[1].trim();

		new CtsCatalogEntry(urn, citationscheme, group, work, version, exemplar, online, lang);
		
	}

}

	ctsUrn() {
		return this.urn;
	}

	citationScheme() {
		return this.citationScheme;
	}


	toString( delimiter = '#') {
		return this.parts.join(delimiter);
	}

	equals(other) {
  	return this.toString() == other.toString();
  }

	// Intercepts the comparison when compared to a primitive
	[Symbol.toPrimitive](hint) {
		return this.toString(); 
	}

}

