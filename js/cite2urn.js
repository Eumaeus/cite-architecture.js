/** 
 * --------------------------
 * --- Cite2Urn Class ---------
 *
 * A CITE2 URN is a machine-actionable identifier for 
 * *identification and retrieval of objects in a versioned 
 * * collection of objects that share a defined set of 
 * * properties; the collection may be ordered or unordered.*
 * 
 * This library offers functions for working with CITE2 URNs.
 *
 * --------------------------
**/


/** 
 * --- Define Cite2UrnError ---
**/

class Cite2UrnError extends Error {
  constructor(message) {
    super(message);
    this.name = "Cite2UrnError";
  }
}

/** 
 * --- Cite2Urn Constructor ---
**/

class Cite2Urn {
	constructor(urnString) {
		if (typeof urnString !== "string" || urnString.trim() === "") {
			throw new Cite2UrnError("Cite2Urn must be a non-empty string");
		}

		const s = urnString.trim();

		if (!s.toLowerCase().startsWith("urn:cite2:")) {
			throw new Cite2UrnError(`Cite2Urn must start with "urn:cite2:" — got "${s}"`);
		}

		const parts = s.split(":");

		if (parts.length != 5) {
			throw new Cite2UrnError(
			`Cite2Urn must have exactly 5 colon-separated components — got "${s}"`
		);
		}

		this.nid = parts[1].toLowerCase();
		this.nss = parts[2];

		// … Much to be done…

	} // constructor

	// factory constructor
	static fromString(urnString) {
		return new Cite2Urn(urnString);
	}


} // end `class Cite2Urn`

















