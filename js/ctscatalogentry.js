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
		if ((typeof citationScheme !== "string") || (citationScheme = "")) {
  		throw new CtsCatalogEntryError("`citationScheme` must be a non-empty string");
		}

		if ((typeof textgroup !== "string") || (textgroup == "")) {
  		throw new CtsCatalogEntryError("`textgroup` must be a non-empty string");
		}

		if (typeof work !== "string") {
  		throw new CtsCatalogEntryError("`work` must be a string");
		}
		if ( ctsurn.getWork() && (textgroup == "")  ) {
  		throw new CtsCatalogEntryError(`There must be a work-description for ${ctsurn.getWork()}.`);
		}


		if (typeof version !== "string") {
  		throw new CtsCatalogEntryError("`version` must be a string");
		}
		if ( ctsurn.getVersion() && (version == "")  ) {
  		throw new CtsCatalogEntryError(`There must be a version-description for ${ctsurn.getVersion()}.`);
		}

		if (typeof exemplar !== "string") {
  		throw new CtsCatalogEntryError("`exemplar` must be a string");
		}
		if ( ctsurn.getExemplar() && (exemplar == "")  ) {
  		throw new CtsCatalogEntryError(`There must be a version-description for ${ctsurn.getExemplar()}.`);
		}

		if (typeof online !== "boolean") {
  		throw new CtsCatalogEntryError("`online` must be a Boolean (true/false)");
		}
		if (typeof lang !== "string") {
  		throw new CtsCatalogEntryError("`lang` must be a string");
		}
		if (lang.length != 3) {
  		throw new CtsCatalogEntryError("`lang` must be an ISO 639-2 3-letter language code.");
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
		this._toString = `${urn}: ${textgroup}, ${work}. ${version} (${lang}). ${exemplar}.`;
	} // constructor

	// =========================================================
	// Construction & Serialization

	// =========================================================
	// Accessing Properties

	// =========================================================
	// Comparison

	// =========================================================
	// Cataloging & Describing

} 

	// =========================================================
	// Construction & Serialization

